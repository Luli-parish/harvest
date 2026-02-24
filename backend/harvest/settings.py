
# This file is a pointer to the actual settings.
# Use one of the following in your DJANGO_SETTINGS_MODULE:
#   harvest.settings.dev  (for development)
#   harvest.settings.prod (for production)
#
# Example usage:
#   python manage.py runserver --settings=harvest.settings.dev
#   python manage.py runserver --settings=harvest.settings.prod
#
# By default, this imports the development settings.
from .settings.dev import *
