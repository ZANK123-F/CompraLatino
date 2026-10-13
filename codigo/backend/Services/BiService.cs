using CompraLatino.Api.Data;
using CompraLatino.Api.Domain;
using CompraLatino.Api.Dtos;
using Microsoft.EntityFrameworkCore;

namespace CompraLatino.Api.Services;

public class BiService
{
    private readonly AppDbContext _db;

    public BiService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<BiDashboardDto> GetDashboardAsync()
    {
        var orders = await _db.Orders.Include(x => x.Items).Include(x => x.Payment).ToListAsync();
        var events = await _db.IntegrationEvents.ToListAsync();

        var completed = orders.Where(x => x.Status == OrderStatuses.Completed).ToList();
        var approvedPayments = orders.Count(x => x.Payment?.Status == PaymentStatuses.Approved);
        var declinedPayments = orders.Count(x => x.Payment?.Status == PaymentStatuses.Declined);
        var pendingPayments = orders.Count(x => x.Payment?.Status == PaymentStatuses.Pending);
        var yaSuccess = events.Count(x => x.Provider == "YAuctions" && x.Result == "Success");
        var yaFail = events.Count(x => x.Provider == "YAuctions" && x.Result == "Rejected");

        var kpis = new List<BiKpiDto>
        {
            new("orders", "Ordenes totales", orders.Count, "count"),
            new("revenue", "Ingresos aprobados", completed.Sum(x => x.TotalLocal), "USD"),
            new("approval", "Tasa aprobacion Wompi", orders.Count == 0 ? 0 : Math.Round(100m * approvedPayments / orders.Count, 1), "%"),
            new("ya_success", "Exito YAuctions", yaSuccess + yaFail == 0 ? 0 : Math.Round(100m * yaSuccess / (yaSuccess + yaFail), 1), "%"),
            new("compensation", "Ordenes en compensacion", orders.Count(x => x.Status == OrderStatuses.Compensation), "count"),
            new("customers", "Clientes con compra", orders.Select(x => x.UserProfileId).Distinct().Count(), "count")
        };

        var salesByDay = completed
            .GroupBy(x => x.CreatedAtUtc.Date)
            .OrderBy(x => x.Key)
            .Select(g => new BiSeriesPointDto(g.Key.ToString("dd/MM"), g.Sum(x => x.TotalLocal)))
            .ToList();

        if (salesByDay.Count == 0)
            salesByDay.Add(new BiSeriesPointDto(DateTime.UtcNow.ToString("dd/MM"), 0));

        var topCategories = orders.SelectMany(x => x.Items)
            .GroupBy(x => x.CategorySnapshot)
            .OrderByDescending(g => g.Sum(i => i.UnitPriceLocal * i.Quantity))
            .Take(6)
            .Select(g => new BiSeriesPointDto(g.Key, g.Sum(i => i.UnitPriceLocal * i.Quantity)))
            .ToList();

        if (topCategories.Count == 0)
            topCategories.Add(new BiSeriesPointDto("Sin datos", 0));

        var funnel = new List<BiSeriesPointDto>
        {
            new("Pendientes", pendingPayments),
            new("Aprobados", approvedPayments),
            new("Declinados", declinedPayments)
        };

        var ya = new List<BiSeriesPointDto>
        {
            new("Exito", yaSuccess),
            new("Rechazo", yaFail)
        };

        return new BiDashboardDto(kpis, salesByDay, topCategories, funnel, ya);
    }
}
