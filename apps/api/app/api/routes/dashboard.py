"""Dashboard API — serves the main financial overview (the "10x moment")."""

from datetime import date

from fastapi import APIRouter

from app.schemas import (
    CashFlowDataPoint,
    CashFlowResponse,
    FinancialOverview,
    InsightSeverity,
    RunwayAnalysis,
)

router = APIRouter()


@router.get("/overview", response_model=FinancialOverview)
async def get_financial_overview() -> FinancialOverview:
    """The "10x moment" — instant financial diagnosis.

    TODO: Replace demo data with real integration data.
    """
    return FinancialOverview(
        cash_position_cents=142_000_00,
        monthly_burn_cents=287_000_00,
        estimated_burn_cents=240_000_00,
        burn_delta_cents=47_000_00,
        runway_months=4.9,
        runway_end_date=date(2026, 8, 14),
        optimized_runway_months=7.3,
        optimized_runway_end_date=date(2026, 11, 2),
        mrr_cents=189_000_00,
        mrr_growth_pct=8.7,
        overdue_invoices_count=3,
        overdue_invoices_total_cents=94_000_00,
        avg_days_overdue=38,
        unused_subscriptions_count=4,
        unused_subscriptions_monthly_cents=2_800_00,
    )


@router.get("/cash-flow", response_model=CashFlowResponse)
async def get_cash_flow() -> CashFlowResponse:
    """Historical + forecasted cash flow data."""
    historical = [
        CashFlowDataPoint(month="Jul", inflow_cents=165_000_00, outflow_cents=230_000_00, net_cents=-65_000_00),
        CashFlowDataPoint(month="Aug", inflow_cents=178_000_00, outflow_cents=245_000_00, net_cents=-67_000_00),
        CashFlowDataPoint(month="Sep", inflow_cents=182_000_00, outflow_cents=258_000_00, net_cents=-76_000_00),
        CashFlowDataPoint(month="Oct", inflow_cents=195_000_00, outflow_cents=262_000_00, net_cents=-67_000_00),
        CashFlowDataPoint(month="Nov", inflow_cents=201_000_00, outflow_cents=271_000_00, net_cents=-70_000_00),
        CashFlowDataPoint(month="Dec", inflow_cents=189_000_00, outflow_cents=287_000_00, net_cents=-98_000_00),
        CashFlowDataPoint(month="Jan", inflow_cents=210_000_00, outflow_cents=280_000_00, net_cents=-70_000_00),
        CashFlowDataPoint(month="Feb", inflow_cents=220_000_00, outflow_cents=287_000_00, net_cents=-67_000_00),
    ]
    forecast = [
        CashFlowDataPoint(month="Mar*", inflow_cents=235_000_00, outflow_cents=285_000_00, net_cents=-50_000_00, is_forecast=True),
        CashFlowDataPoint(month="Apr*", inflow_cents=248_000_00, outflow_cents=282_000_00, net_cents=-34_000_00, is_forecast=True),
        CashFlowDataPoint(month="May*", inflow_cents=260_000_00, outflow_cents=278_000_00, net_cents=-18_000_00, is_forecast=True),
        CashFlowDataPoint(month="Jun*", inflow_cents=275_000_00, outflow_cents=275_000_00, net_cents=0, is_forecast=True),
    ]

    return CashFlowResponse(data=historical + forecast, scenarios={})


@router.get("/runway", response_model=RunwayAnalysis)
async def get_runway_analysis() -> RunwayAnalysis:
    """Runway analysis with optimization recommendations."""
    return RunwayAnalysis(
        current_runway_months=4.9,
        cash_out_date=date(2026, 8, 14),
        optimized_runway_months=7.3,
        optimized_cash_out_date=date(2026, 11, 2),
        monthly_burn_cents=287_000_00,
        monthly_revenue_cents=189_000_00,
        cash_position_cents=142_000_00,
        actions=[
            InsightSeverity(
                level="critical",
                title="Burn rate $47K above your estimate",
                description="Missing $28K accrued liabilities, $12K uncategorized expenses, $7K auto-renewals.",
                action="See breakdown",
                estimated_impact_cents=47_000_00,
            ),
            InsightSeverity(
                level="warning",
                title="3 invoices overdue — $94K outstanding",
                description="Acme Corp ($42K, 45d), Globex ($31K, 38d), Initech ($21K, 32d).",
                action="Draft collection emails",
                estimated_impact_cents=94_000_00,
            ),
            InsightSeverity(
                level="opportunity",
                title="4 unused SaaS subscriptions",
                description="Datadog $1,200/mo, Notion $800/mo, Figma $500/mo, Loom $300/mo.",
                action="Review & cancel",
                estimated_impact_cents=2_800_00,
            ),
        ],
    )
