using CompraLatino.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace CompraLatino.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<UserProfile> Users => Set<UserProfile>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<IntegrationEvent> IntegrationEvents => Set<IntegrationEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserProfile>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<UserProfile>().HasIndex(x => x.FirebaseUid).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(x => x.ExternalId).IsUnique();
        modelBuilder.Entity<Order>().HasIndex(x => x.Code).IsUnique();
        modelBuilder.Entity<Payment>().HasIndex(x => x.WompiTransactionId).IsUnique();
        modelBuilder.Entity<Order>()
            .HasOne(x => x.Payment)
            .WithOne(x => x.Order!)
            .HasForeignKey<Payment>(x => x.OrderId);
    }
}
