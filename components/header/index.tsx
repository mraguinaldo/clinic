"use client"; // ← IMPORTANTE: Adicione isso no topo se estiver usando app router

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const MAIN_HEADER = [
  {
    id: 0,
    content: "EMERGÊNCIA",
    description: "(244) 934-574-259",
    icon: "/header/phone.svg",
  },
  {
    id: 1,
    content: "ABERTO",
    description: "24/24 horas",
    icon: "/header/timer.svg",
  },
  {
    id: 2,
    content: "LocaLização",
    description: "Cacuaco, nova urbanização",
    icon: "/header/pin.svg",
  },
];

export const MENU_HEADER = [
  { id: 0, content: "Início", href: "/" },
  { id: 1, content: "Sobre nós", href: "/about-us" },
  { id: 2, content: "Serviços", href: "/services" },
  { id: 3, content: "Doctores", href: "/doctors" },
  { id: 4, content: "Consultas", href: "/consultation" },
  { id: 5, content: "Contacto", href: "/contacts" },
];

export const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const topBar = document.querySelector(".top-bar");
      const topBarHeight = topBar ? topBar.offsetHeight : 140;

      if (window.scrollY > topBarHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="bg-white">
        <div className="w-full top-bar border-b border-gray-200">
          <div className="flex justify-between items-center gap-2 w-full max-w-[1400px] m-auto px-4 ">
            <div>
              <Image
                src="/header/logo.png"
                alt="logo"
                width={274}
                height={72}
                className="object-contain"
              />
            </div>

            <nav className="flex justify-between w-full max-w-[990px] gap-8">
              {MAIN_HEADER.map(({ content, description, icon, id }) => (
                <div key={id} className="flex items-center gap-4">
                  <Image
                    src={icon}
                    alt={content}
                    width={40}
                    height={38}
                    className="object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="text-[16px] uppercase text-[#1F6C2D] font-semibold">
                      {content}
                    </p>
                    <span className="text-[16px] text-[#4EEC15] font-semibold">
                      {description}
                    </span>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div
          className={cn(
            "w-full bg-[#1F6C2D] h-[80px] z-50 shadow-lg transition-all duration-300",
            isScrolled ? "fixed top-0 left-0 right-0" : "relative"
          )}
        >
          <div className="w-full max-w-[1400px] m-auto px-4 py-4 flex justify-between items-center">
            <nav className="flex items-center gap-8">
              {MENU_HEADER.map(({ content, id, href }) => (
                <Link
                  href={href}
                  key={id}
                  className={cn(
                    "text-[18px] transition-colors hover:text-white",
                    pathname === href
                      ? "font-medium text-white"
                      : "font-normal text-[#FCFEFE]"
                  )}
                >
                  {content}
                </Link>
              ))}
            </nav>

            <Link
              href="/login"
              className="bg-[#BFF8C1] py-2 px-8 font-semibold text-[#1F6C2D] rounded-md hover:bg-[#a8e6ab] transition-colors"
            >
              Marcar consulta
            </Link>
          </div>
        </div>
      </header>

      {isScrolled && <div className="h-[80px]" />}
    </>
  );
};
