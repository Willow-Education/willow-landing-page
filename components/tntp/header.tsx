"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "./wordmark";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "What it is", href: "#what-it-is" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Timeline", href: "#timeline" },
  { label: "Commitment", href: "#commitment" },
];

export function TntpHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-[#FAFAF7]/90 backdrop-blur border-b border-[#E5E5E0]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16 h-16 md:h-[72px] flex items-center justify-between">
        <Wordmark />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] text-[#2D2D2D] hover:text-[#0A0A0A] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#apply"
            className="text-[14px] font-medium bg-[#0A0A0A] text-[#FAFAF7] px-4 py-2 rounded-full hover:bg-[#2D2D2D] transition-colors"
          >
            Apply <span aria-hidden>→</span>
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={cn(
              "block w-5 h-[1.5px] bg-[#0A0A0A] transition-transform duration-200",
              menuOpen && "translate-y-[6px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block w-5 h-[1.5px] bg-[#0A0A0A] transition-opacity duration-200",
              menuOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block w-5 h-[1.5px] bg-[#0A0A0A] transition-transform duration-200",
              menuOpen && "-translate-y-[6px] -rotate-45"
            )}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[#FAFAF7] z-40 px-5 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-heading text-[#0A0A0A]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#apply"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex items-center justify-center text-base font-medium bg-[#0A0A0A] text-[#FAFAF7] px-5 py-3 rounded-full w-fit"
          >
            Apply <span aria-hidden className="ml-1">→</span>
          </a>
        </div>
      )}
    </header>
  );
}
