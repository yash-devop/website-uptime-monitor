"use client";

import { cn } from "@/lib/utils";
import { LucideProps, ShieldAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export const IncidentCTA = () => {
  const pathname = usePathname();
  return (
    <>
      <div className="flex flex-wrap items-center gap-3 pt-6">
      <QuickCTA
          href={pathname.split("incidents")[0] + "monitors/"}
          Icon={ShieldAlert}
          name="View Monitor"
          className="hover:bg-blue-500/10 hover:text-blue-500"
        />
        <QuickCTA
          href=""
          Icon={Trash2}
          name="Remove"
          className="hover:bg-red-500/10 hover:text-red-500"
          onClick={async () => {
            // TODO: attach the api of delete monitor
            alert("Sheesh");
          }}
        />
      </div>
    </>
  );
};

const QuickCTA = ({
  Icon,
  name,
  className,
  href,
  onClick
}: {
  Icon: React.ComponentType<LucideProps>;
  name: string;
  className?: string;
  href?: string;
  onClick?:()=>void
}) => {
  return (
    <Link
      href={href ?? ""}
      className={cn(
        `flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-neutral-7 rounded-md select-none cursor-pointer transition-all text-neutral-4`,
        className
      )}
      onClick={onClick}
    >
      <Icon size={16} />
      <span className="text-balance">{name}</span>
    </Link>
  );
};
