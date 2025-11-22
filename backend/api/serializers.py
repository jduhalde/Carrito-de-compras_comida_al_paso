from rest_framework import serializers
from .models import Categoria, Producto


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'categoria',
                  'categoria_nombre', 'precio', 'stock']

    def get_categoria_nombre(self, obj):
        if obj.categoria:
            return obj.categoria.nombre
        return None
