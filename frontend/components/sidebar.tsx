"use client"
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <svg
          className="w-5 h-5 transition duration-75 group-hover:text-fg-brand"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
          />
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
          />
        </svg>
      ),
    },
    {
      label: "Analysis",
      href: "/analysis",
      icon: (
        <svg
          className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8"
          />
        </svg>
      ),
      // badgeNode: (
      //   <span className="inline-flex items-center justify-center w-4.5 h-4.5 ms-2 text-xs font-medium text-fg-danger-strong bg-danger-soft border border-danger-subtle rounded-full">
      //     2
      //   </span>
      // ),
    },
    {
      label: "Difference",
      href: "/difference",
      icon: (
        <svg
          className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
    },
    {
      label: "Forecast",
      href: "/forecast",
      icon: (
        <svg
          className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
          />
        </svg>
      ),
    },
  ];

  const logoClick = () => {
    router.push("/");
  }

  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M5 7h14M5 12h14M5 17h10"
          />
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-[15%] h-full transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
        >
        <div className="h-full px-full py-30 overflow-y-auto bg-neutral-primary-soft border-default bg-white/50 dark:bg-black/50 ">
        <img src={"../../tg_white.png"} className="px-5 cursor-pointer hidden dark:block" onClick={logoClick}/>
        <img src={"../../tg_black.png"} className="px-5 cursor-pointer block dark:hidden" onClick={logoClick}/>
          <ul className=" font-medium py-20">
            {navItems.map((item) => (
              <li key={item.label} className={`hover:bg-black/20 hover:backdrop-blur-md ${pathname === item.href ? 'backdrop-blur-md bg-black/20' : ''}`}>
                <a
                  href={item.href}
                  className="flex items-center px-2 py-4 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group px-6"
                >
                  {item.icon}
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm">
                      {item.badge}
                    </span>
                  )}
                  {item.badgeNode}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
