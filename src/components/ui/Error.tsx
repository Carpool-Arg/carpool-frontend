'use client';

import { XCircle } from "lucide-react";

type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-auto mb-auto border border-red-500/60 dark:border-red-400/60 bg-gray-6 dark:bg-gray-8 rounded-xl p-6 shadow-md max-w-md mx-auto">
      <XCircle className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" />

      <p className="text-center text-red-600 dark:text-red-400 font-medium">
        {message}
      </p>
    </div>
  );
}
