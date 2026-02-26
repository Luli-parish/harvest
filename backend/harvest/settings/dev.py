from .base import *

DEBUG = True
ALLOWED_HOSTS = []

ALLOWED_HOSTS = ['localhost']
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']

# CORS settings
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
# Development-specific settings can go here
