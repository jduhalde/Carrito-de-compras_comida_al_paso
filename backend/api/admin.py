from django.contrib import admin
from .models import Producto, Categoria


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'descripcion']
    search_fields = ['nombre']
    ordering = ['nombre']


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'categoria',
                    'precio', 'stock', 'activo', 'fecha_creacion']
    list_filter = ['categoria', 'activo']
    list_editable = ['activo', 'precio', 'stock']
    search_fields = ['nombre', 'descripcion']
    ordering = ['-fecha_creacion']
    list_per_page = 20
