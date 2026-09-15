"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-20 text-center sm:px-6">
      <AlertTriangle className="mx-auto size-12 text-destructive" />
      <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">
        An unexpected error occurred while rendering this page.
      </p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}