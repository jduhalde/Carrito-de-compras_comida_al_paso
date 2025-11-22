import { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe usarse dentro de CarritoProvider');
    }
    return context;
};

export const CarritoProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            try {
                setItems(JSON.parse(carritoGuardado));
            } catch (error) {
                console.error('Error al cargar carrito:', error);
                localStorage.removeItem('carrito');
            }
        }
    }, []);

    // Guardar en localStorage cada vez que cambie el carrito
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(items));
    }, [items]);

    // Agregar producto al carrito
    const agregarAlCarrito = (producto, cantidad = 1) => {
        if (cantidad <= 0) {
            alert('La cantidad debe ser mayor a 0');
            return false;
        }

        if (cantidad > producto.stock) {
            alert(`Solo hay ${producto.stock} unidades disponibles`);
            return false;
        }

        setItems(prevItems => {
            const itemExistente = prevItems.find(item => item.id === producto.id);

            if (itemExistente) {
                const nuevaCantidad = itemExistente.cantidad + cantidad;

                if (nuevaCantidad > producto.stock) {
                    alert(`Solo hay ${producto.stock} unidades disponibles`);
                    return prevItems;
                }

                return prevItems.map(item =>
                    item.id === producto.id
                        ? {
                            ...item,
                            cantidad: nuevaCantidad,
                            subtotal: nuevaCantidad * item.precio
                        }
                        : item
                );
            } else {
                return [
                    ...prevItems,
                    {
                        id: producto.id,
                        nombre: producto.nombre,
                        categoria: producto.categoria?.nombre || producto.categoria,
                        precio: parseFloat(producto.precio),
                        cantidad: cantidad,
                        subtotal: parseFloat(producto.precio) * cantidad,
                        stock: producto.stock
                    }
                ];
            }
        });

        return true;
    };

    // Eliminar producto del carrito
    const eliminarDelCarrito = (productoId) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productoId));
    };

    // Actualizar cantidad de un producto
    const actualizarCantidad = (productoId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(productoId);
            return;
        }

        setItems(prevItems =>
            prevItems.map(item => {
                if (item.id === productoId) {
                    if (nuevaCantidad > item.stock) {
                        alert(`Solo hay ${item.stock} unidades disponibles`);
                        return item;
                    }
                    return {
                        ...item,
                        cantidad: nuevaCantidad,
                        subtotal: nuevaCantidad * item.precio
                    };
                }
                return item;
            })
        );
    };

    // Vaciar carrito completo
    const vaciarCarrito = () => {
        setItems([]);
    };

    // Calcular total del carrito
    const calcularTotal = () => {
        return items.reduce((total, item) => total + item.subtotal, 0);
    };

    // Obtener cantidad total de items
    const obtenerCantidadTotal = () => {
        return items.reduce((total, item) => total + item.cantidad, 0);
    };

    const value = {
        items,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        calcularTotal,
        obtenerCantidadTotal
    };

    return (
        <CarritoContext.Provider value={value}>
            {children}
        </CarritoContext.Provider>
    );
};

export default CarritoContext;