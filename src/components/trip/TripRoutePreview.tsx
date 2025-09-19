import { TripStop } from "@/types/tripStop";
import { capitalizeWords } from "@/utils/string";
import { Circle, CircleSmall, Square } from "lucide-react";
import { GoDotFill } from "react-icons/go";

interface TripRoutePreviewProps {
  tripStops: TripStop[];
}

export function TripRoutePreview({ tripStops }: TripRoutePreviewProps) {
  return (
    <div className="w-full py-4">
      <div className="flex flex-col items-center space-y-0">
        {tripStops.map((stop, index) => {
          const isFirst = stop.start;
          const isLast = stop.destination;
          const isNotLast = index < tripStops.length - 1;

          return (
            <div key={index} className="flex items-start w-full">
              {/* Columna de puntos y línea */}
              <div className="flex flex-col items-center">
                {/* Punto del stop */}
                {isFirst && <Circle size={12} fill="white" stroke="white" />}
                {!isFirst && !isLast && <Circle size={12} className=" text-gray-2 dark:text-gray-6" />}
                {isLast && <Square size={12} fill="white" stroke="white" />}

                {/* Línea que conecta con el siguiente */}
                {isNotLast && <div className="w-0.5 h-12 bg-gray-5 my-2"></div>}
              </div>

              {/* Contenido del stop */}
              <div className="ml-4 flex-1">
                <h3 className={`font-medium leading-3 text-gray-900 dark:text-white ${!isFirst && !isLast ? 'text-md' : 'text-lg'}`}>
                  {stop.cityName}
                </h3>
                {stop.observation && (
                  <p className="text-sm font-light text-gray-2 dark:text-gray-6 mt-1">
                    {capitalizeWords(stop.observation)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
