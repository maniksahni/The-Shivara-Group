"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface CRMDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function CRMDrawer({
  isOpen,
  onClose,
  eyebrow,
  title,
  description,
  children,
  footer,
}: CRMDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] isolate">
          <motion.button
            type="button"
            aria-label="Close drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-[#020617]/72 backdrop-blur-[5px]"
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="crm-drawer-title"
            initial={{ x: "100%", opacity: 0.92 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.92 }}
            transition={{ type: "spring", damping: 34, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-[100dvh] w-full flex-col overflow-hidden border-l border-white/10 bg-[#0E1726] text-white shadow-[-28px_0_90px_rgba(0,0,0,0.48)] md:w-[600px] xl:w-[640px]"
          >
            <header className="sticky top-0 z-10 flex shrink-0 items-start justify-between gap-4 border-b border-white/10 bg-[#0E1726]/96 px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] shadow-lg shadow-black/10 backdrop-blur-xl sm:px-6">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F4B400]">
                  {eyebrow}
                </p>
                <h2 id="crm-drawer-title" className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
              {children}
            </div>

            <footer className="sticky bottom-0 z-10 shrink-0 border-t border-white/10 bg-[#0E1726]/96 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-18px_42px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-6">
              {footer}
            </footer>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
