namespace CompraLatino.Api.Domain;

public class UserProfile
{
    public int Id { get; set; }
    public string FirebaseUid { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

public class Product
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal PriceJpy { get; set; }
    public decimal MarginPercent { get; set; } = 18m;
    public bool IsActive { get; set; } = true;
    public DateTime SyncedAtUtc { get; set; } = DateTime.UtcNow;
}

public class Order
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public int UserProfileId { get; set; }
    public UserProfile? UserProfile { get; set; }
    public string Status { get; set; } = OrderStatuses.PendingPayment;
    public decimal FxRate { get; set; }
    public decimal SubtotalLocal { get; set; }
    public decimal TotalLocal { get; set; }
    public string Currency { get; set; } = "USD";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public Payment? Payment { get; set; }
    public ICollection<IntegrationEvent> IntegrationEvents { get; set; } = new List<IntegrationEvent>();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public string TitleSnapshot { get; set; } = string.Empty;
    public string CategorySnapshot { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPriceJpy { get; set; }
    public decimal UnitPriceLocal { get; set; }
}

public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public string WompiTransactionId { get; set; } = string.Empty;
    public string Status { get; set; } = PaymentStatuses.Pending;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? ConfirmedAtUtc { get; set; }
}

public class IntegrationEvent
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public string Provider { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Result { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

public static class OrderStatuses
{
    public const string PendingPayment = "PendingPayment";
    public const string Paid = "Paid";
    public const string Executing = "Executing";
    public const string Completed = "Completed";
    public const string Compensation = "Compensation";
    public const string Cancelled = "Cancelled";
    public const string Declined = "Declined";
}

public static class PaymentStatuses
{
    public const string Pending = "Pending";
    public const string Approved = "Approved";
    public const string Declined = "Declined";
    public const string Refunded = "Refunded";
}
