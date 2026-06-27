"use client";

import { ButtonHTMLAttributes } from "react";

export function cn(...parts: (string | false | undefined | null)[]) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Button matching the prototype. Screens pass full color classes via
 * className (e.g. bg-[#0F3D2E]); this only supplies layout + base behaviour.
 */
export function Button({
  className,
  children,
  variant,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.99] disabled:pointer-events-none",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full border bg-white outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15",
        props.className,
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full border border-gray-200 bg-white p-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15",
        props.className,
      )}
    />
  );
}
