import React from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200 rounded-xl",
        className
      )}
      {...props}
    />
  );
};

export const RadioCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 flex items-center gap-4 animate-pulse border border-slate-100 shadow-sm">
    <Skeleton className="w-16 h-16 shrink-0 bg-slate-100" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4 bg-slate-100" />
      <Skeleton className="h-3 w-1/4 bg-slate-50" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-3 w-12 bg-slate-50" />
        <Skeleton className="h-3 w-12 bg-slate-50" />
      </div>
    </div>
    <Skeleton className="w-10 h-10 rounded-full bg-slate-100" />
  </div>
);
