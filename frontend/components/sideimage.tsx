"use client"
import { useState } from "react";

export function SideImage({ imagePath }) {
  const [isOpen, setIsOpen] = useState(false);
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
      </button>
      <aside
        id="default-sidebar"
        className={`fixed top-0 right-0 z-40 w-[30%] h-full transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-full py-50 overflow-y-auto bg-neutral-primary-soft border-e border-default">
          {imagePath && <img src={imagePath} alt="sidebar" className="object-contain bottom-0 fixed"/>}
        </div>
      </aside>
    </div>
  );
}
