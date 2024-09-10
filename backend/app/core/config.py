from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )

    PROJECT_NAME: str

    SQLALCHEMY_DATABASE_URI: str

    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    FRONTEND_URL: str


settings = Settings()  # type: ignore
