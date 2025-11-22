function Card({ children, className = "", onClick, ...props }) {
    const baseClasses = "bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden";
    const clickableClasses = onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : "";

    return (
        <div
            className={`${baseClasses} ${clickableClasses} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;