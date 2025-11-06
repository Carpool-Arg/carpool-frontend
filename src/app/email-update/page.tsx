import { Suspense } from "react";
import EmailUpdatePage from "./EmailUpdate";

export default function EmailUpdate() {
    return(
        <Suspense fallback={<div>Cargando...</div>}>
            <EmailUpdatePage/>
        </Suspense>
        
    ) 
}