import { useRouteError } from "react-router";

export function ErrorPage() {
    const error = useRouteError() as Error;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
            <p className="text-gray-600 mb-4">
                We're sorry, but an unexpected error occurred.
            </p>
            <details className="text-sm text-gray-500">
                <summary>Error details</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded">
                    {error?.message || "Unknown error"}
                </pre>
            </details>
        </div>
    );
}