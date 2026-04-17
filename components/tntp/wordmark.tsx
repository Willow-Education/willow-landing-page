import Link from "next/link";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  href?: string;
}

export function Wordmark({ className, href = "/tntp" }: WordmarkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "font-heading text-[17px] md:text-[18px] tracking-[-0.01em] text-[#0A0A0A] hover:opacity-70 transition-opacity",
        className
      )}
    >
      Opportunity Advising
    </Link>
  );
}
