import clsx from "clsx";

const buttonClasses = {
    base: "rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium transition",
    variants: {
        primary: "bg-amber-400 text-slate-950 hover:bg-amber-300",
        secondary: "border border-slate-500 bg-slate-900 text-slate-100 hover:border-slate-300 hover:text-white"
    },
    size: {
        default: "px-4 py-2.5",
        small: "px-3 py-1.5 text-sm"
    },
};

export function Button({
    children,
    icon,
    variant = "primary",
    size = "default",
    className,
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
                className,
            )}
            {...props}
            >
                {icon}
                {children}
            </button>
    );
}
