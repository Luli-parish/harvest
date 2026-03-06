from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import add_family_payment, update_family_payment, get_families_summary, get_family_payments
from .auth import signup

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', signup, name='signup'),
    path('add-family-payment/', add_family_payment, name='add_family_payment'),
    path('update-family-payment/', update_family_payment, name='update_family_payment'),
    path('families/', get_families_summary, name='get_families_summary'),
    path('family-payments/', get_family_payments, name='get_family_payments'),
]
