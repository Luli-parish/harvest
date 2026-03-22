from decimal import Decimal
from django.db.models import OuterRef, Sum, Max
from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Family, HarvestPayment, HarvestPaymentEventProxy
from .permissions import IsTreasurer


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsTreasurer])
def add_family_payment(request):
	"""Create a Family and associated HarvestPayment.

	Expects JSON payload with: family_name, child_count, amount, payment_method, payer_name
	Returns HTTP 200 on success or 400 with errors.
	"""
	data = request.data
	required = ('family_name', 'amount', 'payment_method', 'payer_name')
	missing = [k for k in required if k not in data]
	if missing:
		return Response({'error': f'Missing fields: {missing}'}, status=status.HTTP_400_BAD_REQUEST)

	try:
		family = Family.objects.create(
			family_name=data.get('family_name'),
			child_count=data.get('child_count'),
			mobile_no=data.get('mobile_no'),
			category=data.get('category'),
		)

		payment = HarvestPayment.objects.create(
			amount=data.get('amount'),
			payment_method=data.get('payment_method'),
			family=family,
			payer_name=data.get('payer_name'),
		)

	except Exception as exc:
		return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

	return Response({'status': 'success', 'family_id': family.id, 'payment_id': payment.id}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsTreasurer])
def update_family_payment(request):
	"""Create a HarvestPayment for an existing Family.

	Expects JSON payload with: family_id, amount, payment_method, payer_name
	Returns HTTP 200 on success or 400 with errors.
	"""
	data = request.data
	required = ('family_id', 'amount', 'payment_method', 'payer_name')
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
			payer_name=data.get('payer_name'),
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
		'category',
		'total_amount_paid',
		'last_payment_date',
	)

	families_list = [
		{**family, 'category': Family.CATEGORY_CHOICES_DICT.get(family['category'])}
		for family in families
	]
	return Response({'status': 'success', 'data': families_list}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_family_payments(request):
	"""Get all HarvestPayment records for a given family id.
	Query param: family_id
	Returns: list of payments for the family
	"""
	family_id = request.query_params.get('family_id')
	if not family_id:
		return Response({'error': 'family_id query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
	try:
		family = Family.objects.get(pk=int(family_id))
	except (Family.DoesNotExist, ValueError):
		return Response({'error': 'Family not found.'}, status=status.HTTP_404_NOT_FOUND)

	payments = (
		HarvestPayment.objects.filter(family=family).annotate(
			created_by=(
				HarvestPaymentEventProxy.objects
				.filter(id=OuterRef('pk'), pgh_label='insert')
				.values('user__email')[:1]
			)
		).order_by('-payment_date')
	)

	payments_data = [
		{
			'id': p.id,
			'amount': str(p.amount),
			'payment_date': p.payment_date,
			'payment_method': p.get_payment_method_display(),
			'status': p.status,
			'description': p.description,
			'payer_name': p.payer_name,
			'created_by': p.created_by if hasattr(p, 'created_by') else None,
		}
		for p in payments
	]
	return Response({'status': 'success', 'family_id': family.id, 'payments': payments_data}, status=status.HTTP_200_OK)
