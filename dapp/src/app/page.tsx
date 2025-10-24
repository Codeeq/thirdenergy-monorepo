import Link from 'next/link';
import Image from 'next/image';
import DynamicWalletButton from '@/components/wallet/DynamicWalletButton';

// Create simple SVG icons as placeholders
const CheckIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle cx='12' cy='12' r='10' fill='#22c55e' />
    <path
      d='m9 12 2 2 4-4'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const TransmissionTowerIcon = () => (
  <svg
    width='82'
    height='82'
    viewBox='0 0 82 82'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect x='38' y='10' width='6' height='60' fill='#fcc744' />
    <rect x='20' y='25' width='42' height='2' fill='#fcc744' />
    <rect x='25' y='35' width='32' height='2' fill='#fcc744' />
    <rect x='30' y='45' width='22' height='2' fill='#fcc744' />
    <rect x='35' y='55' width='12' height='2' fill='#fcc744' />
  </svg>
);

export default function LandingPage() {
  return (
    <div className='bg-white flex flex-col items-start relative w-full'>
      {/* Hero Section */}
      <div className='bg-[#1e1e1e] min-h-[823px] relative w-full overflow-hidden'>
        {/* Background World Map */}
        <div className='absolute left-1/2 top-[180px] transform -translate-x-1/2 w-[1392px] h-[559px] opacity-30'>
          <Image
            src='/assets/world-map-bg.png'
            alt='World map background'
            fill
            className='object-cover'
            style={{
              objectPosition: '0% 38.68%',
              transform: 'scale(1.66)',
            }}
            priority
          />
        </div>

        {/* Header */}
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[1440px] h-[86px] z-20'>
          <div className='flex items-center justify-between px-[90px] py-[20px] h-full'>
            {/* Logo */}
            <div className='flex items-center'>
              <Image
                src='/logo.svg'
                alt='Third Energy'
                width={168}
                height={45}
                className='h-[45px] w-auto'
              />
            </div>

            {/* Navigation */}
            <div className='flex items-center gap-[52px]'>
              <div className='flex items-center gap-[54px] font-medium text-[16px] text-white'>
                <Link
                  href='/$energy'
                  className='hover:text-[#fcc744] transition-colors'
                >
                  $ENERGY
                </Link>
                <Link
                  href='/stations'
                  className='hover:text-[#fcc744] transition-colors'
                >
                  Fund a station
                </Link>
                <Link
                  href='/portfolio'
                  className='hover:text-[#fcc744] transition-colors'
                >
                  Portfolio
                </Link>
              </div>
              <DynamicWalletButton />
            </div>
          </div>
        </div>

        {/* Transmission Towers Animation */}
        <div className='absolute left-[184px] top-[201px] w-[1067px] h-[426px] z-10'>
          {/* Tower positions from Figma */}
          <div className='absolute left-0 top-[60px] bg-[#1e1e1e] w-[78px] h-[130px] rounded-[56px] flex items-center justify-center'>
            <TransmissionTowerIcon />
          </div>
          <div className='absolute left-[788px] top-0 bg-[#1e1e1e] w-[89px] h-[130px] rounded-[56px] flex items-center justify-center'>
            <TransmissionTowerIcon />
          </div>
          <div className='absolute left-[478px] top-[112px] bg-[#1e1e1e] w-[78px] h-[130px] rounded-[56px] flex items-center justify-center'>
            <TransmissionTowerIcon />
          </div>
          <div className='absolute left-[978px] top-[296px] bg-[#1e1e1e] w-[89px] h-[130px] rounded-[56px] flex items-center justify-center'>
            <TransmissionTowerIcon />
          </div>
          <div className='absolute left-[272px] top-[235px] bg-[#1e1e1e] w-[78px] h-[130px] rounded-[56px] flex items-center justify-center'>
            <TransmissionTowerIcon />
          </div>

          {/* Connection lines - simplified */}
          <svg className='absolute inset-0 w-full h-full pointer-events-none'>
            <defs>
              <linearGradient
                id='lineGradient'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
              >
                <stop offset='0%' stopColor='#fcc744' stopOpacity='0.3' />
                <stop offset='50%' stopColor='#fcc744' stopOpacity='0.8' />
                <stop offset='100%' stopColor='#fcc744' stopOpacity='0.3' />
              </linearGradient>
            </defs>
            <line
              x1='78'
              y1='125'
              x2='478'
              y2='177'
              stroke='url(#lineGradient)'
              strokeWidth='2'
            />
            <line
              x1='556'
              y1='177'
              x2='788'
              y2='65'
              stroke='url(#lineGradient)'
              strokeWidth='2'
            />
            <line
              x1='350'
              y1='300'
              x2='978'
              y2='361'
              stroke='url(#lineGradient)'
              strokeWidth='2'
            />
            <line
              x1='833'
              y1='130'
              x2='978'
              y2='296'
              stroke='url(#lineGradient)'
              strokeWidth='2'
            />
          </svg>
        </div>

        {/* Dark overlay */}
        {/* <div className="absolute inset-0 bg-[rgba(30,30,30,0.6)] backdrop-blur-[1px] z-15" /> */}

        {/* Hero Content */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20 w-[1007px] max-w-[90%]'>
          <div className='flex flex-col gap-[36px] items-center'>
            <div className='flex flex-col gap-[17px] items-center'>
              <h1 className='font-bold text-[92px] leading-[108px] max-sm:text-[48px] max-sm:leading-[56px] max-md:text-[64px] max-md:leading-[72px]'>
                Become a Global Electricity Provider
              </h1>
              <p className='font-normal text-[20px] max-w-[642px] max-sm:text-[16px]'>
                Crowdfund solar stations for off-grid communities, earn
                performance-based returns, and track transparent impact on
                Hedera.
              </p>
            </div>
            <Link
              href='/stations'
              className='bg-[#fcc744] text-[#1e1e1e] px-[24px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:bg-[#e6b33d] transition-colors'
            >
              Fund a station
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className='w-full py-[100px] bg-white'>
        <div className='max-w-[1440px] mx-auto px-[90px] max-sm:px-[20px]'>
          <div className='text-center mb-[100px]'>
            <p className='text-[#484848] text-[14px] font-normal uppercase mb-[17px]'>
              HOW IT WORKS
            </p>
            <h2 className='text-[#1e1e1e] text-[44px] font-bold max-sm:text-[32px]'>
              From your wallet to their lightbulb
            </h2>
          </div>

          <div className='flex flex-col gap-[24px] max-w-[1260px] mx-auto'>
            {/* First row */}
            <div className='grid grid-cols-2 gap-[24px] max-md:grid-cols-1'>
              <div className='border border-[#ededed] rounded-[24px] p-[24px] h-[325px] flex flex-col justify-center items-center text-center relative'>
                <div className='text-[84px] font-bold text-[#f5f5f5] absolute top-[50px]'>
                  01
                </div>
                <div className='z-10'>
                  <h3 className='text-[28px] font-bold text-[#1e1e1e] mb-[16px]'>
                    Fund a Station
                  </h3>
                  <p className='text-[16px] text-[#484848] max-w-[285px]'>
                    Back a solar station pool and receive tokenized ownership.
                  </p>
                </div>
              </div>

              <div className='border border-[#ededed] rounded-[24px] p-[24px] h-[325px] flex flex-col justify-center items-center text-center relative'>
                <div className='text-[84px] font-bold text-[#f5f5f5] absolute top-[50px]'>
                  02
                </div>
                <div className='z-10'>
                  <h3 className='text-[28px] font-bold text-[#1e1e1e] mb-[16px]'>
                    Vendor Operates
                  </h3>
                  <p className='text-[16px] text-[#484848] max-w-[285px]'>
                    Screened local businesses resell electricity and manage
                    devices.
                  </p>
                </div>
              </div>
            </div>

            {/* Second row */}
            <div className='grid grid-cols-2 gap-[24px] max-md:grid-cols-1'>
              <div className='border border-[#ededed] rounded-[24px] p-[24px] h-[325px] flex flex-col justify-center items-center text-center relative'>
                <div className='text-[84px] font-bold text-[#f5f5f5] absolute top-[50px]'>
                  03
                </div>
                <div className='z-10'>
                  <h3 className='text-[28px] font-bold text-[#1e1e1e] mb-[16px]'>
                    IoT + Hedera
                  </h3>
                  <p className='text-[16px] text-[#484848] max-w-[285px]'>
                    Real-time usage & revenue logged via Hedera for
                    transparency.
                  </p>
                </div>
              </div>

              <div className='border border-[#ededed] rounded-[24px] p-[24px] h-[325px] flex flex-col justify-center items-center text-center relative'>
                <div className='text-[84px] font-bold text-[#f5f5f5] absolute top-[50px]'>
                  04
                </div>
                <div className='z-10'>
                  <h3 className='text-[28px] font-bold text-[#1e1e1e] mb-[16px]'>
                    Earn Returns
                  </h3>
                  <p className='text-[16px] text-[#484848] max-w-[285px]'>
                    Revenue is split to funders, vendors, maintenance &
                    treasury.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='text-center mt-[100px]'>
            <Link
              href='/dashboard/stations'
              className='bg-[#fcc744] text-[#1e1e1e] px-[24px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:bg-[#e6b33d] transition-colors'
            >
              Get started now
            </Link>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className='w-full py-[100px] bg-white'>
        <div className='max-w-[1440px] mx-auto px-[90px] max-sm:px-[20px]'>
          <div className='text-center mb-[100px]'>
            <p className='text-[#484848] text-[14px] font-normal uppercase mb-[17px]'>
              TECHNOLOGY
            </p>
            <h2 className='text-[#1e1e1e] text-[44px] font-bold max-sm:text-[32px]'>
              Designed for off-grid reliability
            </h2>
          </div>

          <div className='grid grid-cols-2 gap-[40px] max-lg:grid-cols-1'>
            {/* Portable Device */}
            <div className='border border-[#ededed] rounded-[24px] p-[32px] h-[634px] flex flex-col justify-end'>
              <div className='space-y-[16px]'>
                <h3 className='text-[28px] font-bold text-[#1e1e1e]'>
                  Portable Device
                </h3>

                <div className='flex items-start gap-[16px]'>
                  <CheckIcon />
                  <p className='text-[16px] text-[#484848]'>
                    AC dock-only charging (station-compatible)
                  </p>
                </div>

                <div className='flex items-start gap-[16px]'>
                  <CheckIcon />
                  <p className='text-[16px] text-[#484848]'>
                    Built-in lamp, attachable bulbs, multi-head phone cable
                  </p>
                </div>

                <div className='flex items-start gap-[16px]'>
                  <CheckIcon />
                  <p className='text-[16px] text-[#484848]'>
                    Foldable stand fan
                  </p>
                </div>

                <div className='flex items-start gap-[16px]'>
                  <CheckIcon />
                  <p className='text-[16px] text-[#484848]'>
                    Telemetry: charge cycles, health, anti-tamper
                  </p>
                </div>
              </div>
            </div>

            {/* Power Station */}
            <div className='border border-[#ededed] rounded-[24px] p-[32px] h-[634px] flex flex-col justify-end'>
              <div className='space-y-[16px]'>
                <h3 className='text-[28px] font-bold text-[#1e1e1e]'>
                  Power Station
                </h3>

                <div className='flex items-start gap-[16px]'>
                  <CheckIcon />
                  <p className='text-[16px] text-[#484848]'>
                    Solar + battery + smart touchscreen UI
                  </p>
                </div>

                <div className='flex items-start gap-[16px]'>
                  <CheckIcon />
                  <p className='text-[16px] text-[#484848]'>
                    On-chain vendor credit gating; cash-to-charge workflow
                  </p>
                </div>

                <div className='flex items-start gap-[16px]'>
                  <CheckIcon />
                  <p className='text-[16px] text-[#484848]'>
                    Hedera Consensus Service: usage & revenue logs
                  </p>
                </div>

                <div className='flex items-start gap-[16px]'>
                  <CheckIcon />
                  <p className='text-[16px] text-[#484848]'>
                    Hedera Token Service: crowdfunding shares & rewards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className='w-full py-[100px] bg-[#fffaed]'>
        <div className='max-w-[1440px] mx-auto px-[90px] max-sm:px-[20px]'>
          <div className='text-center mb-[100px]'>
            <p className='text-[#484848] text-[14px] font-normal uppercase mb-[17px]'>
              IMPACT SO FAR
            </p>
            <h2 className='text-[#1e1e1e] text-[44px] font-bold max-sm:text-[32px]'>
              Transparent, verifiable progress
            </h2>
          </div>

          <div className='grid grid-cols-4 gap-[24px] max-lg:grid-cols-2 max-sm:grid-cols-1'>
            <div className='border border-[#ffb600] rounded-[24px] p-[32px] text-center'>
              <div className='text-[44px] font-extrabold text-[#1e1e1e] mb-[8px]'>
                12
              </div>
              <p className='text-[20px] text-[#484848]'>Communities powered</p>
            </div>

            <div className='border border-[#ffb600] rounded-[24px] p-[32px] text-center'>
              <div className='text-[44px] font-extrabold text-[#1e1e1e] mb-[8px]'>
                184,220
              </div>
              <p className='text-[20px] text-[#484848]'>kWh delivered</p>
            </div>

            <div className='border border-[#ffb600] rounded-[24px] p-[32px] text-center'>
              <div className='text-[44px] font-extrabold text-[#1e1e1e] mb-[8px]'>
                92
              </div>
              <p className='text-[20px] text-[#484848]'>CO₂ offset (t)</p>
            </div>

            <div className='border border-[#ffb600] rounded-[24px] p-[32px] text-center'>
              <div className='text-[44px] font-extrabold text-[#1e1e1e] mb-[8px]'>
                31,504
              </div>
              <p className='text-[20px] text-[#484848]'>Devices charged</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='w-full py-[92px] bg-white'>
        <div className='max-w-[1440px] mx-auto px-[90px] max-sm:px-[20px]'>
          <div className='bg-[#2b81ff] rounded-[24px] p-[32px] text-center text-white min-h-[389px] flex flex-col justify-center'>
            <div className='mb-[32px]'>
              <h2 className='text-[44px] font-bold mb-[8px] max-sm:text-[32px]'>
                Fund a Station Today
              </h2>
              <p className='text-[16px] text-[#f7f7f7] max-w-[642px] mx-auto'>
                Your funding powers clean energy access and you receive
                tokenized ownership with performance-based returns.
              </p>
            </div>

            <div className='flex items-center justify-center gap-[8px] max-sm:flex-col'>
              <DynamicWalletButton
                variant='secondary'
                className='border border-[#fcc744] text-white hover:bg-[#fcc744] hover:text-[#1e1e1e]'
              />
              <Link
                href='/dashboard/stations'
                className='bg-[#fcc744] text-[#1e1e1e] px-[24px] py-[14px] rounded-[8px] font-semibold text-[16px] hover:bg-[#e6b33d] transition-colors'
              >
                Fund a station
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='w-full bg-[#fcc744] py-[28px]'>
        <div className='max-w-[1440px] mx-auto px-[90px] max-sm:px-[20px] flex items-center justify-between max-sm:flex-col max-sm:gap-[16px]'>
          <div className='flex items-center gap-[16px]'>
            <p className='text-[#1e1e1e] text-[12px] font-normal'>Powered by</p>
            <div className='flex items-center gap-[6px]'>
              <div className='w-[24px] h-[24px] bg-[#1e1e1e] rounded-full flex items-center justify-center'>
                <span className='text-[#fcc744] text-[8px] font-bold'>H</span>
              </div>
              <span className='text-[#1e1e1e] text-[12px] font-bold'>
                HEDERA
              </span>
            </div>
          </div>

          <div className='flex items-center gap-[8px] text-[#1e1e1e] text-[14px] font-medium max-sm:order-3'>
            <Link href='#' className='hover:underline'>
              Terms
            </Link>
            <Link href='#' className='hover:underline'>
              Privacy
            </Link>
            <Link href='#' className='hover:underline'>
              Disclaimer
            </Link>
          </div>

          <p className='text-[#1e1e1e] text-[12px] font-normal max-sm:order-2'>
            © 2025 ThirdEnergy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
