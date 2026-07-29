import Link from "next/link";
import Button from "@/components/ui/Button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-black text-[var(--primary)] opacity-20 mb-4">404</div>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-[var(--muted)] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button className="gap-2"><Home size={16} /> Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
