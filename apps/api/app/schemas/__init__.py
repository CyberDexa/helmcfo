"""Pydantic schemas for API request/response models."""

import uuid
from datetime import date, datetime

from pydantic import BaseModel


# --- Organization ---


class OrganizationCreate(BaseModel):
    name: str
    slug: str
    industry: str | None = None
    employee_count: int | None = None


class OrganizationResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    industry: str | None
    employee_count: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Financial Overview ---


class FinancialOverview(BaseModel):
    """The main dashboard data — the '10x moment'."""

    cash_position_cents: int
    monthly_burn_cents: int
    estimated_burn_cents: int  # What the user thinks their burn is
    burn_delta_cents: int  # Actual - estimated
    runway_months: float
    runway_end_date: date
    optimized_runway_months: float
    optimized_runway_end_date: date
    mrr_cents: int
    mrr_growth_pct: float
    overdue_invoices_count: int
    overdue_invoices_total_cents: int
    avg_days_overdue: int
    unused_subscriptions_count: int
    unused_subscriptions_monthly_cents: int


class CashFlowDataPoint(BaseModel):
    month: str
    inflow_cents: int
    outflow_cents: int
    net_cents: int
    is_forecast: bool = False


class CashFlowResponse(BaseModel):
    data: list[CashFlowDataPoint]
    scenarios: dict[str, list[CashFlowDataPoint]]  # base, bull, bear


class InsightSeverity(BaseModel):
    level: str  # critical, warning, opportunity, info
    title: str
    description: str
    action: str
    action_url: str | None = None
    estimated_impact_cents: int | None = None


class TransactionResponse(BaseModel):
    id: uuid.UUID
    transaction_type: str
    amount_cents: int
    description: str
    category: str | None
    vendor_name: str | None
    transaction_date: date
    is_recurring: bool | None
    source: str

    model_config = {"from_attributes": True}


class RunwayAnalysis(BaseModel):
    current_runway_months: float
    cash_out_date: date
    optimized_runway_months: float
    optimized_cash_out_date: date
    actions: list[InsightSeverity]
    monthly_burn_cents: int
    monthly_revenue_cents: int
    cash_position_cents: int
