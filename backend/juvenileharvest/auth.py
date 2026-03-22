from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    User signup endpoint.
    Expects: email, password, first_name, last_name
    Returns: success or error message
    """
    data = request.data
    required = ('password', 'first_name', 'last_name', 'email', 'mobile_no')
    missing = [k for k in required if k not in data]
    User = get_user_model()

    if missing:
        return Response({'error': f'Missing fields: {missing}'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=data['email']).exists():
        return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(data['password'])
    except ValidationError as e:
        return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=data['email'],  # Using email as username
        password=data['password'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        mobile_no=data['mobile_no'],
    )
    return Response({'status': 'success', 'user_id': user.id}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Custom login endpoint that uses TokenObtainPairView.
    Expects: username, password
    Returns: access and refresh tokens
    """
    from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
    serializer = TokenObtainPairSerializer(data=request.data)
    if serializer.is_valid():
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change password endpoint.
    Expects: current_password, new_password, confirm_new_password
    Returns: success or error message
    """
    user = request.user
    data = request.data
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    confirm_new_password = data.get('confirm_new_password')

    if not current_password or not new_password or not confirm_new_password:
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_new_password:
        return Response({'error': 'New passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(current_password):
        return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(new_password, user)
    except ValidationError as e:
        return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({'status': 'Password changed successfully.'}, status=status.HTTP_200_OK)
