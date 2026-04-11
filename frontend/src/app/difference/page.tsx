"use client";
import { SideBar } from "../../../components/sidebar";
import { SideImage } from "../../../components/sideimage";

export default function Analysis() {
  let rei = "../../asuna_yuuki_render_1_by_lq_luck_by_luki0127_degqyxz-fullview.png" as const;
  return (
    <div className="min-h-screen w-full bg-[url(https://images7.alphacoders.com/676/thumb-1920-676949.jpg)] bg-cover bg-center bg-no-repeat flex overflow-hidden">
      {/* Sidebar - 15% on large screens, hidden by default on mobile */}
      <SideBar />

      {/* Main container that holds main + right section */}
      <div className="flex flex-1 min-w-0">
        {" "}
        {/* ← Important: flex-1 + min-w-0 */}
        {/* Main Content - 60% */}
        <main className="flex-[55%] sm:ml-[15%] overflow-auto">
          {/* Your main content here */}
          <div className="p-8">Main Content Area (60%)</div>
        </main>
        <SideImage imagePath={rei} />
      </div>
    </div>
  );
}
