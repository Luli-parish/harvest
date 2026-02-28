import pghistory.admin
from django.contrib import admin

from .models import HarvestPayment

# Register your models here.
@admin.register(HarvestPayment)
class HarvestPaymentAdmin(admin.ModelAdmin):
	list_display = ('id', 'family', '__str__')
