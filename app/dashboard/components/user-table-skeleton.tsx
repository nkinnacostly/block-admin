"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function UserTableSkeleton() {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <div className="border-b bg-secondary">
          <div className="flex h-12 items-center px-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-1">
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-4">
              {Array.from({ length: 10 }).map((_, j) => (
                <div key={j} className="flex-1">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
