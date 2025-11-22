from django.core.management.base import BaseCommand
from api.models import Categoria, Producto


class Command(BaseCommand):
    help = 'Carga los datos iniciales del menú del restaurante'

    def handle(self, *args, **options):
        self.stdout.write('Cargando datos del menú...')
        
        # Limpiar datos existentes
        Producto.objects.all().delete()
        Categoria.objects.all().delete()
        self.stdout.write(self.style.WARNING('Datos anteriores eliminados'))
        
        # Crear categorías
        categorias_data = [
            ("Hamburguesas", "Hamburguesas clásicas y gourmet"),
            ("Pizzas", "Pizzas artesanales con ingredientes frescos"),
            ("Empanadas", "Empanadas caseras rellenas"),
            ("Parrilla", "Carnes a la parrilla y choripán"),
            ("Pastas", "Pastas frescas y salsas caseras"),
            ("Ensaladas", "Ensaladas frescas y saludables"),
            ("Bebidas", "Bebidas frías y calientes"),
            ("Postres", "Postres caseros y helados"),
        ]
        
        categorias = {}
        for nombre, descripcion in categorias_data:
            categoria, created = Categoria.objects.get_or_create(
                nombre=nombre,
                defaults={'descripcion': descripcion}
            )
            categorias[nombre] = categoria
            if created:
                self.stdout.write(f'  ✓ Categoría creada: {nombre}')
        
        # Crear productos
        productos_data = [
            # Hamburguesas
            ("Hamburguesa Clásica", "Hamburguesas", 2500, 20),
            ("Hamburguesa Completa", "Hamburguesas", 3200, 15),
            ("Hamburguesa BBQ", "Hamburguesas", 3500, 12),
            
            # Pizzas
            ("Pizza Margherita", "Pizzas", 3200, 8),
            ("Pizza Napolitana", "Pizzas", 3800, 6),
            ("Pizza Fugazzeta", "Pizzas", 4200, 5),
            
            # Empanadas
            ("Empanadas de Carne", "Empanadas", 180, 50),
            ("Empanadas de Pollo", "Empanadas", 180, 40),
            ("Empanadas de Jamón y Queso", "Empanadas", 180, 30),
            ("Empanadas de Humita", "Empanadas", 200, 25),
            
            # Parrilla
            ("Choripán", "Parrilla", 1200, 25),
            ("Bife de Chorizo", "Parrilla", 4500, 8),
            ("Costillas BBQ", "Parrilla", 3800, 10),
            
            # Pastas
            ("Lomito Completo", "Pastas", 3500, 12),
            ("Ñoquis con Salsa", "Pastas", 2800, 15),
            ("Ravioles de Ricota", "Pastas", 3200, 10),
            
            # Ensaladas
            ("Ensalada César", "Ensaladas", 1800, 18),
            ("Ensalada Mixta", "Ensaladas", 1500, 20),
            
            # Bebidas
            ("Coca Cola 500ml", "Bebidas", 300, 60),
            ("Agua Mineral 500ml", "Bebidas", 200, 80),
            ("Cerveza Quilmes", "Bebidas", 400, 45),
            ("Jugo Natural", "Bebidas", 350, 30),
            
            # Postres
            ("Flan Casero", "Postres", 800, 15),
            ("Helado 1/4kg", "Postres", 1200, 20),
            ("Tiramisu", "Postres", 950, 12),
        ]
        
        productos_creados = 0
        for nombre, categoria_nombre, precio, stock in productos_data:
            producto, created = Producto.objects.get_or_create(
                nombre=nombre,
                categoria=categorias[categoria_nombre],
                defaults={
                    'precio': precio,
                    'stock': stock
                }
            )
            if created:
                productos_creados += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Menú cargado exitosamente!'
            )
        )
        self.stdout.write(
            f'  {len(categorias)} categorías'
        )
        self.stdout.write(
            f'  {productos_creados} productos nuevos'
        )
