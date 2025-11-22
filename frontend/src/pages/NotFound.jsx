import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Comida al Paso - Página no encontrada";
    }, []);

    const irAInicio = () => navigate('/');
    const irAProductos = () => navigate('/productos');
    const volverAtras = () => navigate(-1);

    return (
        <div className="text-center py-12 max-w-2xl mx-auto">
            <div className="text-8xl mb-6">🍽️</div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
                ¡Ups! Página no encontrada
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
                La página que buscas no existe, ha sido movida o el enlace está roto.
                ¡Pero no te preocupes! Puedes volver a navegar por nuestro sitio.
            </p>
            
            <div className="bg-orange-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-4 text-orange-800">
                    ¿Qué puedes hacer?
                </h3>
                <div className="space-y-2 text-gray-700">
                    <p>• Volver a la página principal</p>
                    <p>• Explorar nuestros productos</p>
                    <p>• Regresar a la página anterior</p>
                </div>
            </div>
            
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <Button onClick={irAInicio} className="w-full sm:w-auto">
                    🏠 Ir al Inicio
                </Button>
                <Button onClick={irAProductos} variant="secondary" className="w-full sm:w-auto">
                    🍔 Ver Productos
                </Button>
                <Button onClick={volverAtras} variant="secondary" className="w-full sm:w-auto">
                    ← Volver Atrás
                </Button>
            </div>
        </div>
    );
}

export default NotFound;