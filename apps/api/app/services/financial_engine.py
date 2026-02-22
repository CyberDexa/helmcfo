"""Deterministic financial computation engine.

CRITICAL: All calculations use integer cents. No floating point for money.
LLMs reason about *what to calculate*. This module does the actual math.
"""

from dataclasses import dataclass
from datetime import date, timedelta


@dataclass
class BurnAnalysis:
    monthly_burn_cents: int
    monthly_revenue_cents: int
    net_burn_cents: int
    runway_months: float
    cash_out_date: date
    avg_daily_burn_cents: int


@dataclass
class OptimizationAction:
    description: str
    monthly_savings_cents: int
    one_time_recovery_cents: int
    category: str  # "invoice_collection", "subscription_cut", "expense_reduction"


@dataclass
class OptimizedRunway:
    original: BurnAnalysis
    optimized_burn_cents: int
    optimized_runway_months: float
    optimized_cash_out_date: date
    total_monthly_savings_cents: int
    total_one_time_recovery_cents: int
    actions: list[OptimizationAction]


def compute_burn_rate(
    transactions_by_month: dict[str, tuple[int, int]],  # {YYYY-MM: (inflow_cents, outflow_cents)}
    lookback_months: int = 6,
) -> tuple[int, int]:
    """Calculate average monthly inflow and outflow over lookback period.

    Returns (avg_monthly_inflow_cents, avg_monthly_outflow_cents).
    """
    if not transactions_by_month:
        return (0, 0)

    months = sorted(transactions_by_month.keys())[-lookback_months:]
    total_inflow = sum(transactions_by_month[m][0] for m in months)
    total_outflow = sum(transactions_by_month[m][1] for m in months)
    count = len(months)

    return (total_inflow // count, total_outflow // count)


def compute_runway(
    cash_position_cents: int,
    monthly_burn_cents: int,
    monthly_revenue_cents: int,
    reference_date: date | None = None,
) -> BurnAnalysis:
    """Calculate runway in months and cash-out date.

    Uses net burn (outflow - inflow) for runway calculation.
    """
    if reference_date is None:
        reference_date = date.today()

    net_burn = monthly_burn_cents - monthly_revenue_cents

    if net_burn <= 0:
        # Not burning cash — infinite runway (profitable or break-even)
        return BurnAnalysis(
            monthly_burn_cents=monthly_burn_cents,
            monthly_revenue_cents=monthly_revenue_cents,
            net_burn_cents=0,
            runway_months=999.0,
            cash_out_date=reference_date + timedelta(days=36500),  # ~100 years
            avg_daily_burn_cents=0,
        )

    runway_months = cash_position_cents / net_burn
    days_remaining = int(runway_months * 30.44)  # Avg days per month
    cash_out_date = reference_date + timedelta(days=days_remaining)
    avg_daily_burn = net_burn * 12 // 365

    return BurnAnalysis(
        monthly_burn_cents=monthly_burn_cents,
        monthly_revenue_cents=monthly_revenue_cents,
        net_burn_cents=net_burn,
        runway_months=round(runway_months, 1),
        cash_out_date=cash_out_date,
        avg_daily_burn_cents=avg_daily_burn,
    )


def compute_optimized_runway(
    burn: BurnAnalysis,
    cash_position_cents: int,
    actions: list[OptimizationAction],
    reference_date: date | None = None,
) -> OptimizedRunway:
    """Compute runway with proposed optimizations applied."""
    if reference_date is None:
        reference_date = date.today()

    total_monthly_savings = sum(a.monthly_savings_cents for a in actions)
    total_one_time = sum(a.one_time_recovery_cents for a in actions)

    optimized_burn = burn.monthly_burn_cents - total_monthly_savings
    optimized_cash = cash_position_cents + total_one_time

    optimized = compute_runway(
        optimized_cash,
        optimized_burn,
        burn.monthly_revenue_cents,
        reference_date,
    )

    return OptimizedRunway(
        original=burn,
        optimized_burn_cents=optimized.net_burn_cents,
        optimized_runway_months=optimized.runway_months,
        optimized_cash_out_date=optimized.cash_out_date,
        total_monthly_savings_cents=total_monthly_savings,
        total_one_time_recovery_cents=total_one_time,
        actions=actions,
    )


def compute_dso(
    total_receivables_cents: int,
    total_revenue_cents: int,
    period_days: int = 90,
) -> int:
    """Days Sales Outstanding — average days to collect payment."""
    if total_revenue_cents == 0:
        return 0
    daily_revenue = total_revenue_cents // period_days
    if daily_revenue == 0:
        return 0
    return total_receivables_cents // daily_revenue


def forecast_cash_flow(
    cash_position_cents: int,
    monthly_inflow_cents: int,
    monthly_outflow_cents: int,
    months_ahead: int = 6,
    growth_rate_pct: float = 0.0,  # Monthly revenue growth rate
) -> list[dict[str, int | str | bool]]:
    """Generate monthly cash flow forecast.

    Returns list of {month, inflow, outflow, net, balance, is_forecast}.
    """
    forecast = []
    balance = cash_position_cents
    current_inflow = monthly_inflow_cents

    for i in range(months_ahead):
        # Apply growth to inflow
        if i > 0:
            current_inflow = int(current_inflow * (1 + growth_rate_pct / 100))

        net = current_inflow - monthly_outflow_cents
        balance += net

        forecast.append({
            "month_offset": i + 1,
            "inflow_cents": current_inflow,
            "outflow_cents": monthly_outflow_cents,
            "net_cents": net,
            "balance_cents": balance,
            "is_forecast": True,
        })

    return forecast
