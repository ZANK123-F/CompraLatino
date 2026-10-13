using CompraLatino.Api.Data;
using CompraLatino.Api.Domain;
using CompraLatino.Api.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace CompraLatino.Api.Services;

public class OrderService
{
    private readonly AppDbContext _db;
    private readonly PricingService _pricing;
    private readonly WompiClient _wompi;
    private readonly YAuctionsClient _yAuctions;

    public OrderService(AppDbContext db, PricingService pricing, WompiClient wompi, YAuctionsClient yAuctions)
    {
        _db = db;
        _pricing = pricing;
        _wompi = wompi;
        _yAuctions = yAuctions;
    }

    public async Task<CheckoutResponse> CreateCheckoutAsync(int userId, CreateOrderRequest request)
    {
        if (request.Items is null || request.Items.Count == 0)
            throw new InvalidOperationException("El carrito esta vacio.");

        var productIds = request.Items.Select(x => x.ProductId).Distinct().ToList();
        var products = await _db.Products.Where(x => productIds.Contains(x.Id) && x.IsActive).ToListAsync();
        if (products.Count != productIds.Count)
            throw new InvalidOperationException("Uno o mas productos no estan disponibles.");

        var order = new Order
        {
            Code = $"CL-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(100000, 999999)}",
            UserProfileId = userId,
            Status = OrderStatuses.PendingPayment,
            FxRate = _pricing.FxRate,
            Currency = _pricing.Currency
        };

        decimal total = 0m;
        foreach (var line in request.Items)
        {
            var product = products.First(x => x.Id == line.ProductId);
            var unitLocal = _pricing.ToLocal(product.PriceJpy, product.MarginPercent);
            total += unitLocal * line.Quantity;
            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                TitleSnapshot = product.Title,
                CategorySnapshot = product.Category,
                Quantity = line.Quantity,
                UnitPriceJpy = product.PriceJpy,
                UnitPriceLocal = unitLocal
            });
        }

        order.SubtotalLocal = total;
        order.TotalLocal = total;

        var (txId, checkoutUrl) = _wompi.CreateTransaction(total, order.Currency, order.Code);
        order.Payment = new Payment
        {
            WompiTransactionId = txId,
            Status = PaymentStatuses.Pending,
            Amount = total,
            Currency = order.Currency
        };

        order.IntegrationEvents.Add(new IntegrationEvent
        {
            Provider = "Wompi",
            Action = "CreateTransaction",
            Result = "Pending",
            Payload = JsonSerializer.Serialize(new { txId, total, order.Currency })
        });

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return new CheckoutResponse(MapOrder(order), checkoutUrl, txId);
    }

    public async Task<OrderDto> ConfirmWompiAsync(WompiWebhookRequest request)
    {
        if (!_wompi.VerifySignature(request.TransactionId, request.Status, request.Signature))
            throw new InvalidOperationException("Firma Wompi invalida.");

        var order = await _db.Orders
            .Include(x => x.Items).ThenInclude(x => x.Product)
            .Include(x => x.Payment)
            .Include(x => x.IntegrationEvents)
            .FirstOrDefaultAsync(x => x.Payment != null && x.Payment.WompiTransactionId == request.TransactionId)
            ?? throw new InvalidOperationException("Orden no encontrada para la transaccion.");

        order.IntegrationEvents.Add(new IntegrationEvent
        {
            Provider = "Wompi",
            Action = "Webhook",
            Result = request.Status,
            Payload = JsonSerializer.Serialize(request)
        });

        if (string.Equals(request.Status, "Approved", StringComparison.OrdinalIgnoreCase))
        {
            order.Payment!.Status = PaymentStatuses.Approved;
            order.Payment.ConfirmedAtUtc = DateTime.UtcNow;
            order.Status = OrderStatuses.Paid;
            order.UpdatedAtUtc = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            await ExecuteYAuctionsAsync(order);
        }
        else
        {
            order.Payment!.Status = PaymentStatuses.Declined;
            order.Status = OrderStatuses.Declined;
            order.UpdatedAtUtc = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        return MapOrder(order);
    }

    private async Task ExecuteYAuctionsAsync(Order order)
    {
        order.Status = OrderStatuses.Executing;
        order.UpdatedAtUtc = DateTime.UtcNow;
        var allOk = true;

        foreach (var item in order.Items)
        {
            var externalId = item.Product?.ExternalId ?? "UNKNOWN";
            var (success, reference, message) = await _yAuctions.ExecutePurchaseAsync(externalId, item.Quantity);
            order.IntegrationEvents.Add(new IntegrationEvent
            {
                Provider = "YAuctions",
                Action = "ExecutePurchase",
                Result = success ? "Success" : "Rejected",
                Payload = JsonSerializer.Serialize(new { reference, message, externalId, item.Quantity })
            });
            if (!success) allOk = false;
        }

        order.Status = allOk ? OrderStatuses.Completed : OrderStatuses.Compensation;
        order.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task<List<OrderDto>> GetForUserAsync(int userId)
    {
        var orders = await _db.Orders
            .Include(x => x.Items)
            .Include(x => x.Payment)
            .Where(x => x.UserProfileId == userId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync();
        return orders.Select(MapOrder).ToList();
    }

    public async Task<List<OrderDto>> GetAllAsync()
    {
        var orders = await _db.Orders
            .Include(x => x.Items)
            .Include(x => x.Payment)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync();
        return orders.Select(MapOrder).ToList();
    }

    public async Task<OrderDto?> GetByIdAsync(int id, int userId, bool isAdmin)
    {
        var order = await _db.Orders
            .Include(x => x.Items)
            .Include(x => x.Payment)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (order is null) return null;
        if (!isAdmin && order.UserProfileId != userId) return null;
        return MapOrder(order);
    }

    private static OrderDto MapOrder(Order order) => new(
        order.Id,
        order.Code,
        order.Status,
        order.TotalLocal,
        order.Currency,
        order.CreatedAtUtc,
        order.Items.Select(i => new OrderItemDto(i.ProductId, i.TitleSnapshot, i.CategorySnapshot, i.Quantity, i.UnitPriceLocal, i.UnitPriceJpy)).ToList(),
        order.Payment is null ? null : new PaymentDto(order.Payment.WompiTransactionId, order.Payment.Status, order.Payment.Amount, order.Payment.Currency));
}
