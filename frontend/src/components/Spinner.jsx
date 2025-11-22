const Spinner = ({ size = 'md', color = 'blue' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const colors = {
        blue: 'border-blue-500',
        white: 'border-white',
        gray: 'border-gray-500'
    };

    return (
        <div
            className={`${sizes[size]} border-4 border-t-transparent ${colors[color]} rounded-full animate-spin`}
            role="status"
            aria-label="Cargando"
        >
            <span className="sr-only">Cargando...</span>
        </div>
    );
};

export default Spinner;