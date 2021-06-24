import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator


class Settings(BaseSettings):
    # SECRET_KEY: str = secrets.token_urlsafe(32)
    SECRET_KEY_PARENT: str = "1ff38cc8a80daca1b1be35efa773f612a333b07d165ef6c1ff8b638bd80cb4a0"
    SECRET_KEY_CHILD: str = "7f44c488a77d4f84aa0402bfbc346c8366240397452e486b2e0f4e0f397fbce4"
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 365
    # SERVER_NAME: str
    # SERVER_HOST: AnyHttpUrl
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    "http://localhost:8080", "http://localhost:5000"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    PROJECT_NAME: str = "KidsPay"

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "app"
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )
    PYPL_SECRET: str = "QVhjTHZLTFVWRW9WbEhCdU4xbE9IOWtpNUQzZUxVMG1WOVpWRm1XV2YwTXJlZkNHc1ZyLVNtd3dKdGNqLUp1dTN3RGdpWmJ2bWFMclBRM186RURQRG01bUZkaFE0dWI5Z3lzRjhqaTJNMFdERWZfalNqWGNIdExKYmpTdDRPdlNGczYzRkZGUHFrTWN1QWdiM3kyVVZyRGF2bGJZUWpOd0g="



settings = Settings()
