"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
      <h1 className="font-headline text-3xl font-bold text-destructive mb-4">
        Oops! Something went wrong.
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected issue. Please try again, or if the problem persists, contact support.
      </p>
      {error?.message && (
        <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md mb-4">
          Error details: {error.message}
        </p>
      )}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        variant="default"
        size="lg"
      >
        Try Again
      </Button>
    </div>
  );
}
