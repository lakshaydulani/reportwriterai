import Image from "next/image";
import { MessageCircleIcon } from 'lucide-react'
import { HEADER_TITLE } from "@/lib/constants";

const Header = ({ onStartTour }) => {
  return (
    <header className="px-4 py-2 flex items-center ">
      <div className="flex items-center">
      <Image
          src="/images/logoey.png"
          alt="Logo"
          width={50}
          height={50}
          // className="mr-4"
        />
        <h1 className="text-4xl font-bold mt-1 italic ms-1">{HEADER_TITLE}</h1>
        <Image
          src="/images/aiicon.png"
          alt="AILogo"
          width={20}
          height={20}
        />
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
