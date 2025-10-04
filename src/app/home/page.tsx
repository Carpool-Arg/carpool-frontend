import Feed from "@/components/feed/Feed";
import { Clock, Search } from "lucide-react";


export default function HomePage() {
  return (
    <main className="flex flex-col h-full">
      <div className="w-full flex items-center justify-center">
        <button className="flex items-center justify-between w-md md:w-lg bg-gray-10 p-2 rounded-2xl md:mt-4 text-start">
          <span className="ml-2">¿Dónde viajamos hoy?</span>
          <Search/>
        </button>
        
      </div>
      <div className="mt-4 flex items-center justify-center w-full">
        {/**
         * mock para visualizar viajes recientes
         */}
        <div className="flex flex-col gap-2 max-w-lg w-full">
          <div className="border border-gray-2 rounded-lg p-2 flex items-center gap-2 text-sm">
              <span className="bg-gray-8 p-2 text-gray-11 rounded-lg"><Clock size={16}/></span>
              <p>Villa Maria - Cordoba</p>
            </div>

            <div className="border border-gray-2 rounded-lg p-2 flex items-center gap-2 text-sm">
              <span className="bg-gray-8 p-2 text-gray-11 rounded-lg"><Clock size={16}/></span>
              <p>Villa Maria - General Deheza</p>
            </div>
        </div>
        
      </div>

      <div className="mt-4 flex items-center justify-center w-full">
        <Feed/>
      </div>
    </main>
  );
}
