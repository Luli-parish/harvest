from .base import *

# Production-specific settings can go here
DEBUG = False
ALLOWED_HOSTS = [os.environ.get("ALLOWED_HOST", "")]
CSRF_TRUSTED_ORIGINS = [os.environ.get("CSRF_TRUSTED_ORIGIN", "")]
