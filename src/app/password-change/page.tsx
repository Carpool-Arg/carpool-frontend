import { Suspense } from "react";
import PasswordChangePage from "./PasswordChange";

export default function page() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <PasswordChangePage />
        </Suspense>
    );

}
