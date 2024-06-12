import Image from "next/image";
import { HEADER_TITLE } from "@/lib/constants";

const Header = () => {
  return (
    <header className="px-4 py-2 flex items-center ">
      <div className="flex items-center">
        <h1 className="text-4xl font-bold mt-1 italic ms-1">{HEADER_TITLE}</h1>
      </div>
      <div className="float-end ml-auto pt-2">
        <Image
          src="/images/logoey.png"
          alt="Logo"
          width={50}
          height={50}
          // className="mr-4"
        />
      </div>
    </header>
  );
};

export default Header;
