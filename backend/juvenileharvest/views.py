from decimal import Decimal
from django.db import transaction
from django.db.models import OuterRef, Sum, Max
from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Family, HarvestPayment, HarvestPaymentEventProxy, Child
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_children(request):
    """
    Returns all children with their full name and family name.
    """
    children = Child.objects.select_related('family').all()
    data = [
        {
            'full_name': child.full_name,
            'family_name': child.family.family_name if child.family else None
        }
        for child in children
    ]
    return Response({'status': 'success', 'data': data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_family_children(request):
	"""Get all children for a given family id.
	Query param: family_id
	Returns: list of children for the family
	"""
	family_id = request.query_params.get('family_id')
	if not family_id:
		return Response({'error': 'family_id query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
	try:
		family = Family.objects.get(pk=int(family_id))
	except (Family.DoesNotExist, ValueError):
		return Response({'error': 'Family not found.'}, status=status.HTTP_404_NOT_FOUND)

	children = Child.objects.filter(family=family).order_by('full_name')

	children_data = [
		{
			'id': child.id,
			'full_name': child.full_name,
		}
		for child in children
	]
	return Response({'status': 'success', 'family_id': family.id, 'children': children_data}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsTreasurer])
def update_family_children(request):
	"""Update children for a family by syncing submitted list.

	Expects JSON payload with:
	- family_id: integer
	- children: list of dictionaries with keys id and full_name (family_name accepted as fallback)

	Behavior:
	- Delete DB children missing from submitted list
	- Update full_name for existing children
	- Create new children for rows not matching existing DB ids
	"""
	data = request.data
	required = ('family_id', 'children')
	missing = [k for k in required if k not in data]
	if missing:
		return Response({'error': f'Missing fields: {missing}'}, status=status.HTTP_400_BAD_REQUEST)

	try:
		family_id = int(data.get('family_id'))
	except (TypeError, ValueError):
		return Response({'error': 'family_id must be an integer'}, status=status.HTTP_400_BAD_REQUEST)

	children_payload = data.get('children')
	if not isinstance(children_payload, list):
		return Response({'error': 'children must be a list'}, status=status.HTTP_400_BAD_REQUEST)

	family = get_object_or_404(Family, pk=family_id)

	with transaction.atomic():
		existing_children = list(Child.objects.filter(family=family))
		existing_by_id = {child.id: child for child in existing_children}

		submitted_existing_ids = set()
		to_create = []
		to_update = []

		for item in children_payload:
			if not isinstance(item, dict):
				continue

			full_name = str(item.get('full_name') or item.get('family_name') or '').strip()
			raw_id = item.get('id')

			child_id = None
			try:
				if raw_id not in (None, ''):
					child_id = int(raw_id)
			except (TypeError, ValueError):
				child_id = None

			if child_id and child_id in existing_by_id:
				submitted_existing_ids.add(child_id)
				child = existing_by_id[child_id]
				if child.full_name != full_name:
					child.full_name = full_name
					to_update.append(child)
			else:
				if full_name:
					to_create.append(Child(full_name=full_name, family=family))

		deleted_count, _ = Child.objects.filter(family=family).exclude(id__in=submitted_existing_ids).delete()

		if to_update:
			Child.objects.bulk_update(to_update, ['full_name'])

		if to_create:
			Child.objects.bulk_create(to_create)

		final_children = Child.objects.filter(family=family).order_by('full_name')
		family.child_count = final_children.count()
		family.save(update_fields=['child_count'])

	children_data = [
		{
			'id': child.id,
			'full_name': child.full_name,
		}
		for child in final_children
	]

	return Response(
		{
			'status': 'success',
			'family_id': family.id,
			'deleted_count': deleted_count,
			'updated_count': len(to_update),
			'created_count': len(to_create),
			'children': children_data,
		},
		status=status.HTTP_200_OK,
	)
