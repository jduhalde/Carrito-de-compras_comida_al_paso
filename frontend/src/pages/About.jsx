import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

function About() {
    const [formulario, setFormulario] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    const [enviado, setEnviado] = useState(false);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        document.title = "Comida al Paso - Acerca de";
        console.log("Página About cargada");
    }, []);

    useEffect(() => {
        if (Object.keys(errores).length > 0) {
            const nuevosErrores = {};
            Object.keys(errores).forEach(campo => {
                if (formulario[campo].trim() === '') {
                    nuevosErrores[campo] = errores[campo];
                }
            });
            setErrores(nuevosErrores);
        }
    }, [formulario]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormulario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        
        if (!formulario.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es requerido';
        }
        
        if (!formulario.email.trim()) {
            nuevosErrores.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formulario.email)) {
            nuevosErrores.email = 'El email no es válido';
        }
        
        if (!formulario.mensaje.trim()) {
            nuevosErrores.mensaje = 'El mensaje es requerido';
        }

        return nuevosErrores;
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        
        const nuevosErrores = validarFormulario();
        
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        setErrores({});
        console.log("Formulario enviado:", formulario);
        setEnviado(true);
        
        setTimeout(() => {
            setEnviado(false);
            setFormulario({ nombre: '', email: '', mensaje: '' });
        }, 3000);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Acerca de Nosotros
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                    <Card className="p-6 h-full">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                            📖 Nuestra Historia
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Comida al Paso nació en 2020 en pleno corazón de Buenos Aires, 
                            con la misión de brindar comida rápida de calidad excepcional. 
                            Nos especializamos en preparar cada plato con ingredientes frescos 
                            y el cariño de una cocina casera.
                        </p>
                        <p className="text-gray-600">
                            Nuestro equipo de chefs trabaja día a día para ofrecerte la mejor 
                            experiencia gastronómica en el menor tiempo posible, sin comprometer 
                            nunca la calidad de nuestros productos.
                        </p>
                    </Card>
                </div>

                <div>
                    <Card className="p-6 h-full">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                            ⭐ Nuestros Valores
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">🥬</span>
                                <span><strong>Ingredientes frescos:</strong> Seleccionamos cuidadosamente cada ingrediente</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">⚡</span>
                                <span><strong>Rapidez:</strong> Tu comida lista en tiempo récord</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">❤️</span>
                                <span><strong>Pasión:</strong> Cocinamos con amor y dedicación</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2">🤝</span>
                                <span><strong>Servicio:</strong> Atención personalizada para cada cliente</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <Card className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                            📍 Información de Contacto
                        </h2>
                        <div className="space-y-4 text-gray-600">
                            <div className="flex items-center">
                                <span className="text-orange-500 mr-3">📍</span>
                                <span>Av. Corrientes 1234, CABA</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-orange-500 mr-3">📞</span>
                                <span>+54 11 1234-5678</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-orange-500 mr-3">📧</span>
                                <span>info@comidaalpaso.com</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-orange-500 mr-3">🕒</span>
                                <span>Lun - Dom: 11:00 - 23:00</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                            💬 Contáctanos
                        </h2>
                        
                        {enviado ? (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">✅</div>
                                <p className="text-green-600 font-semibold text-lg">
                                    ¡Mensaje enviado correctamente!
                                </p>
                                <p className="text-gray-600 mt-2">
                                    Te responderemos a la brevedad
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={manejarEnvio} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder="Tu nombre completo"
                                        value={formulario.nombre}
                                        onChange={manejarCambio}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                                            errores.nombre ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errores.nombre && (
                                        <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Tu email"
                                        value={formulario.email}
                                        onChange={manejarCambio}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                                            errores.email ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errores.email && (
                                        <p className="text-red-500 text-sm mt-1">{errores.email}</p>
                                    )}
                                </div>

                                <div>
                                    <textarea
                                        name="mensaje"
                                        placeholder="Escribe tu mensaje aquí..."
                                        value={formulario.mensaje}
                                        onChange={manejarCambio}
                                        rows="4"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                                            errores.mensaje ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errores.mensaje && (
                                        <p className="text-red-500 text-sm mt-1">{errores.mensaje}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full py-3">
                                    📨 Enviar Mensaje
                                </Button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default About;