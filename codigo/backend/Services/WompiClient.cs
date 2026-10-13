using System.Security.Cryptography;
using System.Text;

namespace CompraLatino.Api.Services;

public class WompiClient
{
    private readonly IConfiguration _configuration;

    public WompiClient(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string TransactionId, string CheckoutUrl) CreateTransaction(decimal amount, string currency, string orderCode)
    {
        var transactionId = $"wompi_{Guid.NewGuid():N}";
        var checkoutUrl = $"/checkout/mock?tx={transactionId}&order={orderCode}&amount={amount}&currency={currency}";
        return (transactionId, checkoutUrl);
    }

    public bool VerifySignature(string transactionId, string status, string signature)
    {
        var secret = _configuration["Wompi:WebhookSecret"] ?? "compralatino-wompi-dev";
        var expected = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes($"{transactionId}|{status}|{secret}"))).ToLowerInvariant();
        return string.Equals(expected, signature, StringComparison.OrdinalIgnoreCase);
    }

    public string Sign(string transactionId, string status)
    {
        var secret = _configuration["Wompi:WebhookSecret"] ?? "compralatino-wompi-dev";
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes($"{transactionId}|{status}|{secret}"))).ToLowerInvariant();
    }
}
