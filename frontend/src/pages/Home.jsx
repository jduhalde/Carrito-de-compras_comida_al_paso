import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiShoppingBag, FiArrowRight, FiStar } from 'react-icons/fi';
import inventarioAPI from '../services/inventarioAPI';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

const Home = () => {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const response = await inventarioAPI.get('/productos/');
                const productos = response.data.results || response.data;
                setProductosDestacados(productos.slice(0, 4));
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    return (
        <>
            <Helmet>
                <title>Comida al Paso | Tu comida favorita a un clic</title>
                <meta name="description" content="Pide tu comida favorita online. Hamburguesas, pizzas, empanadas y más. Entrega rápida y productos frescos." />
            </Helmet>

            <div className="min-h-screen">
                {/* Hero Section */}
                <section
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20"
                    aria-labelledby="hero-title"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 id="hero-title" className="text-4xl md:text-6xl font-bold mb-6">
                            🍔 Comida al Paso
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                            Tu comida favorita, a un clic de distancia
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
                        >
                            <FiShoppingBag aria-hidden="true" />
                            Ver Menú
                            <FiArrowRight aria-hidden="true" />
                        </Link>
                    </div>
                </section>

                {/* Características */}
                <section className="py-16 bg-gray-50" aria-labelledby="features-title">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 id="features-title" className="sr-only">Nuestras características</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="text-5xl mb-4">🚀</div>
                                <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
                                <p className="text-gray-600">Recibe tu pedido en minutos</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="text-5xl mb-4">🥗</div>
                                <h3 className="text-xl font-semibold mb-2">Productos Frescos</h3>
                                <p className="text-gray-600">Ingredientes de la mejor calidad</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="text-5xl mb-4">💰</div>
                                <h3 className="text-xl font-semibold mb-2">Mejores Precios</h3>
                                <p className="text-gray-600">Ofertas y promociones diarias</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Productos Destacados */}
                <section className="py-16" aria-labelledby="featured-title">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 id="featured-title" className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                <FiStar className="text-yellow-500" aria-hidden="true" />
                                Productos Destacados
                            </h2>
                            <p className="text-gray-600 mt-2">Los favoritos de nuestros clientes</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12" role="status" aria-live="polite">
                                <Spinner size="lg" />
                            </div>
                        ) : productosDestacados.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {productosDestacados.map(producto => (
                                    <ProductCard key={producto.id} producto={producto} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-12">
                                No hay productos disponibles en este momento.
                            </p>
                        )}

                        <div className="text-center mt-12">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                Ver Todos los Productos
                                <FiArrowRight aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;