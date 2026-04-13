'use client'

import { PAGE_LIMIT } from "@/constants/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  total: number;
  skip: number;
}

export function Pagination({
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  total,
  skip,
}: PaginationProps) {
  const currentPage = Math.floor(skip / PAGE_LIMIT) + 1;
  const totalPages = Math.ceil(total / PAGE_LIMIT);

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-[12px] text-gray-11/50">
        Página <span className="text-gray-11/80 font-medium">{currentPage}</span> de{" "}
        <span className="text-gray-11/80 font-medium">{totalPages}</span>
        <span className="ml-2 text-gray-11/40">· {total} conductores</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-md border border-white/8 hover:bg-white/6 hover:border-white/15 transition-colors group disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-white/8"
          title="Página anterior"
        >
          <ChevronLeft size={14} className="text-white/40 group-hover:text-white/70 transition-colors" />
        </button>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page =>
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1
            )
            .reduce<(number | "ellipsis")[]>((acc, page, idx, arr) => {
              if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                acc.push("ellipsis");
              }
              acc.push(page);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-7 h-7 flex items-center justify-center text-[12px] text-white/25"
                >
                  ···
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => {
                    const targetSkip = ((item as number) - 1) * PAGE_LIMIT;
                    const diff = targetSkip - skip;
                    if (diff > 0) onNext();
                    else if (diff < 0) onPrev();
                  }}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium transition-colors border
                    ${item === currentPage
                      ? "bg-white/8 border-white/15 text-white/90"
                      : "border-white/8 text-white/40 hover:bg-white/6 hover:border-white/15 hover:text-white/70 cursor-pointer"
                    }`}
                >
                  {item}
                </button>
              )
            )}
        </div>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-md border border-white/8 hover:bg-white/6 hover:border-white/15 transition-colors group disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-white/8"
          title="Página siguiente"
        >
          <ChevronRight size={14} className="text-white/40 group-hover:text-white/70 transition-colors" />
        </button>
      </div>
    </div>
  );
}