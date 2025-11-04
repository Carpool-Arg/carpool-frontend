import { Suspense } from "react";
import EmailChangePage from "./EmailChange";

export default function EmailChange(){
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <EmailChangePage />
        </Suspense>
    );
}