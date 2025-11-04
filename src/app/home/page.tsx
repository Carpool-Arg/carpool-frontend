import Feed from "@/components/feed/Feed";
import SearchBar from "@/components/feed/SearchBar";
import { Clock } from "lucide-react";


export default function HomePage() {
  return (
    <main className="max-w-lg mx-auto">
      <div className="w-full flex items-center justify-center">
        <SearchBar/>
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
