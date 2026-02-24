from .base import *

DEBUG = False
ALLOWED_HOSTS = [os.environ.get("ALLOWED_HOST", "")]

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

# Production-specific settings can go here
