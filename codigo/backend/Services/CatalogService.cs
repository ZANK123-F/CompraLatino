using CompraLatino.Api.Data;
using CompraLatino.Api.Dtos;
using Microsoft.EntityFrameworkCore;

namespace CompraLatino.Api.Services;

public class CatalogService
{
    private readonly AppDbContext _db;
    private readonly PricingService _pricing;

    public CatalogService(AppDbContext db, PricingService pricing)
    {
        _db = db;
        _pricing = pricing;
    }

    public async Task<List<ProductDto>> SearchAsync(string? q, string? category)
    {
        var query = _db.Products.AsQueryable().Where(x => x.IsActive);
        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim().ToLower();
            query = query.Where(x => x.Title.ToLower().Contains(term) || x.Description.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(x => x.Category == category);

        var items = await query.OrderBy(x => x.Title).ToListAsync();
        return items.Select(Map).ToList();
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var item = await _db.Products.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
        return item is null ? null : Map(item);
    }

    private ProductDto Map(Domain.Product x) => new(
        x.Id,
        x.ExternalId,
        x.Title,
        x.Category,
        x.Description,
        x.ImageUrl,
        x.PriceJpy,
        _pricing.ToLocal(x.PriceJpy, x.MarginPercent),
        _pricing.FxRate,
        _pricing.Currency);
}
