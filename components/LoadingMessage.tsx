export function LoadingMessage({message}: {message: string}) {
    return (
        <div className="flex justify-center py-10">
            <div className="animate-pulse text-slate-300">{message}</div>
        </div>
    );
}