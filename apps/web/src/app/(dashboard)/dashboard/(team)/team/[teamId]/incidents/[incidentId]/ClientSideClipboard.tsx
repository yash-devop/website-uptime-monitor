"use client";

import { Copy } from "lucide-react";
import { RefObject, useState } from "react";

export default function ClientSideClipboard({
  clipboardRef,
}: {
  clipboardRef: RefObject<HTMLElement>;
}) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  async function copyToClipboard(text: string | null | undefined) {
    if (!text) {
      console.error("No text to copy!");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      // Reset the copied status after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
    }
  }

  return (
    <div
      className="flex items-center gap-2 text-neutral-5 select-none cursor-pointer whitespace-nowrap absolute hover:bg-neutral-7 shadow-2xl drop-shadow-2xl hover:text-neutral-1 transition-all bottom-1 right-2 py-1.5 px-2 rounded-md"
      onClick={() => copyToClipboard(clipboardRef.current?.innerText)}
    >
      <Copy size={15} />
      <span className="text-xs">{isCopied ? "Copied!" : "Copy to Clipboard"}</span>
    </div>
  );
}
