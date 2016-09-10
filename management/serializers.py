from rest_framework import serializers
from management.models import CustomUser as User
from management.models import Product, Order, ProductInOrder, Category
from django.contrib.auth.models import Group

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'first_name', 'last_name', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class ProductSerializer(serializers.ModelSerializer):

    """
    Serializer to parse Product's data
    """
    class Meta:
        model = Product


class CategorySerializer(serializers.ModelSerializer):

    """ Model Serializer to parse Category's data """

    class Meta:
        model = Category


class OrderSerializer(serializers.ModelSerializer):

    """
    Serializer to parse Order's data
    """
    class Meta:
        model = Order


class ProductInOrderSerializer(serializers.ModelSerializer):

    """ Model Serializer to parse ProductInOrder's data """

    class Meta:
        model = ProductInOrder