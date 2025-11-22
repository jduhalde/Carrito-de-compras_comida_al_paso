import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import inventarioAPI from '../services/inventarioAPI';
import Spinner from '../components/Spinner';
import showToast from '../utils/toast';

const Carrito = () => {
    const { items: carrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito, calcularTotal } = useCarrito();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [procesando, setProcesando] = useState(false);

    const handleFinalizarCompra = async () => {
        if (!user) {
            showToast.warning('Debes iniciar sesión para finalizar la compra.');
            navigate('/login');
            return;
        }

        if (carrito.length === 0) {
            showToast.warning('Tu carrito está vacío.');
            return;
        }

        setProcesando(true);

        try {
            const items = carrito.map(item => ({
                id: item.id,
                cantidad: item.cantidad
            }));

            await inventarioAPI.post('/comprar/', { items });

            vaciarCarrito();
            showToast.success('¡Compra realizada con éxito! Gracias por tu pedido.');
            navigate('/products');
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Error al procesar la compra.';
            showToast.error(errorMsg);
        } finally {
            setProcesando(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>{`Carrito (${carrito.length}) | Comida al Paso`}</title>
                <meta name="description" content="Revisa tu carrito de compras y finaliza tu pedido." />
            </Helmet>

            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FiShoppingCart className="text-orange-500" aria-hidden="true" />
                            Tu Carrito
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {carrito.length === 0
                                ? 'Tu carrito está vacío'
                                : `${carrito.length} producto${carrito.length !== 1 ? 's' : ''} en tu carrito`
                            }
                        </p>
                    </header>

                    {carrito.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <FiShoppingCart size={64} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
                            <p className="text-gray-500 mb-6">¡Agrega productos deliciosos!</p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                            >
                                <FiArrowLeft aria-hidden="true" />
                                Ver Menú
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <ul className="divide-y divide-gray-200" role="list">
                                    {carrito.map(item => (
                                        <li key={item.id} className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{item.nombre}</h3>
                                                    <p className="text-orange-600 font-medium">${parseFloat(item.precio).toFixed(2)} c/u</p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                                            disabled={item.cantidad <= 1}
                                                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            aria-label={`Reducir cantidad de ${item.nombre}`}
                                                        >
                                                            <FiMinus size={16} />
                                                        </button>
                                                        <span className="w-10 text-center font-semibold">
                                                            {item.cantidad}
                                                        </span>
                                                        <button
                                                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                                            aria-label={`Aumentar cantidad de ${item.nombre}`}
                                                        >
                                                            <FiPlus size={16} />
                                                        </button>
                                                    </div>

                                                    <div className="w-24 text-right">
                                                        <span className="font-semibold text-gray-900">
                                                            ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            eliminarDelCarrito(item.id);
                                                            showToast.info(`${item.nombre} eliminado del carrito.`);
                                                        }}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        aria-label={`Eliminar ${item.nombre}`}
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xl font-semibold text-gray-900">Total:</span>
                                    <span className="text-3xl font-bold text-orange-600">
                                        ${calcularTotal().toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to="/products"
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <FiArrowLeft />
                                        Seguir Comprando
                                    </Link>
                                    <button
                                        onClick={handleFinalizarCompra}
                                        disabled={procesando}
                                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                                    >
                                        {procesando ? (
                                            <>
                                                <Spinner size="sm" color="white" />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <FiCheck />
                                                Finalizar Compra
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={() => {
                                        vaciarCarrito();
                                        showToast.info('Carrito vaciado.');
                                    }}
                                    className="text-red-600 hover:text-red-800 underline text-sm"
                                >
                                    Vaciar carrito
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Carrito;