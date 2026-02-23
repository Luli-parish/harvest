from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Family, HarvestPayment
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Max


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_family_payment(request):
	"""Create a Family and associated HarvestPayment.

	Expects JSON payload with: family_name, child_count, amount, payment_method
	Returns HTTP 200 on success or 400 with errors.
	"""
	data = request.data
	required = ('family_name', 'child_count', 'amount', 'payment_method')
	missing = [k for k in required if k not in data]
	if missing:
		return Response({'error': f'Missing fields: {missing}'}, status=status.HTTP_400_BAD_REQUEST)

	try:
		family = Family.objects.create(
			family_name=data.get('family_name'),
			child_count=int(data.get('child_count')),
		)

		payment = HarvestPayment.objects.create(
			amount=data.get('amount'),
			payment_method=data.get('payment_method'),
			family=family,
		)

	except Exception as exc:
		return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

	return Response({'status': 'success', 'family_id': family.id, 'payment_id': payment.id}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_family_payment(request):
	"""Create a HarvestPayment for an existing Family.

	Expects JSON payload with: family_id, amount, payment_method
	Returns HTTP 200 on success or 400 with errors.
	"""
	data = request.data
	required = ('family_id', 'amount', 'payment_method')
	missing = [k for k in required if k not in data]
	if missing:
		return Response({'error': f'Missing fields: {missing}'}, status=status.HTTP_400_BAD_REQUEST)

	try:
		family_id = int(data.get('family_id'))
	except (TypeError, ValueError):
		return Response({'error': 'family_id must be an integer'}, status=status.HTTP_400_BAD_REQUEST)

	family = get_object_or_404(Family, pk=family_id)

	try:
		amount = Decimal(str(data.get('amount')))
	except Exception:
		return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

	try:
		payment = HarvestPayment.objects.create(
			amount=amount,
			payment_method=data.get('payment_method'),
			family=family,
		)
	except Exception as exc:
		return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

	return Response({'status': 'success', 'payment_id': payment.id}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_families_summary(request):
	"""Fetch all families with aggregated payment data.
	
	Returns: list of objects with family_name, child_count, total_amount_paid, last_payment_date
	"""
	families = Family.objects.annotate(
		total_amount_paid=Sum('harvestpayment__amount'),
		last_payment_date=Max('harvestpayment__payment_date'),
	).values(
		'id',
		'family_name',
		'child_count',
		'total_amount_paid',
		'last_payment_date',
	)

	families_list = list(families)
	return Response({'status': 'success', 'data': families_list}, status=status.HTTP_200_OK)
