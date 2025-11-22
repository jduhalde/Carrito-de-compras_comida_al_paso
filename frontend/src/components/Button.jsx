function Button({ 
    children, 
    onClick, 
    variant = "primary", 
    disabled = false, 
    className = "",
    type = "button",
    ...props 
}) {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2";
    
    const variants = {
        primary: "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-300",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300",
        success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-300",
        danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-300"
    };
    
    const classes = `${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

    return (
        <button 
            className={classes} 
            onClick={onClick} 
            disabled={disabled}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;