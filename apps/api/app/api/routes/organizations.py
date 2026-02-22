from fastapi import APIRouter

from app.schemas import OrganizationCreate, OrganizationResponse

router = APIRouter()


@router.post("/", response_model=OrganizationResponse)
async def create_organization(org: OrganizationCreate) -> OrganizationResponse:
    """Create a new organization (tenant)."""
    # TODO: Implement with database
    return OrganizationResponse(
        id="00000000-0000-0000-0000-000000000000",
        name=org.name,
        slug=org.slug,
        industry=org.industry,
        employee_count=org.employee_count,
        created_at="2026-02-22T00:00:00Z",
    )
