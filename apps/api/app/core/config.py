from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    debug: bool = True
    database_url: str = "postgresql+asyncpg://localhost:5432/chiefcfo"
    secret_key: str = "change-me-in-production"
    cors_origins: list[str] = ["http://localhost:3000"]

    # Integration API keys (loaded from env)
    plaid_client_id: str = ""
    plaid_secret: str = ""
    plaid_env: str = "sandbox"

    qbo_client_id: str = ""
    qbo_client_secret: str = ""

    stripe_api_key: str = ""

    openai_api_key: str = ""

    model_config = {"env_prefix": "CHIEFCFO_", "env_file": ".env"}


settings = Settings()
