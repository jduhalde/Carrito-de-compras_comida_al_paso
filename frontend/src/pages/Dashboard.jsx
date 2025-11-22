import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiPackage,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import inventarioAPI from '../services/inventarioAPI';
import Spinner from '../components/Spinner';
import showToast from '../utils/toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [editando, setEditando] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stock: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [productosRes, categoriasRes] = await Promise.all([
        inventarioAPI.get('/productos/'),
        inventarioAPI.get('/categorias/')
      ]);
      setProductos(productosRes.data.results || productosRes.data);
      setCategorias(categoriasRes.data.results || categoriasRes.data);
    } catch (error) {
      showToast.error('Error al cargar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (formData.descripcion && formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Debes seleccionar una categoría.';
    }

    if (!formData.precio) {
      newErrors.precio = 'El precio es obligatorio.';
    } else if (parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0.';
    }

    if (formData.stock === '' || formData.stock === null) {
      newErrors.stock = 'El stock es obligatorio.';
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock no puede ser negativo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      showToast.warning('Por favor, corrige los errores del formulario.');
      return;
    }

    setSubmitting(true);

    const dataToSend = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      categoria: parseInt(formData.categoria),
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock)
    };

    try {
      if (editando) {
        await inventarioAPI.put(`/productos/${editando}/`, dataToSend);
        showToast.success('¡Producto actualizado correctamente!');
      } else {
        await inventarioAPI.post('/productos/crear/', dataToSend);
        showToast.success('¡Producto creado correctamente!');
      }

      resetFormulario();
      cargarDatos();
    } catch (error) {
      const errorMsg = error.response?.data
        ? Object.values(error.response.data).flat().join(' ')
        : 'Error al guardar el producto.';
      showToast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetFormulario = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: '',
      stock: ''
    });
    setErrors({});
    setEditando(null);
  };

  const handleEditar = (producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria.toString(),
      precio: producto.precio.toString(),
      stock: producto.stock.toString()
    });
    setEditando(producto.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast.info(`Editando: ${producto.nombre}`);
  };

  const confirmarEliminar = (producto) => {
    setProductoAEliminar(producto);
    setShowModal(true);
  };

  const handleEliminar = async () => {
    if (!productoAEliminar) return;

    setSubmitting(true);
    try {
      await inventarioAPI.delete(`/productos/${productoAEliminar.id}/eliminar/`);
      showToast.success('Producto eliminado correctamente.');
      cargarDatos();
    } catch (error) {
      showToast.error('Error al eliminar el producto.');
    } finally {
      setSubmitting(false);
      setShowModal(false);
      setProductoAEliminar(null);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Cargando... | Comida al Paso</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Comida al Paso</title>
        <meta name="description" content="Panel de administración para gestionar productos de Comida al Paso" />
      </Helmet>

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiPackage className="text-blue-600" aria-hidden="true" />
              Dashboard de Administración
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenido, <span className="font-semibold">{user?.username}</span>. Gestiona los productos de la tienda.
            </p>
          </header>

          {/* Formulario */}
          <section
            className="bg-white rounded-lg shadow-md p-6 mb-8"
            aria-labelledby="form-title"
          >
            <h2 id="form-title" className="text-xl font-semibold mb-4 flex items-center gap-2">
              {editando ? (
                <>
                  <FiEdit2 className="text-yellow-600" aria-hidden="true" />
                  Editar Producto
                </>
              ) : (
                <>
                  <FiPlus className="text-green-600" aria-hidden="true" />
                  Agregar Nuevo Producto
                </>
              )}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    placeholder="Ej: Hamburguesa Clásica"
                    aria-required="true"
                    aria-invalid={errors.nombre ? 'true' : 'false'}
                    aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                  />
                  {errors.nombre && (
                    <p id="nombre-error" className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                      <FiAlertCircle aria-hidden="true" />
                      {errors.nombre}
                    </p>
                  )}
                </div>

                {/* Categoría */}
                <div>
                  <label
                    htmlFor="categoria"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Categoría <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.categoria ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    aria-required="true"
                    aria-invalid={errors.categoria ? 'true' : 'false'}
                    aria-describedby={errors.categoria ? 'categoria-error' : undefined}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                  {errors.categoria && (
                    <p id="categoria-error" className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                      <FiAlertCircle aria-hidden="true" />
                      {errors.categoria}
                    </p>
                  )}
                </div>

                {/* Precio */}
                <div>
                  <label
                    htmlFor="precio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Precio <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.precio ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    placeholder="0.00"
                    aria-required="true"
                    aria-invalid={errors.precio ? 'true' : 'false'}
                    aria-describedby={errors.precio ? 'precio-error' : undefined}
                  />
                  {errors.precio && (
                    <p id="precio-error" className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                      <FiAlertCircle aria-hidden="true" />
                      {errors.precio}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Stock <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.stock ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    placeholder="0"
                    aria-required="true"
                    aria-invalid={errors.stock ? 'true' : 'false'}
                    aria-describedby={errors.stock ? 'stock-error' : undefined}
                  />
                  {errors.stock && (
                    <p id="stock-error" className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                      <FiAlertCircle aria-hidden="true" />
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.descripcion ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  placeholder="Describe el producto (mínimo 10 caracteres si lo completas)"
                  aria-invalid={errors.descripcion ? 'true' : 'false'}
                  aria-describedby="descripcion-help descripcion-error"
                />
                {errors.descripcion ? (
                  <p id="descripcion-error" className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                    <FiAlertCircle aria-hidden="true" />
                    {errors.descripcion}
                  </p>
                ) : (
                  <p id="descripcion-help" className="text-xs text-gray-500 mt-1">
                    {formData.descripcion.length}/10 caracteres mínimos
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span>{editando ? 'Actualizando...' : 'Guardando...'}</span>
                    </>
                  ) : (
                    <>
                      <FiSave aria-hidden="true" />
                      <span>{editando ? 'Actualizar Producto' : 'Agregar Producto'}</span>
                    </>
                  )}
                </button>

                {editando && (
                  <button
                    type="button"
                    onClick={resetFormulario}
                    className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    <FiX aria-hidden="true" />
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Lista de Productos */}
          <section
            className="bg-white rounded-lg shadow-md overflow-hidden"
            aria-labelledby="products-title"
          >
            <div className="px-6 py-4 border-b">
              <h2 id="products-title" className="text-xl font-semibold flex items-center gap-2">
                <FiPackage className="text-gray-600" aria-hidden="true" />
                Productos ({productos.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label="Lista de productos">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productos.map(producto => (
                    <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {producto.nombre}
                          </div>
                          {producto.descripcion && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {producto.descripcion}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {producto.categoria_nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        ${parseFloat(producto.precio).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${producto.stock > 10
                          ? 'bg-green-100 text-green-800'
                          : producto.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {producto.stock} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditar(producto)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Editar ${producto.nombre}`}
                            title="Editar"
                          >
                            <FiEdit2 size={18} aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => confirmarEliminar(producto)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label={`Eliminar ${producto.nombre}`}
                            title="Eliminar"
                          >
                            <FiTrash2 size={18} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {productos.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FiPackage size={48} className="mx-auto mb-4 opacity-50" aria-hidden="true" />
                  <p>No hay productos registrados.</p>
                  <p className="text-sm">¡Agrega el primer producto usando el formulario!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FiAlertCircle className="text-red-500" aria-hidden="true" />
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar "<strong>{productoAEliminar?.nombre}</strong>"?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setProductoAEliminar(null);
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                disabled={submitting}
              >
                <FiX aria-hidden="true" />
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:bg-red-400"
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" color="white" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <FiTrash2 aria-hidden="true" />
                    <span>Eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;