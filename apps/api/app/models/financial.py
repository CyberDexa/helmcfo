"""Canonical financial data models.

All monetary values stored as integer cents to ensure penny-accurate calculations.
Never use floating point for financial data.
"""

import uuid
from datetime import date, datetime
from enum import Enum

from sqlalchemy import (
    BigInteger,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Index,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


# --- Enums ---


class TransactionType(str, Enum):
    INFLOW = "inflow"
    OUTFLOW = "outflow"
    TRANSFER = "transfer"


class AccountType(str, Enum):
    CHECKING = "checking"
    SAVINGS = "savings"
    CREDIT_CARD = "credit_card"
    LOAN = "loan"
    INVESTMENT = "investment"


class IntegrationProvider(str, Enum):
    PLAID = "plaid"
    QUICKBOOKS = "quickbooks"
    STRIPE = "stripe"
    FINCH = "finch"


class IntegrationStatus(str, Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    SYNCING = "syncing"


class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    VOID = "void"


# --- Core Models ---


class Organization(Base):
    """A customer organization (tenant). All data is scoped to an org."""

    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    industry: Mapped[str | None] = mapped_column(String(100))
    employee_count: Mapped[int | None] = mapped_column()
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    integrations: Mapped[list["Integration"]] = relationship(back_populates="organization")
    accounts: Mapped[list["FinancialAccount"]] = relationship(back_populates="organization")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="organization")
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="organization")
    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="organization")
    forecasts: Mapped[list["CashFlowForecast"]] = relationship(back_populates="organization")


class Integration(Base):
    """Connected data source (Plaid, QBO, Stripe, etc.)."""

    __tablename__ = "integrations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"), index=True)
    provider: Mapped[IntegrationProvider] = mapped_column(String(50))
    status: Mapped[IntegrationStatus] = mapped_column(String(50), default=IntegrationStatus.DISCONNECTED)
    access_token_encrypted: Mapped[str | None] = mapped_column(Text)  # AES-256 encrypted
    refresh_token_encrypted: Mapped[str | None] = mapped_column(Text)
    external_id: Mapped[str | None] = mapped_column(String(255))  # Provider-specific ID
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime)
    sync_error: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    organization: Mapped["Organization"] = relationship(back_populates="integrations")

    __table_args__ = (
        UniqueConstraint("org_id", "provider", name="uq_org_provider"),
    )


class FinancialAccount(Base):
    """Bank account, credit card, or other financial account."""

    __tablename__ = "financial_accounts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"), index=True)
    integration_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("integrations.id"))
    name: Mapped[str] = mapped_column(String(255))
    account_type: Mapped[AccountType] = mapped_column(String(50))
    institution_name: Mapped[str | None] = mapped_column(String(255))
    mask: Mapped[str | None] = mapped_column(String(10))  # Last 4 digits
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    current_balance_cents: Mapped[int] = mapped_column(BigInteger, default=0)
    available_balance_cents: Mapped[int | None] = mapped_column(BigInteger)
    external_id: Mapped[str | None] = mapped_column(String(255))  # Plaid account_id
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime)

    organization: Mapped["Organization"] = relationship(back_populates="accounts")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="account")


class Transaction(Base):
    """Normalized financial transaction from any source."""

    __tablename__ = "transactions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"), index=True)
    account_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("financial_accounts.id"))
    transaction_type: Mapped[TransactionType] = mapped_column(String(20))
    amount_cents: Mapped[int] = mapped_column(BigInteger)  # Always positive; type indicates direction
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    description: Mapped[str] = mapped_column(Text)
    category: Mapped[str | None] = mapped_column(String(100))  # Normalized category
    subcategory: Mapped[str | None] = mapped_column(String(100))
    vendor_name: Mapped[str | None] = mapped_column(String(255))
    transaction_date: Mapped[date] = mapped_column(Date, index=True)
    posted_date: Mapped[date | None] = mapped_column(Date)
    is_pending: Mapped[bool] = mapped_column(Boolean, default=False)
    is_recurring: Mapped[bool | None] = mapped_column(Boolean)
    external_id: Mapped[str | None] = mapped_column(String(255))  # Source system ID
    source: Mapped[str] = mapped_column(String(50))  # plaid, quickbooks, stripe, manual
    raw_data: Mapped[str | None] = mapped_column(Text)  # JSON of original data
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    organization: Mapped["Organization"] = relationship(back_populates="transactions")
    account: Mapped["FinancialAccount | None"] = relationship(back_populates="transactions")

    __table_args__ = (
        Index("ix_txn_org_date", "org_id", "transaction_date"),
        Index("ix_txn_org_category", "org_id", "category"),
        UniqueConstraint("org_id", "external_id", "source", name="uq_txn_external"),
    )


class Invoice(Base):
    """Accounts receivable — outstanding invoices."""

    __tablename__ = "invoices"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"), index=True)
    customer_name: Mapped[str] = mapped_column(String(255))
    invoice_number: Mapped[str | None] = mapped_column(String(100))
    amount_cents: Mapped[int] = mapped_column(BigInteger)
    amount_paid_cents: Mapped[int] = mapped_column(BigInteger, default=0)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    status: Mapped[InvoiceStatus] = mapped_column(String(20))
    issue_date: Mapped[date] = mapped_column(Date)
    due_date: Mapped[date] = mapped_column(Date, index=True)
    paid_date: Mapped[date | None] = mapped_column(Date)
    days_overdue: Mapped[int] = mapped_column(default=0)
    external_id: Mapped[str | None] = mapped_column(String(255))
    source: Mapped[str] = mapped_column(String(50))

    organization: Mapped["Organization"] = relationship(back_populates="invoices")


class Subscription(Base):
    """Detected recurring expenses (SaaS subscriptions, etc.)."""

    __tablename__ = "subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"), index=True)
    vendor_name: Mapped[str] = mapped_column(String(255))
    amount_cents: Mapped[int] = mapped_column(BigInteger)
    frequency: Mapped[str] = mapped_column(String(20))  # monthly, annual, quarterly
    category: Mapped[str | None] = mapped_column(String(100))
    last_charge_date: Mapped[date | None] = mapped_column(Date)
    next_charge_date: Mapped[date | None] = mapped_column(Date)
    active_users: Mapped[int | None] = mapped_column()  # For usage-based flagging
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_flagged_unused: Mapped[bool] = mapped_column(Boolean, default=False)
    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    organization: Mapped["Organization"] = relationship(back_populates="subscriptions")


class CashFlowForecast(Base):
    """Stored cash flow forecast snapshots."""

    __tablename__ = "cash_flow_forecasts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"), index=True)
    scenario: Mapped[str] = mapped_column(String(20))  # base, bull, bear
    forecast_date: Mapped[date] = mapped_column(Date)  # The date being forecasted
    projected_inflow_cents: Mapped[int] = mapped_column(BigInteger)
    projected_outflow_cents: Mapped[int] = mapped_column(BigInteger)
    projected_balance_cents: Mapped[int] = mapped_column(BigInteger)
    confidence_score: Mapped[float | None] = mapped_column()  # 0.0-1.0
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    model_version: Mapped[str] = mapped_column(String(20))

    organization: Mapped["Organization"] = relationship(back_populates="forecasts")

    __table_args__ = (
        Index("ix_forecast_org_scenario_date", "org_id", "scenario", "forecast_date"),
    )
