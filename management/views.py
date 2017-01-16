from rest_framework.response import Response
from rest_framework import status, generics, permissions, viewsets
from rest_framework.views import APIView
from management.serializers import *
from management.models import *
from management.permissions import IsAccountOwner
from django.shortcuts import render
import logging
import json
from django.contrib.auth import authenticate, login, logout
from _constants.messages import *
from _constants.choices import ORDER_STATUS_CODES, ORDER_SOURCE
from datetime import datetime


class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class OrderList(APIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def post(self, request):
        """
        This function creates an order object with its associated products
        """

        data = request.data
        # This status is initialized in a error state. If everything is ok should be a valid status
        result_status = status.HTTP_500_INTERNAL_SERVER_ERROR

        if 'order_data' not in data or 'products' not in data:
            logging.info(ERROR_ORDER_DATA_STRUCTURE)
            return Response({'message': ERROR_ORDER_DATA_STRUCTURE}, status=status.HTTP_400_BAD_REQUEST)

        order_data = data.get('order_data',{})
        products = data.get('products', [])

        if not products:
            logging.info(ERROR_PRODUCT_NOT_PROVIDED)
            return Response({'message': ERROR_PRODUCT_NOT_PROVIDED}, status=status.HTTP_400_BAD_REQUEST)

        if 'retire_time' not in order_data:
            logging.info(ERROR_RETIRE_TIME_NOT_PROVIDED)
            return Response({'message': ERROR_RETIRE_TIME_NOT_PROVIDED}, status=status.HTTP_400_BAD_REQUEST)

        if 'discount' not in order_data:
            logging.info(ERROR_DISCOUNT_NOT_PROVIDED)
            return Response({'message': ERROR_DISCOUNT_NOT_PROVIDED}, status=status.HTTP_400_BAD_REQUEST)

        if 'total' not in order_data:
            logging.info(ERROR_TOTAL_NOT_PROVIDED)
            return Response({'message': ERROR_TOTAL_NOT_PROVIDED}, status=status.HTTP_400_BAD_REQUEST)

        order_data["user"] = request.user.id
        order_data["retire_time"] = datetime.strptime(order_data["retire_time"], '%d-%m-%Y:%H')
        if not request.user.is_admin:
            order_data["name"] = request.user.get_full_name()
            order_data["phone_number"] = request.user.phone_number
            order_data["email"] = request.user.email
            order_data["order_source"] = ORDER_SOURCE[0][0]
        else:
            order_data["order_source"] = ORDER_SOURCE[1][0]


        new_order = OrderSerializer(data=order_data)
        if not new_order.is_valid():
            return Response(new_order.errors, status.HTTP_400_BAD_REQUEST)
        new_order.save()

        return Response(new_order, status=status.HTTP_201_CREATED)



class OrderDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CustomUserViewSet(viewsets.ModelViewSet):
    lookup_field = 'id'
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            CustomUser.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request, format=None):
        data = json.loads(request.body.decode('utf-8'))

        email = data.get('email', None)
        password = data.get('password', None)

        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = CustomUserSerializer(account)

                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)

    # For render the login teplate html, because we are not using Template as view like we use in register case
    def get(self, request):
        return render(request, 'management/login.html')


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)


def testing(request):
    return render(request, 'management/testing.html')


