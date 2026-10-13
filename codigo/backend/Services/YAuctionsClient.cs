namespace CompraLatino.Api.Services;

public class YAuctionsClient
{
    public Task<(bool Success, string ExternalReference, string Message)> ExecutePurchaseAsync(string externalProductId, int quantity)
    {
        var ok = !externalProductId.EndsWith("999", StringComparison.OrdinalIgnoreCase);
        var reference = $"YAEXEC-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}";
        var message = ok
            ? $"Compra ejecutada en YAuctions para {externalProductId} x{quantity}"
            : $"YAuctions rechazo la ejecucion de {externalProductId}";
        return Task.FromResult((ok, reference, message));
    }
}
