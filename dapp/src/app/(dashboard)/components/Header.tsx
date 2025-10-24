import Link from 'next/link';
import Image from 'next/image';
import WalletButton from '@/components/wallet/WalletButton';

export default function Header() {
  return (
    <header className='bg-background border-b border-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center h-16 gap-8'>
          {/* Logo */}
          <Link href='/' className='flex items-center'>
            <div className='flex items-center'>
              <Image
                src='/logo.svg'
                alt='Logo'
                width={127}
                height={34}
                className='object-contain'
              />
            </div>
          </Link>

          {/* Navigation Menu - Desktop */}
          <nav className='hidden md:flex space-x-8 ml-auto'>
            <Link
              href='/$energy'
              className='text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200'
            >
              $ENERGY
            </Link>
            <Link
              href='/stations'
              className='text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200'
            >
              Fund a station
            </Link>
            <Link
              href='/portfolio'
              className='text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200'
            >
              Portfolio
            </Link>
          </nav>

          {/* Connect Wallet Button */}
          <div className='hidden md:block'>
            <WalletButton showBalance={true} />
          </div>

          {/* Mobile menu button */}
          <button
            className='md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-25 ml-auto'
            aria-label='Open mobile menu'
          >
            <svg
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Hidden by default, would need state management for toggle */}
      <div className='md:hidden border-t border-gray-100'>
        <div className='px-2 pt-2 pb-3 space-y-1'>
          <Link
            href='/senergy'
            className='block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-25 rounded-md font-medium'
          >
            $ENERGY
          </Link>
          <Link
            href='/stations'
            className='block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-25 rounded-md font-medium'
          >
            Fund a station
          </Link>
          <Link
            href='/portfolio'
            className='block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-25 rounded-md font-medium'
          >
            Portfolio
          </Link>
          <div className='px-3 py-2'>
            <WalletButton className='w-full' showBalance={true} />
          </div>
        </div>
      </div>
    </header>
  );
}
