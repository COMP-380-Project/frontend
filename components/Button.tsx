import clsx from "clsx";

const buttonClasses = {
    base: "rounded-md cursor-pointer disabled:opacity-50",
    variants: {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    },
    size: {
        default: "px-4 py-2",
        small: "px-3 py-1 text-sm"
    },
};

export function Button({
    children,
    icon,
    variant = "primary",
    size = "default",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: React.ReactNode,
    variant?: "primary" | "secondary";
    size?: "default" | "small";
}) {
    return (
        <button 
            className={clsx(
                buttonClasses.base, 
                buttonClasses.variants[variant], 
                buttonClasses.size[size],
                icon && "flex items-center gap-2",
            )}
            {...props}
            >
                {icon}
                {children}
            </button>
    );
}
