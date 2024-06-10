import Image from 'next/image';
import { HEADER_TITLE } from '@/lib/constants';
import DownloadReport from './report-process';

const Header
    = () => {
        return (
          <header className="px-4 py-2 flex items-center ">
            <div className="flex items-center">
              <Image src="/images/logoey.png" alt="Logo" width={42} height={42} className="mr-4" />
              <h1 className="text-4xl font-bold mt-1">{HEADER_TITLE}</h1>
            </div>
            <div className='float-end ml-auto pt-2'>
              <DownloadReport />
            </div>
          </header>          
        );
    };

export default Header;
