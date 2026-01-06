import { ThemeToggle } from "./ThemeToggle";
import {
  Menubar as MenubarPrimitive,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function Menubar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <MenubarPrimitive className="rounded-none border-0 bg-transparent h-16 space-x-0 p-0 flex items-center justify-between w-full">
          <div className="flex items-center">
            <a
              href="#"
              className="font-semibold text-lg"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Ruisi Wang
            </a>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </MenubarPrimitive>
      </div>
    </div>
  );
}
