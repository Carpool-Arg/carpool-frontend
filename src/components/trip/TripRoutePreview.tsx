import { TripStop } from "@/types/tripStop";
import { capitalize, capitalizeWords } from "@/utils/string";
import { Navigation, MapPin, Circle, CircleSmall } from "lucide-react";
import { GoDot, GoDotFill } from "react-icons/go";

interface TripRoutePreviewProps {
  tripStops: TripStop[];
}

export function TripRoutePreview({ tripStops }: TripRoutePreviewProps) {
  return (
    <div className="w-full py-4">
      <div className="space-y-0">
        {tripStops.map((stop, index) => {
          const isFirst = stop.start;
          const isLast = stop.destination;
          const isNotLast = index < tripStops.length - 1;

          return (
            <div key={index} className="flex items-start justify-center">
              {/* Columna del punto y línea conectora */}
              <div className="flex flex-col items-center pt-1">
                {/* Punto/Ícono */}
                <div className="flex-shrink-0">
                  {isFirst && (
                    <span><Circle size={20}/></span>
                  )}
                  
                  {isLast && (
                    <span><CircleSmall size={20}/></span>
                  )}
                  
                  {!isFirst && !isLast && (
                    <span><GoDotFill className="h-5 w-5"/></span>
                  )}
                </div>

                {/* Línea conectora hacia el siguiente punto */}
                {isNotLast && (
                  <div className="w-px h-12 border-l border-dashed border-gray-400 dark:border-gray-500 mt-1"></div>
                )}
              </div>

              {/* Contenido del stop */}
              <div className="ml-6 pb-6 font-inter flex-1">
                <h3
                  className={`font-medium text-gray-900 dark:text-white ${
                    !isFirst && !isLast ? 'text-md' : 'text-lg'
                  }`}
                >
                  {stop.cityName}
                </h3>
                {stop.observation && (
                  <p className="text-sm font-light leading-2 text-gray-500 dark:text-gray-400 mt-1">
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