from rest_framework import serializers
from management.models import CustomUser as User
from management.models import Product, Order, ProductInOrder, Category
from django.contrib.auth.models import Group
from django.contrib.auth import update_session_auth_hash


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email','password',
                  'confirm_password',)
        lookup_field= 'id' # whithout this it shows an error


        def create(self, validated_data):
            return User.objects.create(**validated_data)

        def update(self, instance, validated_data):

            #instance.username = validated_data.get('username', instance.username)
            #instance.tagline = validated_data.get('tagline', instance.tagline)

            password = validated_data.get('password', None)
            confirm_password = validated_data.get('confirm_password', None)

            if password and confirm_password and password == confirm_password:
                instance.set_password(password)
                instance.save()

            update_session_auth_hash(self.context.get('request'), instance)

            return instance


class GroupSerializer(serializers.ModelSerializer):
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


class ProductInOrderSerializer(serializers.ModelSerializer):

    """ Model Serializer to parse ProductInOrder's data """

    class Meta:
        model = ProductInOrder


class OrderSerializer(serializers.ModelSerializer):

    """
    Serializer to parse Order's data
    """
    user = CustomUserSerializer(read_only=True, required=False)
    class Meta:
        model = Order

        fields = ('id', 'user', 'name', 'phone_number', 'email', 'order_time', 'retire_time', 'order_source',
                  'status', 'discount', 'total')
        read_only_fields = ('id', 'order_time')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(OrderSerializer, self).get_validation_exclusions()

        return exclusions + ['user']