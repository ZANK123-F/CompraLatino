namespace CompraLatino.Api.Dtos;

public record RegisterRequest(string Email, string Password, string FullName);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, string Email, string FullName, string Role, string FirebaseUid);

public record ProductDto(
    int Id,
    string ExternalId,
    string Title,
    string Category,
    string Description,
    string ImageUrl,
    decimal PriceJpy,
    decimal PriceLocal,
    decimal FxRate,
    string Currency);

public record CartItemRequest(int ProductId, int Quantity);
public record CreateOrderRequest(List<CartItemRequest> Items);
public record OrderItemDto(int ProductId, string Title, string Category, int Quantity, decimal UnitPriceLocal, decimal UnitPriceJpy);
public record PaymentDto(string WompiTransactionId, string Status, decimal Amount, string Currency);
public record OrderDto(
    int Id,
    string Code,
    string Status,
    decimal TotalLocal,
    string Currency,
    DateTime CreatedAtUtc,
    List<OrderItemDto> Items,
    PaymentDto? Payment);

public record CheckoutResponse(OrderDto Order, string CheckoutUrl, string WompiTransactionId);
public record WompiWebhookRequest(string TransactionId, string Status, string Signature);
public record RecommendationDto(int ProductId, string Title, string Category, string ImageUrl, decimal PriceLocal, string Reason);

public record BiKpiDto(string Key, string Label, decimal Value, string Unit);
public record BiSeriesPointDto(string Label, decimal Value);
public record BiDashboardDto(
    List<BiKpiDto> Kpis,
    List<BiSeriesPointDto> SalesByDay,
    List<BiSeriesPointDto> TopCategories,
    List<BiSeriesPointDto> PaymentFunnel,
    List<BiSeriesPointDto> YAuctionsResults);
