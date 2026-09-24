'use client';

import { Button } from "@/components/ui/button";

const Error = ({ error, reset }) => {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-2xl">
          ⚠️
        </div>

        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong
        </h2>

        <p className="mt-3 text-muted-foreground">
          We couldnot load the products right now. Please try again.
        </p>

        <Button onClick={() => reset()} className="mt-6 rounded-xl">
          Try Again
        </Button>
      </div>
    </main>
  );
};

export default Error;
