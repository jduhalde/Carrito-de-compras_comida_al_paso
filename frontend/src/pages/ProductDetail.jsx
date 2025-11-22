import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { productosData } from '../data/productos';
import Card from '../components/Card';
import Button from '../components/Button';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const producto = productosData.find(p => p.id === parseInt(id));

    useEffect(() => {
        if (producto) {
            document.title = `${producto.nombre} - Comida al Paso`;
            console.log(`Viendo producto: ${producto.nombre} (ID: ${id})`);
        } else {
            document.title = "Producto no encontrado - Comida al Paso";
        }
    }, [id, producto]);

    if (!producto) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <Card className="p-8">
                    <div className="text-6xl mb-4">😞</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Producto no encontrado
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Lo sentimos, el producto que buscas no existe o ya no está disponible.
                    </p>
                    <Button onClick={() => navigate('/')}>
                        🏠 Volver al inicio
                    </Button>
                </Card>
            </div>
        );
    }

    const volverAtras = () => {
        navigate(-1);
    };

    const irAProductos = () => {
        navigate('/productos');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Button variant="secondary" onClick={volverAtras}>
                    ← Volver
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center p-12">
                        <div className="text-9xl">{producto.imagen}</div>
                    </div>

                    <div className="md:w-1/2 p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            {producto.nombre}
                        </h1>
                        <p className="text-gray-600 text-lg mb-6">
                            {producto.descripcion}
                        </p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-orange-500">
                                ${producto.precio}
                            </span>
                        </div>
                        <div className="mb-6">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                                producto.disponible 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {producto.disponible ? '✅ Disponible' : '❌ Agotado'}
                            </span>
                        </div>
                        <div className="space-y-3">
                            <Button
                                className="w-full py-3 text-lg"
                                disabled={!producto.disponible}
                            >
                                {producto.disponible ? '🛒 Agregar al carrito' : 'Producto agotado'}
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={irAProductos}
                            >
                                🍽️ Ver todos los productos
                            </Button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Información adicional:
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>⏱️ Tiempo de preparación: 10-15 minutos</li>
                                <li>🚚 Delivery disponible</li>
                                <li>💳 Aceptamos todas las tarjetas</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ProductDetail;