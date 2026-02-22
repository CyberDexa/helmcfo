"""Tests for the deterministic financial computation engine."""

from datetime import date

from app.services.financial_engine import (
    OptimizationAction,
    compute_burn_rate,
    compute_dso,
    compute_optimized_runway,
    compute_runway,
    forecast_cash_flow,
)


class TestBurnRate:
    def test_basic_burn_rate(self):
        data = {
            "2026-01": (200_000_00, 280_000_00),
            "2025-12": (190_000_00, 270_000_00),
            "2025-11": (185_000_00, 265_000_00),
        }
        inflow, outflow = compute_burn_rate(data, lookback_months=3)
        assert inflow == 191_666_66  # (200000+190000+185000)/3 in cents
        assert outflow == 271_666_66

    def test_empty_data(self):
        assert compute_burn_rate({}) == (0, 0)

    def test_lookback_limits(self):
        data = {
            "2026-01": (100_00, 200_00),
            "2025-12": (300_00, 400_00),
            "2025-11": (500_00, 600_00),
        }
        inflow, outflow = compute_burn_rate(data, lookback_months=2)
        # Should only use last 2 months: Jan + Dec
        assert inflow == 200_00
        assert outflow == 300_00


class TestRunway:
    def test_basic_runway(self):
        result = compute_runway(
            cash_position_cents=1_000_000_00,
            monthly_burn_cents=300_000_00,
            monthly_revenue_cents=200_000_00,
            reference_date=date(2026, 2, 1),
        )
        assert result.runway_months == 10.0  # $1M / $100K net burn
        assert result.net_burn_cents == 100_000_00
        assert result.monthly_burn_cents == 300_000_00

    def test_profitable_company(self):
        result = compute_runway(
            cash_position_cents=500_000_00,
            monthly_burn_cents=200_000_00,
            monthly_revenue_cents=300_000_00,
        )
        assert result.runway_months == 999.0  # Infinite (profitable)
        assert result.net_burn_cents == 0

    def test_zero_cash(self):
        result = compute_runway(
            cash_position_cents=0,
            monthly_burn_cents=200_000_00,
            monthly_revenue_cents=100_000_00,
            reference_date=date(2026, 2, 1),
        )
        assert result.runway_months == 0.0


class TestOptimizedRunway:
    def test_optimization_extends_runway(self):
        burn = compute_runway(
            cash_position_cents=500_000_00,
            monthly_burn_cents=287_000_00,
            monthly_revenue_cents=189_000_00,
            reference_date=date(2026, 2, 1),
        )
        actions = [
            OptimizationAction(
                description="Collect overdue invoices",
                monthly_savings_cents=0,
                one_time_recovery_cents=94_000_00,
                category="invoice_collection",
            ),
            OptimizationAction(
                description="Cancel unused SaaS",
                monthly_savings_cents=2_800_00,
                one_time_recovery_cents=0,
                category="subscription_cut",
            ),
        ]
        result = compute_optimized_runway(
            burn, 500_000_00, actions, reference_date=date(2026, 2, 1)
        )
        assert result.optimized_runway_months > burn.runway_months
        assert result.total_monthly_savings_cents == 2_800_00
        assert result.total_one_time_recovery_cents == 94_000_00


class TestDSO:
    def test_basic_dso(self):
        result = compute_dso(
            total_receivables_cents=94_000_00,
            total_revenue_cents=600_000_00,
            period_days=90,
        )
        # 94K / (600K/90) = 94K / 6.67K = ~14 days
        assert result == 14

    def test_zero_revenue(self):
        assert compute_dso(100_000_00, 0) == 0


class TestForecast:
    def test_basic_forecast(self):
        result = forecast_cash_flow(
            cash_position_cents=1_000_000_00,
            monthly_inflow_cents=200_000_00,
            monthly_outflow_cents=280_000_00,
            months_ahead=3,
        )
        assert len(result) == 3
        assert result[0]["balance_cents"] == 920_000_00  # 1M - 80K
        assert result[1]["balance_cents"] == 840_000_00  # 920K - 80K
        assert all(r["is_forecast"] for r in result)

    def test_with_growth(self):
        result = forecast_cash_flow(
            cash_position_cents=1_000_000_00,
            monthly_inflow_cents=200_000_00,
            monthly_outflow_cents=280_000_00,
            months_ahead=2,
            growth_rate_pct=10.0,  # 10% monthly growth
        )
        assert result[0]["inflow_cents"] == 200_000_00  # Month 1: no growth yet
        assert result[1]["inflow_cents"] == 220_000_00  # Month 2: +10%
