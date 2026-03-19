"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyAlert({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center p-4 gap-4 w-full ">
      <div className="bg-dark-1 rounded-lg p-3">
        {icon}
      </div>
      <div className="border border-gray-6 h-12"></div>
      <div>
        <p className="text-lg font-medium leading-tight">{title}</p>
        <p className="text-sm text-gray-9 font-inter" >
          {description}
        </p>
      </div>
    </div>
  );
}