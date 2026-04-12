"use client";
import { SideBar } from "../../../components/sidebar";
import { SideImage } from "../../../components/sideimage";

export default function Analysis() {
  let rei = "../../a6a26c71d98776874a921c84e1059a8d33916af6.png" as const;
  return (
    <div className="min-h-screen w-full bg-[url(https://scontent.fbkk29-7.fna.fbcdn.net/v/t39.30808-6/485148342_1136888541817903_778452936387835507_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=aKiFyNLKIi8Q7kNvwFt4vr8&_nc_oc=Adoa60palfJWsr8BcS4GCyPE3H9jERtQwdXeTUTdW3VauPIM1AM64_dV34OS3tGUu_AfBux9C0Y5qC18BN9DNaNu&_nc_zt=23&_nc_ht=scontent.fbkk29-7.fna&_nc_gid=Ygph8O-BeMISiNs-GAdpDg&_nc_ss=7a389&oh=00_Af0cETtNVWJxzgcEezR-O3hxLXPlqi7xitaXXFyd4BeiGg&oe=69E0108D)] bg-cover bg-center bg-no-repeat flex overflow-hidden">
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
