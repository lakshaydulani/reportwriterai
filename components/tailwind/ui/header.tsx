import Image from "next/image";
import { MessageCircleIcon } from 'lucide-react'
import { HEADER_TITLE } from "@/lib/constants";

const Header = ({ onStartTour }) => {
  return (
    <header className="bg-header-grey px-4 py-2 flex items-center ">
      <div className="flex items-center">
      <Image
          src="/images/eylogo.png"
          alt="Logo"
          width={50}
          height={50}
          // className="mr-4"
        />
        <h1 className="text-2xl text-white font-bold mt-1 ms-1">{HEADER_TITLE}</h1>
      </div>
      <div className="float-end ml-auto pt-2 cursor-pointer" title="How To Use" onClick={() => {
          onStartTour();
        }}>
        <MessageCircleIcon />
      </div>
    </header>
  );
};

export default Header;
