from rest_framework import serializers
from .models import Category, Product, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True, read_only=True) #Nested Serializer

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'items']
        read_only_fields = ['user']

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        # Create order
        order = Order.objects.create(**validated_data)

        # Create order items
        for item in items_data:
            OrderItem.objects.create(order=order, **item)

        return order