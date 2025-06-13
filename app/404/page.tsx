// app/404/page.tsx

import { Suspense } from "react";

export default function Custom404() {
  return (
    <Suspense>
    <main className="p-8">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </main>
    </Suspense>
  );
}