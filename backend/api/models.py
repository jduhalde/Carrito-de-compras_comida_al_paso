from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name_plural = "Categorías"


class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, default='')  # NUEVO CAMPO
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    imagen = models.URLField(blank=True, null=True)  # Opcional para imágenes
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

    class Meta:
        ordering = ['-fecha_creacion']
        