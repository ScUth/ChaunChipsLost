"use client"
import { SideBar } from "../../components/sidebar";
import { SideImage } from "../../components/sideimage";

export default function Analysis() {
  let rei = "../../anime-anime-girls-rebuild-of-evangelion-neon-genesis-evangelion-super-robot-taisen-hd-wallpaper-7ef4bdf8f94e5212864f85d6df43db09.png" as const;
  return (
    <div className="min-h-screen w-full bg-[url(https://gizmodo.com/app/uploads/2021/09/95299b3d1b809192a332ad2c708f0599.jpg)] bg-cover bg-center bg-no-repeat flex overflow-hidden">
      
      {/* Sidebar - 15% on large screens, hidden by default on mobile */}
      <SideBar />

      {/* Main container that holds main + right section */}
      <div className="flex flex-1 min-w-0">   {/* ← Important: flex-1 + min-w-0 */}
        
        {/* Main Content - 60% */}
        <main className="flex-[55%] sm:ml-[15%] overflow-auto">
          {/* Your main content here */}
          <div className="p-8">
            Main Content Area (60%)
          </div>
        </main>
        <SideImage imagePath={rei}/>
      </div>
    </div>
  );
}