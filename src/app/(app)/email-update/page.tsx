import { Suspense } from "react";
import EmailUpdatePage from "./EmailUpdate";
import Spinner from "@/components/ux/Spinner";

export default function EmailUpdate() {
    return(
        <Suspense fallback={<Spinner/>}>
            <EmailUpdatePage/>
        </Suspense>
        
    ) 
}