from django.shortcuts import render
from django.apps import apps
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import RepairRequest
from .serializer import RequestSerializer

class RepairRequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'client':
            queryset = RepairRequest.objects.filter(client=user)
        elif user.role == 'repairer':
            queryset = RepairRequest.objects.filter(shop__owner=user)
        else:
            return RepairRequest.objects.none()

        # Allow filtering by status, e.g. ?status=pending,accepted,in_repair,ready
        status_param = self.request.query_params.get('status')
        if status_param:
            statuses = [s.strip() for s in status_param.split(',') if s.strip()]
            queryset = queryset.filter(status__in=statuses)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        repair_request = serializer.save()
       
