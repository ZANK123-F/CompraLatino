using CompraLatino.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace CompraLatino.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        if (!await db.Users.AnyAsync())
        {
            db.Users.AddRange(
                new UserProfile
                {
                    FirebaseUid = "uid-admin-001",
                    Email = "admin@compralatino.com",
                    FullName = "Admin CompraLatino",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Role = "Admin"
                },
                new UserProfile
                {
                    FirebaseUid = "uid-cliente-001",
                    Email = "cliente@demo.com",
                    FullName = "Cliente Demo",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Cliente123!"),
                    Role = "Customer"
                });
        }

        if (!await db.Products.AnyAsync())
        {
            db.Products.AddRange(
                new Product
                {
                    ExternalId = "YA-1001",
                    Title = "Figura coleccionable edición limitada",
                    Category = "Coleccionables",
                    Description = "Figura importada desde YAuctions con embalaje original.",
                    ImageUrl = "https://images.unsplash.com/photo-1601814938122-77c0d41d4f5a?w=800",
                    PriceJpy = 12800m,
                    MarginPercent = 20m
                },
                new Product
                {
                    ExternalId = "YA-1002",
                    Title = "Cámara compacta usada premium",
                    Category = "Electronica",
                    Description = "Cámara compacta en excelente estado, lote japonés.",
                    ImageUrl = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
                    PriceJpy = 45500m,
                    MarginPercent = 16m
                },
                new Product
                {
                    ExternalId = "YA-1003",
                    Title = "Reloj automático vintage",
                    Category = "Moda",
                    Description = "Reloj mecánico con pulsera de acero, subasta rápida.",
                    ImageUrl = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
                    PriceJpy = 28900m,
                    MarginPercent = 22m
                },
                new Product
                {
                    ExternalId = "YA-1004",
                    Title = "Consola retro portátil",
                    Category = "Electronica",
                    Description = "Consola portátil restaurada con juegos incluidos.",
                    ImageUrl = "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",
                    PriceJpy = 19800m,
                    MarginPercent = 18m
                },
                new Product
                {
                    ExternalId = "YA-1005",
                    Title = "Kit de cocina japonesa",
                    Category = "Hogar",
                    Description = "Set de cuchillos y utensilios de marca japonesa.",
                    ImageUrl = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
                    PriceJpy = 15600m,
                    MarginPercent = 17m
                },
                new Product
                {
                    ExternalId = "YA-1006",
                    Title = "Vinilo edición japonesa",
                    Category = "Musica",
                    Description = "Disco de vinilo importado con obi strip original.",
                    ImageUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
                    PriceJpy = 4200m,
                    MarginPercent = 25m
                },
                new Product
                {
                    ExternalId = "YA-1007",
                    Title = "Lente fotográfico usado",
                    Category = "Electronica",
                    Description = "Lente compatible con monturas populares, revisión óptica.",
                    ImageUrl = "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800",
                    PriceJpy = 67200m,
                    MarginPercent = 15m
                },
                new Product
                {
                    ExternalId = "YA-1008",
                    Title = "Bolso de diseñador outlet",
                    Category = "Moda",
                    Description = "Artículo de moda con autenticidad verificada en origen.",
                    ImageUrl = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
                    PriceJpy = 33400m,
                    MarginPercent = 21m
                });
        }

        await db.SaveChangesAsync();
    }
}
