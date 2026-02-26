from .base import *

# Production-specific settings can go here
DEBUG = False
ALLOWED_HOSTS = [
    host.strip() for host in os.environ.get("ALLOWED_HOSTS", "").split(",")
]
CSRF_TRUSTED_ORIGINS = [
    origin.strip() for origin in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",") if origin.strip()
]
