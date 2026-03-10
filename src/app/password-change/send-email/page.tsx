import { Suspense } from "react";
import SendChangePasswordEmailPage from "./SendEmail";

export default function Page(){
  return (
      <Suspense fallback={<div>Cargando...</div>}>
          <SendChangePasswordEmailPage />
      </Suspense>
  );
  
}