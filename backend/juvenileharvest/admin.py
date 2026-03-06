import pghistory.admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AuthUser, HarvestPayment

# Register your models here.
@admin.register(HarvestPayment)
class HarvestPaymentAdmin(admin.ModelAdmin):
	list_display = ('id', 'family', '__str__')


@admin.register(AuthUser)
class AuthUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('mobile_no',)}),
    )
