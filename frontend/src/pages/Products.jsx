import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiGrid, FiFilter, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import inventarioAPI from '../services/inventarioAPI';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import showToast from '../utils/toast';

const PRODUCTOS_POR_PAGINA = 8;

const Products = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [productosRes, categoriasRes] = await Promise.all([
                    inventarioAPI.get('/productos/'),
                    inventarioAPI.get('/categorias/')
                ]);
                setProductos(productosRes.data.results || productosRes.data);
                setCategorias(categoriasRes.data.results || categoriasRes.data);
            } catch (error) {
                showToast.error('Error al cargar los productos.');
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    // Filtrar productos por categoría y búsqueda
    const productosFiltrados = useMemo(() => {
        let resultado = productos;

        // Filtrar por categoría
        if (categoriaFiltro) {
            resultado = resultado.filter(p => p.categoria.toString() === categoriaFiltro);
        }

        // Filtrar por búsqueda (nombre o categoría)
        if (busqueda.trim()) {
            const terminoBusqueda = busqueda.toLowerCase().trim();
            resultado = resultado.filter(p =>
                p.nombre.toLowerCase().includes(terminoBusqueda) ||
                (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(terminoBusqueda)) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(terminoBusqueda))
            );
        }

        return resultado;
    }, [productos, categoriaFiltro, busqueda]);

    // Calcular paginación
    const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);

    const productosPaginados = useMemo(() => {
        const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
        const fin = inicio + PRODUCTOS_POR_PAGINA;
        return productosFiltrados.slice(inicio, fin);
    }, [productosFiltrados, paginaActual]);

    // Resetear página al cambiar filtros
    useEffect(() => {
        setPaginaActual(1);
    }, [categoriaFiltro, busqueda]);

    const handleBusqueda = (e) => {
        setBusqueda(e.target.value);
    };

    const limpiarFiltros = () => {
        setCategoriaFiltro('');
        setBusqueda('');
        setPaginaActual(1);
    };

    const irAPagina = (pagina) => {
        setPaginaActual(pagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Generar números de página
    const generarNumerosPagina = () => {
        const paginas = [];
        const maxVisible = 5;

        let inicio = Math.max(1, paginaActual - Math.floor(maxVisible / 2));
        let fin = Math.min(totalPaginas, inicio + maxVisible - 1);

        if (fin - inicio + 1 < maxVisible) {
            inicio = Math.max(1, fin - maxVisible + 1);
        }

        for (let i = inicio; i <= fin; i++) {
            paginas.push(i);
        }

        return paginas;
    };

    return (
        <>
            <Helmet>
                <title>Menú | Comida al Paso</title>
                <meta name="description" content="Explora nuestro menú completo de comidas. Hamburguesas, pizzas, empanadas, bebidas y más." />
            </Helmet>

            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FiGrid className="text-orange-500" aria-hidden="true" />
                            Nuestro Menú
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Encuentra tu comida favorita
                        </p>
                    </header>

                    {/* Barra de búsqueda y filtros */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Búsqueda */}
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                                <input
                                    type="text"
                                    value={busqueda}
                                    onChange={handleBusqueda}
                                    placeholder="Buscar por nombre, categoría o descripción..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    aria-label="Buscar productos"
                                />
                            </div>

                            {/* Filtro por categoría */}
                            <div className="flex items-center gap-2">
                                <FiFilter className="text-gray-500" aria-hidden="true" />
                                <select
                                    value={categoriaFiltro}
                                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    aria-label="Filtrar por categoría"
                                >
                                    <option value="">Todas las categorías</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Limpiar filtros */}
                            {(categoriaFiltro || busqueda) && (
                                <button
                                    onClick={limpiarFiltros}
                                    className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>

                        {/* Resultados */}
                        <div className="mt-4 text-sm text-gray-600">
                            {loading ? (
                                'Cargando...'
                            ) : (
                                <>
                                    Mostrando {productosPaginados.length} de {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
                                    {(categoriaFiltro || busqueda) && ' (filtrados)'}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Productos */}
                    {loading ? (
                        <div className="flex justify-center py-12" role="status" aria-live="polite">
                            <Spinner size="lg" />
                        </div>
                    ) : productosPaginados.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {productosPaginados.map(producto => (
                                    <ProductCard key={producto.id} producto={producto} />
                                ))}
                            </div>

                            {/* Paginación */}
                            {totalPaginas > 1 && (
                                <nav
                                    className="flex justify-center items-center gap-2 mt-8"
                                    aria-label="Paginación de productos"
                                >
                                    {/* Botón Anterior */}
                                    <button
                                        onClick={() => irAPagina(paginaActual - 1)}
                                        disabled={paginaActual === 1}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Página anterior"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>

                                    {/* Primera página */}
                                    {generarNumerosPagina()[0] > 1 && (
                                        <>
                                            <button
                                                onClick={() => irAPagina(1)}
                                                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                                            >
                                                1
                                            </button>
                                            {generarNumerosPagina()[0] > 2 && (
                                                <span className="px-2 text-gray-500">...</span>
                                            )}
                                        </>
                                    )}

                                    {/* Números de página */}
                                    {generarNumerosPagina().map(num => (
                                        <button
                                            key={num}
                                            onClick={() => irAPagina(num)}
                                            className={`px-3 py-2 rounded-lg border transition-colors ${paginaActual === num
                                                    ? 'bg-orange-500 text-white border-orange-500'
                                                    : 'border-gray-300 hover:bg-gray-100'
                                                }`}
                                            aria-label={`Página ${num}`}
                                            aria-current={paginaActual === num ? 'page' : undefined}
                                        >
                                            {num}
                                        </button>
                                    ))}

                                    {/* Última página */}
                                    {generarNumerosPagina()[generarNumerosPagina().length - 1] < totalPaginas && (
                                        <>
                                            {generarNumerosPagina()[generarNumerosPagina().length - 1] < totalPaginas - 1 && (
                                                <span className="px-2 text-gray-500">...</span>
                                            )}
                                            <button
                                                onClick={() => irAPagina(totalPaginas)}
                                                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                                            >
                                                {totalPaginas}
                                            </button>
                                        </>
                                    )}

                                    {/* Botón Siguiente */}
                                    <button
                                        onClick={() => irAPagina(paginaActual + 1)}
                                        disabled={paginaActual === totalPaginas}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Página siguiente"
                                    >
                                        <FiChevronRight size={20} />
                                    </button>
                                </nav>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-md">
                            <FiSearch size={48} className="mx-auto mb-4 text-gray-400" aria-hidden="true" />
                            <p className="text-gray-500 text-lg">No se encontraron productos.</p>
                            {(categoriaFiltro || busqueda) && (
                                <button
                                    onClick={limpiarFiltros}
                                    className="mt-4 text-orange-600 hover:text-orange-800 underline"
                                >
                                    Limpiar filtros y ver todos
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Products;