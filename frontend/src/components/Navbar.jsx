import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { obtenerCantidadTotal } = useCarrito();
  const navigate = useNavigate();
  const cantidadItems = obtenerCantidadTotal();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            🍔 Comida al Paso
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-blue-200">
              Inicio
            </Link>
            <Link to="/products" className="hover:text-blue-200">
              Productos
            </Link>

            {isAuthenticated && (
              <Link to="/carrito" className="hover:text-blue-200 relative">
                <span className="text-xl">🛒</span>
                {cantidadItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cantidadItems}
                  </span>
                )}
              </Link>
            )}

            {user?.is_staff && (
              <Link to="/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  Hola, {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;