
import { Suspense } from "react";
import EmailVerifiedPage from "./EmailVerified";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EmailVerifiedPage />
    </Suspense>
  );
}
