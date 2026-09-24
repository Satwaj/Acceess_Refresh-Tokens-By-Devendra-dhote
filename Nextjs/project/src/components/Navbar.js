import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./toggleTheme";

export default function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          MyShop
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/layout/home"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>

          <Link
            href="/layout/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>

          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>

          <div className="h-6 w-px bg-muted" ><ModeToggle/></div>
        </div>
      </div>
    </nav>
  );
}
