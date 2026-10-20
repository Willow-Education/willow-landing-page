"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { List, X } from "phosphor-react";
import { cn } from "@/lib/utils";
import { WillowLogo } from "./willow-logo";
import { Button } from "./button";
import Link from "next/link";

const navLinks = [
  { name: "Curriculum", href: "/curriculum" },
  { name: "About us", href: "/about" },
  { name: "Willow vs Others", href: "/willow-vs-others" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  const updateScrolled = useCallback(() => {
    setScrolled(window.scrollY > 20);
    ticking.current = false;
  }, []);

  useEffect(() => {
    // Check initial scroll position on mount
    updateScrolled();

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrolled);
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateScrolled]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || mobileMenuOpen
            ? "bg-white shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex items-center h-16 relative">
            {/* Logo */}
            <div className="flex items-center">
              <WillowLogo className="h-8 w-auto" />
            </div>

            {/* Desktop Navigation - Right aligned */}
            <div className="hidden md:flex items-center gap-8 ml-auto">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[14px] text-primary hover:text-heading transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="https://app.willowed.org/public/login"
                className="text-secondary text-[14px] font-normal hover:text-heading transition-colors"
              >
                Login
              </a>
              <a href="https://calendly.com/d/cq6c-qdg-hjw/willow-curriculum-platform-demo-meeting?month=2025-12" target="_blank" rel="noopener noreferrer">
                <Button>
                  Request a proposal
                </Button>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-auto">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-primary hover:text-heading p-2 relative z-50"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X size={24} weight="regular" />
                ) : (
                  <List size={24} weight="regular" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation - Full screen overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white md:hidden transition-opacity duration-300",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full pt-20 px-5">
          {/* Navigation Links */}
          <div className="flex flex-col space-y-6 py-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl text-heading font-medium"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://app.willowed.org/public/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl text-secondary font-normal"
            >
              Login
            </a>
          </div>

          {/* CTA Buttons - Pushed to bottom */}
          <div className="mt-auto pb-10 flex flex-col gap-3">
            <Link
              href="/curriculum-sample"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant="secondary" className="w-full">
                Get a curriculum sample
              </Button>
            </Link>
            <a
              href="https://calendly.com/d/cq6c-qdg-hjw/willow-curriculum-platform-demo-meeting?month=2025-12"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full">
                Request a proposal
              </Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
