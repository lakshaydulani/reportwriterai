import Image from 'next/image';
import { HEADER_TITLE } from '@/lib/constants';


const Header
    = () => {
        return (
            <header className="p-1 flex items-center">
            <div className="flex items-center">
              <Image src="/images/eylogo.webp" alt="Logo" width={50} height={50} className="mr-4" />
              <h1 className="text-3xl font-bold">{HEADER_TITLE}</h1>
            </div>
          </header>          
        );
    };

export default Header;
