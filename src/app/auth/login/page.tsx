"use client";

import { Suspense } from "react";
import LoginPageContent from "./LoginPageContent";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

// Optional (but safer): disable prerendering for this dynamic page
export const dynamic = "force-dynamic";
