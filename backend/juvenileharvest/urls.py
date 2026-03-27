from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import add_family_payment, update_family_payment, get_families_summary, get_family_payments, get_family_children, get_all_children, update_family_children
from .auth import signup, change_password

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', signup, name='signup'),
    path('change-password/', change_password, name='change_password'),
    path('add-family-payment/', add_family_payment, name='add_family_payment'),
    path('update-family-payment/', update_family_payment, name='update_family_payment'),
    path('family-payments/', get_family_payments, name='get_family_payments'),
    path('families/', get_families_summary, name='get_families_summary'),
    path('family-children/', get_family_children, name='get_family_children'),
    path('update-family-children/', update_family_children, name='update_family_children'),
    path('children/', get_all_children, name='get_all_children'),
]
