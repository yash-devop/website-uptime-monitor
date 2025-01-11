import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

type HeartBeatType = "once" | "infinite";
type IconGeneratorType =
  | {
      iconType: "dot";
      dotSize?: string;
      className?: string;
      heartBeatType: HeartBeatType;
    }
  | { iconType: "fancy"; color?: string ; iconSize?:string }
  | { iconType: "disabled"; color?: string }
  | { iconType: "custom"; custom: React.ElementType };

export default function DisplayRow({
  children,
  idx,
  pathname,
  monitorId,
  length,
  className,
}: {
  idx: number;
  length: number;
  pathname: string;
  monitorId: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <Link key={monitorId} href={`${pathname}/${monitorId}`}>
        <div
          className={cn(
            `flex justify-between px-3 py-2 items-center gap-4 bg-neutral-7/40 border-sidebar-border/60 w-full hover:bg-neutral-7/90 transition-all ${
              length === 0
                ? "border rounded-lg "
                : idx === 0
                  ? length > 1
                    ? "border border-b-0 rounded-t-lg rounded-tr-lg rounded-tl-lg"
                    : "border rounded-lg"
                  : idx === length - 1
                    ? "border rounded-br-lg rounded-bl-lg "
                    : "border-l border-r border-t "
            } `,
            className
          )}
        >
          {children}
        </div>
      </Link>
    </>
  );
}

export const DisplayRowLeftSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`flex items-center gap-5 pl-4`, className)}>
      {children}
    </div>
  );
};

export const DisplayLeftElement = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`flex items-center gap-5`, className)}>{children}</div>
  );
};
export const DisplayRowRightSection = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div
        className={cn(`flex items-center gap-3.5 grow justify-end`, className)}
      >
        {children}
      </div>
    </>
  );
};

export const DisplayRightElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="w-fit">{children}</div>
    </>
  );
};

export const IconGenerator = (props: IconGeneratorType) => {
  const { iconType } = props;

  return (
    <>
      {iconType === "dot" ? (
        <HeartBeat
          dotSize={props.dotSize}
          className={props.className}
          type={props.heartBeatType}
        />
      ) : iconType === "fancy" ? (
        <>
          <div
            className={cn(
              `shrink-0 flex items-center justify-center rounded-md bg-red-400/25 size-8 text-red-400`,
              props.color
            )}
          >
            <ShieldAlert size={20} className={cn(`shrink-0`,props.iconSize)} />
          </div>
        </>
      ) : iconType === "custom" ? (
        props.custom
      ) : iconType === "disabled" ? (
        <>
          <div className="py-5 flex items-center justify-center">
            <Dot className="text-neutral-5 bg-neutral-5" />
          </div>
        </>
      ) : null}
    </>
  );
};

export const HeartBeat = ({
  dotSize,
  className,
  type,
}: {
  dotSize?: string;
  className?: string;
  type: HeartBeatType;
}) => {
  return (
    <>
      <div className="flex items-center justify-center h-[55px] shrink-0 relative">
        <Dot className={className} />
        {type === "once" && (
          <span
            className={cn(
              `bg-green-3 size-5 rounded-full absolute animate-ping-once`,
              dotSize,
              className
            )}
            id="heartbeat-once"
          />
        )}
        {type === "infinite" && (
          <>
            <span
              className={cn(
                `bg-green-3 size-4 rounded-full absolute animate-ping-inner`,
                dotSize,
                className
              )}
              id="heartbeat-1"
            />
            <span
              className={cn(
                `bg-green-3 size-6 rounded-full absolute animate-ping-outer`,
                dotSize,
                className
              )}
              id="heartbeat-2"
            />
          </>
        )}
      </div>
    </>
  );
};

export const Dot = ({ className }: { className?: string }) => {
  return (
    <>
      <span
        className={cn(
          `bg-green-3 w-[12px] h-[12px] rounded-full z-[1]`,
          className
        )}
        id="dot"
      />
    </>
  );
};
