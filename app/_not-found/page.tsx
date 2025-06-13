import { Suspense } from "react";

// app/_not-found/page.tsx
export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <main className="p-8">
      <h1 className="text-4xl font-bold">Not Found</h1>
      <p>Sorry, the requested resource could not be found.</p>
    </main>
    </Suspense>
  );
}