"""Integration management — connect/disconnect data sources."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_integrations() -> dict:
    """List all available and connected integrations."""
    return {
        "integrations": [
            {
                "provider": "plaid",
                "display_name": "Bank Accounts",
                "description": "Connect checking, savings, and credit card accounts",
                "status": "not_connected",
                "icon": "bank",
            },
            {
                "provider": "quickbooks",
                "display_name": "QuickBooks Online",
                "description": "Sync chart of accounts, invoices, and reports",
                "status": "not_connected",
                "icon": "book",
            },
            {
                "provider": "stripe",
                "display_name": "Stripe",
                "description": "Revenue, subscriptions, and billing data",
                "status": "not_connected",
                "icon": "credit-card",
            },
            {
                "provider": "finch",
                "display_name": "Payroll & HRIS",
                "description": "Headcount, compensation, and benefits data via Finch",
                "status": "not_connected",
                "icon": "users",
            },
        ]
    }


@router.post("/{provider}/connect")
async def connect_integration(provider: str) -> dict:
    """Initiate OAuth flow for an integration provider."""
    # TODO: Implement OAuth flows per provider
    return {"provider": provider, "status": "oauth_redirect", "redirect_url": f"/auth/{provider}"}
