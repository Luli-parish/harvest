from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models
import pghistory

# Create your models here.

class AuthUser(AbstractUser):
    # Add any extra fields here
    mobile_no = models.CharField(max_length=20, blank=True, null=True)


@pghistory.track()
class HarvestPayment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('check', 'Check'),
        ('credit_card', 'Credit Card'),
    ]
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    family = models.ForeignKey('Family', on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payer_name = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment of {self.amount} on {self.payment_date.strftime('%Y-%m-%d')} by {self.payer_name}"


class HarvestPaymentEventProxy(HarvestPayment.pgh_event_model):
    user = pghistory.ProxyField(
        "pgh_context__metadata__user",
        models.ForeignKey(
            settings.AUTH_USER_MODEL,
            on_delete=models.DO_NOTHING,
            help_text="The user associated with the event.",
        ),
    )

    class Meta:
        proxy = True


class Family(models.Model):
    family_name = models.CharField(max_length=255)
    child_count = models.PositiveIntegerField(default=0)
    mobile_no = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    class Meta:
        verbose_name_plural = "Families"
    
    def __str__(self):
        return self.family_name
