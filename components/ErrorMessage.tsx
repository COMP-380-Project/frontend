export function ErrorMessage({error}: {error: Error | null | string}) {
    if(!error) return null;

    return (
         <div className="mb-4 rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-rose-200">
        {error instanceof Error ? error.message : error}
        </div>
    );
}