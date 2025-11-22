function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">🍽️ Comida al Paso</h3>
                    <p className="text-gray-400">Comida rápida de calidad desde 2020</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <h4 className="font-semibold mb-2">Horarios</h4>
                        <p className="text-gray-400">Lun - Dom: 11:00 - 23:00</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Teléfono</h4>
                        <p className="text-gray-400">+54 11 1234-5678</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Dirección</h4>
                        <p className="text-gray-400">Av. Corrientes 1234, CABA</p>
                    </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-400">© 2025 Comida al Paso. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;