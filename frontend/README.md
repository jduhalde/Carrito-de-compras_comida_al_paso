#  Comida al Paso

Aplicación web de carrito de compras para comida rápida, desarrollada con Django y React.

##  Tecnologías

### Backend
- Python 3.x
- Django 4.2
- Django REST Framework
- JWT Authentication (SimpleJWT)
- SQLite

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Toastify
- React Icons
- React Helmet Async

##  Requisitos Previos

- Python 3.8 o superior
- Node.js 16 o superior
- npm o yarn

##  Instalación

### Backend

1. Navegar a la carpeta del backend:
```bash
cd backend
```

2. Crear entorno virtual:
```bash
python -m venv venv
```

3. Activar entorno virtual:
```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Instalar dependencias:
```bash
pip install -r requirements.txt
```

5. Ejecutar migraciones:
```bash
python manage.py migrate
```

6. Crear superusuario (opcional):
```bash
python manage.py createsuperuser
```

7. Iniciar servidor:
```bash
python manage.py runserver
```

El backend estará disponible en `http://127.0.0.1:8000`

### Frontend

1. Navegar a la carpeta del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

##  Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| test | test1234 | Administrador |

## 📁 Estructura del Proyecto
```
Carrito_comida/
├── backend/
│   ├── api/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── permissions.py
│   ├── comida_al_paso/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    ├── package.json
    └── README.md
```

##  Endpoints API

### Autenticación
- `POST /api/register/` - Registrar usuario
- `POST /api/token/` - Obtener token JWT
- `GET /api/user/` - Info del usuario autenticado

### Productos
- `GET /api/productos/` - Listar productos
- `POST /api/productos/crear/` - Crear producto (admin)
- `PUT /api/productos/<id>/` - Actualizar producto (admin)
- `DELETE /api/productos/<id>/eliminar/` - Eliminar producto (admin)

### Categorías
- `GET /api/categorias/` - Listar categorías
- `POST /api/categorias/crear/` - Crear categoría (admin)

### Compras
- `POST /api/comprar/` - Procesar compra

##  Funcionalidades

-  Autenticación JWT
-  Sistema de roles (admin/usuario)
-  CRUD completo de productos
-  Carrito de compras con localStorage
-  Búsqueda en tiempo real
-  Filtro por categorías
-  Paginación de productos
-  Notificaciones toast
-  Diseño responsivo
-  Accesibilidad (ARIA)

## 📱 Responsividad

La aplicación es totalmente responsiva y funciona en:
-  Móviles (320px+)
-  Tablets (768px+)
-  Escritorio (1024px+)

##  Desarrollo

### Comandos útiles
```bash
# Backend - Crear migraciones
python manage.py makemigrations

# Backend - Aplicar migraciones
python manage.py migrate

# Backend - Shell de Django
python manage.py shell

# Frontend - Build para producción
npm run build

# Frontend - Preview del build
npm run preview
```

## Autor: 

Julio C. Duhalde - 2025

## Licencia

Este proyecto es para fines educativos.