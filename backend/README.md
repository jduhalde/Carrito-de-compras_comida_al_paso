# Comida al Paso - Backend API

API REST desarrollada con Django y Django REST Framework para gestionar productos de un negocio gastronómico con autenticación JWT.

## Tecnologías
- Python 3.11+
- Django 4.2
- Django REST Framework
- djangorestframework-simplejwt
- SQLite

## Instalación

1. Crear entorno virtual:
```bash
python -m venv venv
```

2. Activar entorno virtual:
- Windows PowerShell: `.\venv\Scripts\Activate.ps1`
- Windows CMD: `.\venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Ejecutar migraciones:
```bash
python manage.py migrate
```

5. Crear superusuario:
```bash
python manage.py createsuperuser
```

6. Iniciar servidor:
```bash
python manage.py runserver
```

La API estará disponible en: http://127.0.0.1:8000

## Endpoints

### Autenticación
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/api/register/` | Registrar nuevo usuario | Público |
| POST | `/api/token/` | Obtener token JWT (login) | Público |
| POST | `/api/token/refresh/` | Refrescar token | Público |
| GET | `/api/user/` | Info del usuario autenticado | Autenticado |

### Productos
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/productos/` | Listar productos | Público |
| POST | `/api/productos/crear/` | Crear producto | Admin |
| PUT | `/api/productos/{id}/` | Actualizar producto | Admin |
| DELETE | `/api/productos/{id}/eliminar/` | Eliminar producto | Admin |

### Categorías
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/categorias/` | Listar categorías | Público |
| POST | `/api/categorias/crear/` | Crear categoría | Admin |

### Compras
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/api/comprar/` | Procesar compra y descontar stock | Autenticado |

## Sistema de Roles

### Usuario Normal (is_staff=False)
- Puede ver productos y categorías
- Puede realizar compras
- No puede crear/editar/eliminar productos

### Administrador (is_staff=True)
- Acceso completo a todos los endpoints
- CRUD de productos y categorías
- Acceso al panel de administración

## Autenticación JWT

Para usar endpoints protegidos, incluir el token en el header:
```
Authorization: Bearer {access_token}
```

Ejemplo:
```bash
# Obtener token
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test1234"}'

# Usar token en petición
curl -H "Authorization: Bearer {tu_token}" \
  http://127.0.0.1:8000/api/user/
```

## Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| test | test1234 | Administrador (is_staff=True) |

## Admin de Django

Panel de administración: http://127.0.0.1:8000/admin/

## Estructura del Proyecto
```
backend/
├── api/
│   ├── models.py        # Modelos Producto y Categoria
│   ├── views.py         # Vistas de la API
│   ├── serializers.py   # Serializadores
│   ├── urls.py          # Rutas de la API
│   └── permissions.py   # Permisos personalizados
├── comida_al_paso/
│   ├── settings.py      # Configuración Django
│   └── urls.py          # Rutas principales
├── manage.py
└── requirements.txt
```