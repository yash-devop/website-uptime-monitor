"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChangelogBanner({ changelog }: { changelog: string }) {
  const [bannerState, setBannerState] = useState<boolean | null>(null);

  useEffect(() => {
    // Access `localStorage` only in the browser
    if (typeof window !== "undefined") {
      const banner = localStorage.getItem("banner");
      if (banner === null) {
        localStorage.setItem("banner", "true");
        setBannerState(true);
      } else {
        setBannerState(banner === "true");
      }
    }
  }, []);

  const handleCloseBanner = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("banner", "false");
      setBannerState(false);
    }
  };

  if (bannerState === null) return null;

  return (
    <>
      {bannerState && (
        <div>
          <header className="h-10 bg-sred-400 flex items-center justify-between w-full border-b border-neutral-6 bg-black-1/65 backdrop-blur-sm text-sm px-8">
            <nav className="max-w-[1200px] mx-auto flex items-center justify-between w-full text-white">
              <div className="flex flex-grow justify-center w-full">
                <p className="text-xs cursor-default">
                  <span className="text-sm">🎉 </span>
                  {changelog}
                </p>
              </div>
              <X
                className="text-neutral-5 cursor-pointer"
                size={16}
                onClick={handleCloseBanner}
              />
            </nav>
          </header>
        </div>
      )}
    </>
  );
}
