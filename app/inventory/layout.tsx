'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import mainImage from '@/asset/images/main-logo-platform.png';
import imageCloud from '@/asset/images/image-cloud.jpg';
import { cn } from '@/lib/utils';

import Sidebar from '../components/sidebar/Sidebar';
import FadeRight from './styles/animation/FadeRight';
import FadeLeft from './styles/animation/FadeLeft';

export default function InventoryLayout({ children }: { children: ReactNode }) {
  const route = useRouter();
  const path = usePathname();
  const isDashboardPage = path === '/inventory';

  const LogoComponent = () => (
    <div className="w-full pt-0 overflow-hidden min-h-10 ">
      <Link className='flex items-center' href={'/inventory'}>
        <Image src={mainImage?.src} width={200} height={200} alt="Platform image" className="h-9 w-9" />
        <span className="text-(--orange-color) font-semibold italic text-lg">Inventory</span>
      </Link>
    </div>
  );

  const buttonAboveTableClasses =
    'rounded-full flex font-bold text-[0.813rem] gap-0.5 items-center justify-center duration-300 shadow-none md:bg-(--orange-color) md:hover:bg-(--orange-color)/90 cursor-pointer md:shadow-lg text-(--text-primary-color) min-h-[40px] md:px-[1.25rem]';

  return (
    <div className="flex p-[1.5rem] bg-(--primary-color) h-screen gap-5 overflow-hidden">
      <div className="hidden lg:block max-w-56 w-full space-y-4">
        <FadeLeft delay={0.3}>
          <LogoComponent />
        </FadeLeft>
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 w-full space-y-4">
        <div className="flex justify-between">
          <div className="block lg:hidden">
            <FadeLeft delay={0.3}>
              <LogoComponent />
            </FadeLeft>
          </div>

          <div className={cn('bottom-5 right-10 md:bottom-auto md:right-auto lg:w-full pt-0 h-fit min-h-10 flex justify-end')}>
            <FadeRight delay={0.3}>
              {isDashboardPage ? (
                <button onClick={() => route.push('inventory/create')} className={cn(buttonAboveTableClasses)}>
                  <Plus className="size-5 md:size-4 mr-2 md:mr-0" strokeWidth={3} />
                  <span className="hidden md:block">Tambah</span>
                </button>
              ) : (
                <button onClick={() => route.push('/inventory')} className={cn(buttonAboveTableClasses)}>
                  <ChevronLeft className="size-5 md:size-4 mr-2 md:mr-0" strokeWidth={3} />
                  <span className="hidden md:block">Back</span>
                </button>
              )}
            </FadeRight>
          </div>
        </div>

        <main
          style={{ backgroundImage: `url(${imageCloud?.src})` }}
          className="flex flex-col flex-1 p-4 h-full rounded-[0.875rem] shadow-xl relative overflow-hidden bg-cover overflow-x-auto"
        >
          <div className="absolute inset-0 h-full w-full bg-(--secondary-color) top-0 left-0 opacity-[97%] z-40" />
          <div className="z-50 flex-1 relative overflow-y-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
