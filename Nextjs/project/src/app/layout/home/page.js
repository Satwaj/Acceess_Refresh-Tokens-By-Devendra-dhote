import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium text-primary">
          SIMPLE. MODERN. BEAUTIFUL.
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Everything you need,
          <br />
          <span className="text-muted-foreground">in one simple place.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Discover a simple and thoughtful shopping experience designed around
          the things that matter to you.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/layout/products">Explore Products</Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/login">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Home;
