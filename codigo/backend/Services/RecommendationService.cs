using CompraLatino.Api.Data;
using CompraLatino.Api.Domain;
using CompraLatino.Api.Dtos;
using Microsoft.EntityFrameworkCore;

namespace CompraLatino.Api.Services;

public class RecommendationService
{
    private readonly AppDbContext _db;
    private readonly PricingService _pricing;

    public RecommendationService(AppDbContext db, PricingService pricing)
    {
        _db = db;
        _pricing = pricing;
    }

    public async Task<List<RecommendationDto>> GetForUserAsync(int userId)
    {
        var categories = await _db.Orders
            .Where(o => o.UserProfileId == userId && o.Status == OrderStatuses.Completed)
            .SelectMany(o => o.Items)
            .GroupBy(i => i.CategorySnapshot)
            .Select(g => new { Category = g.Key, Count = g.Sum(x => x.Quantity) })
            .OrderByDescending(x => x.Count)
            .Take(3)
            .ToListAsync();

        var boughtIds = await _db.Orders
            .Where(o => o.UserProfileId == userId)
            .SelectMany(o => o.Items)
            .Select(i => i.ProductId)
            .Distinct()
            .ToListAsync();

        List<Product> candidates;
        string reason;
        if (categories.Count > 0)
        {
            var cats = categories.Select(x => x.Category).ToList();
            candidates = await _db.Products
                .Where(p => p.IsActive && cats.Contains(p.Category) && !boughtIds.Contains(p.Id))
                .Take(8)
                .ToListAsync();
            reason = "Basado en tu historial de compras";
        }
        else
        {
            candidates = await _db.Products.Where(p => p.IsActive).OrderByDescending(p => p.Id).Take(8).ToListAsync();
            reason = "Destacados de CompraLatino";
        }

        return candidates.Select(p => new RecommendationDto(
            p.Id,
            p.Title,
            p.Category,
            p.ImageUrl,
            _pricing.ToLocal(p.PriceJpy, p.MarginPercent),
            reason)).ToList();
    }
}
