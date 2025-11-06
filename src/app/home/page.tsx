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
        <Feed/>
      </div>
    </main>
  );
}
