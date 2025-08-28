"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingText, className }: { children: React.ReactNode; pendingText?: string; className?: string }) {
  const { pending } = useFormStatus();
  const finalClassName = (className
    ? className + " cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    : "h-11 px-4 rounded-md bg-foreground text-background text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed");
  return (
    <button
      type="submit"
      disabled={pending}
      className={finalClassName}
    >
      {pending ? (pendingText || "Saving…") : children}
    </button>
  );
}

export function ConfirmSubmitButton({
  children,
  confirmText,
  pendingText,
  className,
}: {
  children: React.ReactNode;
  confirmText: string;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const finalClassName = (className
    ? className + " cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    : "h-9 px-3 rounded-md bg-red-600 text-white text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed");
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        }
      }}
      disabled={pending}
      className={finalClassName}
    >
      {pending ? (pendingText || "Please wait…") : children}
    </button>
  );
}


