import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Comida al Paso - Iniciar Sesión';
    if (isAuthenticated && user) {
      // Redirigir según el tipo de usuario
      const destino = user.is_staff ? '/dashboard' : '/products';
      const from = location.state?.from?.pathname || destino;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    const result = await login(formData.username, formData.password);
    if (!result.success) {
      setError(result.error);
    }
    // La redirección se maneja en el useEffect cuando cambie isAuthenticated y user
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🍽️ Comida al Paso</h1>
          <h2 className="text-2xl font-semibold text-gray-600">Iniciar Sesión</h2>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tu nombre de usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tu contraseña"
              />
            </div>

            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-orange-600 hover:text-orange-500 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;