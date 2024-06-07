import Image from 'next/image';
import { HEADER_TITLE } from '@/lib/constants';
import ReportProcess from './report-process';

const Header
    = () => {
        return (
          <header className="px-4 py-2 text-white flex items-center ">
            <div className="flex items-center">
              <Image src="/images/eylogo.png" alt="Logo" width={50} height={50} className="mr-4" />
              <h1 className="text-3xl font-bold">{HEADER_TITLE}</h1>
            </div>
            <div className='float-end ml-auto'>
              <ReportProcess />
            </div>
          </header>          
        );
    };

export default Header;
