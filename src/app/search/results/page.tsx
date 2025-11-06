import Results from "@/components/search/Results";
import { Suspense } from "react";


export default function ResultsPage() {
    return (
        <main className="max-w-lg mx-auto">
            <Suspense fallback={<div>Cargando resultados...</div>}>
                <Results />
            </Suspense>
        </main>
    )
}