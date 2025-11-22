import { useCarrito } from '../context/CarritoContext';
import { useState } from 'react';

const ProductCard = ({ producto }) => {
    const { agregarAlCarrito } = useCarrito();
    const [cantidad, setCantidad] = useState(1);
    const [mensaje, setMensaje] = useState('');

    const handleAgregar = () => {
        const exito = agregarAlCarrito(producto, cantidad);
        if (exito) {
            setMensaje('¡Agregado al carrito!');
            setCantidad(1);
            setTimeout(() => setMensaje(''), 3000);
        }
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(precio);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-8xl">
                    {{
                        'Hamburguesas': '🍔',
                        'Pizzas': '🍕',
                        'Empanadas': '🥟',
                        'Parrilla': '🥩',
                        'Pastas': '🍝',
                        'Ensaladas': '🥗',
                        'Bebidas': '🥤',
                        'Postres': '🍰',
                    }[producto.categoria_nombre] || '🍽️'}
                </span>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{producto.nombre}</h3>
                <p className="text-gray-600 text-sm mb-2">
                    {producto.categoria_nombre || 'Sin categoría'}
                </p>
                <p className="text-blue-600 font-bold text-xl mb-3">
                    {formatearPrecio(producto.precio)}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                    Stock: {producto.stock} unidades
                </p>

                {producto.stock > 0 ? (
                    <>
                        <div className="flex items-center gap-2 mb-3">
                            <button
                                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={cantidad}
                                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-16 text-center border rounded px-2 py-1"
                                min="1"
                                max={producto.stock}
                            />
                            <button
                                onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAgregar}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Agregar al Carrito
                        </button>

                        {mensaje && (
                            <p className="text-green-600 text-sm mt-2 text-center font-semibold">
                                {mensaje}
                            </p>
                        )}
                    </>
                ) : (
                    <button
                        disabled
                        className="w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
                    >
                        Sin Stock
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;