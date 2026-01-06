import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export const SOCIAL_MEDIA = [
  { id: 0, content: "/social-media/facebook.svg", href: "/facebook.com" },
  { id: 1, content: "/social-media/instagram.svg", href: "/instagram.com" },
  { id: 2, content: "/social-media/linkedin.svg", href: "/linkedin.com" },
];

export const Footer = () => {
  return (
    <footer className="bg-[#1F6C2D] text-white pt-12 pb-4 h-[427px]">
      <div className="w-full max-w-[1400px] m-auto px-4 flex justify-between flex-col">
        <div className="pt-8 w-full">
          <h2 className="text-3xl font-bold mb-4">VIRTUAL MED</h2>
          <p className="mb-8">
            Liderando o caminho na <br /> excelência médica, cuidados de
            confiança.
          </p>
        </div>

        <div className="flex justify-between items-center mt-28 border-t pt-10 border-[#BFF8C1]">
          <p className="text-sm text-green-300">
            @ Desenvolvido por — estudantes de engenharia informática / 5º Ano
            ISPL
          </p>

          <nav className="flex items-center gap-8">
            {SOCIAL_MEDIA.map(({ content, id, href }) => (
              <Link
                href={href}
                key={id}
                className={cn(
                  "text-[18px] transition-colors hover:text-white font-normal text-[#FCFEFE]"
                )}
              >
                <Image
                  src={content}
                  alt={content}
                  width={40}
                  height={38}
                  className="object-contain w-5 h-5"
                />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
