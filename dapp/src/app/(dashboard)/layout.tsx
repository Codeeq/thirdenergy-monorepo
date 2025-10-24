import Header from './components/Header';
import WalletGuard from '@/components/auth/WalletGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletGuard>
      <div className='min-h-screen bg-background'>
        <Header />

        <main className=''>{children}</main>

        {/* Footer */}
        <footer className='bg-primary mt-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div className='flex items-center mb-4 md:mb-0'>
                <span className='text-gray-900 text-sm'>Powered by</span>
                <div className='ml-2 flex items-center'>
                  <div className='w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center'>
                    <span className='text-primary text-xs font-bold'>H</span>
                  </div>
                  <span className='ml-1 text-gray-900 font-medium'>HEDERA</span>
                </div>
              </div>

              <div className='flex space-x-6 text-sm text-gray-900'>
                <a href='#' className='hover:text-gray-700 transition-colors'>
                  Terms
                </a>
                <a href='#' className='hover:text-gray-700 transition-colors'>
                  Privacy
                </a>
                <a href='#' className='hover:text-gray-700 transition-colors'>
                  Disclaimer
                </a>
              </div>

              <div className='text-sm text-gray-900 mt-4 md:mt-0'>
                © 2025 ThirdEnergy. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </WalletGuard>
  );
}
