import { Suspense } from "react";
import UnlockAccountPage from "./UnlockAccount";


export default function Page(){
    return (
         <Suspense fallback={<div>Cargando...</div>}>
            <UnlockAccountPage/>
        </Suspense>
    );
}