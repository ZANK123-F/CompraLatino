namespace CompraLatino.Api.Services;

public class PricingService
{
    public decimal FxRate => 0.0068m;
    public string Currency => "USD";

    public decimal ToLocal(decimal priceJpy, decimal marginPercent)
    {
        var baseLocal = priceJpy * FxRate;
        var withMargin = baseLocal * (1m + marginPercent / 100m);
        return Math.Round(withMargin, 2, MidpointRounding.AwayFromZero);
    }
}
