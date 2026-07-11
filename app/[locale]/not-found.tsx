export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-2 p-6 text-center">
            <h1 className="text-2xl font-semibold">404</h1>
            <p className="text-muted-foreground">
                This page could not be found.
            </p>
        </div>
    );
}
