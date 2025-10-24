import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '$ENERGY Token',
  description:
    'Utility that aligns funders, vendors, and growth. $ENERGY powers governance, vendor staking, and performance rewards across the ThirdEnergy ecosystem.',
};

// Real image asset constants from Figma
const img3DFinanceRenderingIconStackBackgroundShinyGoldCoinsLeaning1 =
  '/assets/3d-finance-coins-leaning.png';
const img13471 = '/assets/1347.png';
const imgImage = '/assets/image.png';
const imgCoinThatCouldChangeYourLifeStudioShotBusinessmanHoldingBitcoinAgainstGreyBackground1 =
  '/assets/coin-businessman.png';
const imgCircularArrowsRefreshIconRotationArrowsIconSignSymbolWhiteBackground3DIllustration1 =
  '/assets/circular-arrows.png';
const img3DRenderingIconStackShinyGoldCoinsLeaning1 =
  '/assets/3d-coins-stack.png';
const imgCheckCircle = '/assets/check-circle.svg';

export default function Energy() {
  return (
    <div className='bg-white min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-[#1e1e1e] py-24 px-4'>
        <Image
          src='/assets/hero-bg.png'
          alt='Background Pattern'
          width={1920}
          height={1080}
          className='absolute inset-0 w-full h-full object-cover opacity-15 z-0'
        />

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-6xl md:text-7xl font-bold text-white mb-6 leading-tight'>
              Utility that aligns funders, vendors, and growth
            </h1>
            <p className='text-xl text-[#c5c5c5] mb-8 max-w-3xl mx-auto leading-relaxed'>
              $ENERGY powers governance, vendor staking, and performance rewards
              across the ThirdEnergy ecosystem. Electricity for communities is
              paid in cash through approved vendors; the token aligns incentives
              and anchors transparent operations on Hedera.
            </p>
            <button className='bg-[#fcc744] px-6 py-3 rounded-lg font-semibold text-[#1e1e1e] hover:bg-[#e6b23a] transition-colors'>
              Fund a station
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-24 px-4'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <p className='text-sm text-[#484848] uppercase tracking-wide mb-4'>
              HOW IT WORKS
            </p>
            <h2 className='text-4xl font-bold text-[#1e1e1e]'>
              What $ENERGY does
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='border border-[#ededed] rounded-3xl p-6'>
              <div className='bg-[#ffb600] rounded-full w-10 h-10 mb-4'></div>
              <h3 className='text-2xl font-bold text-[#1e1e1e] mb-2'>
                Governance
              </h3>
              <p className='text-[#484848]'>
                Vote on fees, device pricing, station placement, buyback
                parameters, and treasury allocations.
              </p>
            </div>

            <div className='border border-[#ededed] rounded-3xl p-6'>
              <div className='bg-[#ffb600] rounded-full w-10 h-10 mb-4'></div>
              <h3 className='text-2xl font-bold text-[#1e1e1e] mb-2'>
                Vendor staking
              </h3>
              <p className='text-[#484848]'>
                Operators bond $ENERGY; misbehavior can be slashed by
                on-chain/IoT proofs.
              </p>
            </div>

            <div className='border border-[#ededed] rounded-3xl p-6'>
              <div className='bg-[#ffb600] rounded-full w-10 h-10 mb-4'></div>
              <h3 className='text-2xl font-bold text-[#1e1e1e] mb-2'>
                Rewards & buybacks
              </h3>
              <p className='text-[#484848]'>
                Performance rewards to funders/vendors; part of revenue can buy
                back $ENERGY (by vote).
              </p>
            </div>

            <div className='border border-[#ededed] rounded-3xl p-6'>
              <div className='bg-[#ffb600] rounded-full w-10 h-10 mb-4'></div>
              <h3 className='text-2xl font-bold text-[#1e1e1e] mb-2'>
                Access control
              </h3>
              <p className='text-[#484848]'>
                Station creation & vendor onboarding can require locked/staked
                $ENERGY.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Token Stats Section */}
      <section className='bg-neutral-50 py-24 px-4 relative'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <p className='text-sm text-[#484848] uppercase tracking-wide mb-4'>
              TECHNOLOGY
            </p>
            <h2 className='text-4xl font-bold text-[#1e1e1e]'>Token Stats</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto'>
            <div className='border border-[#ffb600] rounded-3xl p-8 text-center'>
              <div className='text-4xl font-extrabold text-[#1e1e1e] mb-2'>
                12
              </div>
              <div className='text-xl text-[#484848]'>Max Supply</div>
            </div>

            <div className='border border-[#ffb600] rounded-3xl p-8 text-center'>
              <div className='text-4xl font-extrabold text-[#1e1e1e] mb-2'>
                10,000,000
              </div>
              <div className='text-xl text-[#484848]'>Initial circulating</div>
            </div>

            <div className='border border-[#ffb600] rounded-3xl p-8 text-center'>
              <div className='text-4xl font-extrabold text-[#1e1e1e] mb-2'>
                100,000<span className='text-xl'> / epoch</span>
              </div>
              <div className='text-xl text-[#484848]'>Epoch emissions</div>
            </div>

            <div className='border border-[#ffb600] rounded-3xl p-8 text-center'>
              <div className='text-4xl font-extrabold text-[#1e1e1e] mb-2'>
                <span className='text-xl'>Up to </span>20%
                <span className='text-xl'> platform revenue</span>
              </div>
              <div className='text-xl text-[#484848]'>Buyback reserve</div>
            </div>
          </div>
        </div>

        {/* 3D Coin Stack Background Image */}
        <div className='absolute right-8 top-1/2 transform -translate-y-1/2 w-96 h-96 hidden xl:block'>
          <Image
            src={img3DFinanceRenderingIconStackBackgroundShinyGoldCoinsLeaning1}
            alt='3D Gold Coins Stack'
            width={424}
            height={481}
            className='object-contain'
          />
        </div>
      </section>

      {/* How to Get $ENERGY Section */}
      <section className='bg-[#fffaed] py-24 px-4'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <p className='text-sm text-[#484848] uppercase tracking-wide mb-4'>
              IMPACT SO FAR
            </p>
            <h2 className='text-4xl font-bold text-[#1e1e1e]'>
              How to get $ENERGY
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='border border-[#ededed] rounded-3xl p-6 flex flex-col'>
              <div className='bg-[#f5edfe] rounded-xl h-72 mb-6 overflow-hidden relative'>
                <Image
                  src={img13471}
                  alt='Fund Stations'
                  width={356}
                  height={356}
                  className='object-cover w-full h-full'
                  style={{ marginTop: '-42px' }}
                />
              </div>
              <div className='flex-1'>
                <h3 className='text-2xl font-bold text-[#1e1e1e] mb-2'>
                  Fund stations
                </h3>
                <p className='text-[#484848] mb-6'>
                  Back open projects and earn $ENERGY alongside revenue shares.
                </p>
              </div>
              <button className='bg-[#fcc744] px-6 py-3 rounded-lg font-semibold text-[#1e1e1e] hover:bg-[#e6b23a] transition-colors'>
                Fund a station
              </button>
            </div>

            <div className='border border-[#ededed] rounded-3xl p-6 flex flex-col'>
              <div className='bg-[#f5edfe] rounded-xl h-72 mb-6 overflow-hidden relative'>
                <div className='absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs z-10'>
                  1/10
                </div>
                <Image
                  src={imgImage}
                  alt='Vendor Staking'
                  width={356}
                  height={289}
                  className='object-cover w-full h-full'
                />
                <div className='absolute inset-0'>
                  <Image
                    src={
                      imgCoinThatCouldChangeYourLifeStudioShotBusinessmanHoldingBitcoinAgainstGreyBackground1
                    }
                    alt='Businessman with Bitcoin'
                    width={356}
                    height={289}
                    className='object-cover w-full h-full'
                  />
                </div>
              </div>
              <div className='flex-1'>
                <h3 className='text-2xl font-bold text-[#1e1e1e] mb-2'>
                  Vendor staking
                </h3>
                <p className='text-[#484848] mb-6'>
                  Operators stake $ENERGY to run stations; returns depend on
                  performance & policy.
                </p>
              </div>
              <button className='border border-[#fcc744] px-6 py-3 rounded-lg font-semibold text-[#1e1e1e] hover:bg-[#fcc744] transition-colors'>
                Vendor onboarding
              </button>
            </div>

            <div className='border border-[#ededed] rounded-3xl p-6 flex flex-col'>
              <div className='bg-[#f5edfe] rounded-xl h-72 mb-6 overflow-hidden relative'>
                <div className='absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs z-10'>
                  1/10
                </div>
                <Image
                  src={
                    imgCircularArrowsRefreshIconRotationArrowsIconSignSymbolWhiteBackground3DIllustration1
                  }
                  alt='Circular Arrows Refresh'
                  width={356}
                  height={289}
                  className='object-cover w-full h-full'
                />
              </div>
              <div className='flex-1'>
                <h3 className='text-2xl font-bold text-[#1e1e1e] mb-2'>
                  Swap (TBA)
                </h3>
                <p className='text-[#484848] mb-6'>
                  DEX listing after audits & community vote.
                </p>
              </div>
              <button className='border border-[#2b81ff] px-6 py-3 rounded-lg font-semibold text-[#484848] cursor-not-allowed'>
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Governance & Risk Section */}
      <section className='bg-[#1e1e1e] py-24 px-4'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-white'>Governance & risk</h2>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            <div className='w-80 h-60 mx-auto lg:mx-0'>
              <Image
                src={img3DRenderingIconStackShinyGoldCoinsLeaning1}
                alt='3D Gold Coins Stack'
                width={380}
                height={234}
                className='object-contain w-full h-full'
              />
            </div>

            <div className='space-y-8'>
              <div className='flex gap-4'>
                <div className='w-6 h-6 flex-shrink-0 mt-1'>
                  <Image
                    src={imgCheckCircle}
                    alt='Check'
                    width={24}
                    height={24}
                  />
                </div>
                <p className='text-[#e1e1e1]'>
                  $ENERGY is a utility/governance token; not equity. Returns
                  depend on performance & policy.
                </p>
              </div>

              <div className='flex gap-4'>
                <div className='w-6 h-6 flex-shrink-0 mt-1'>
                  <Image
                    src={imgCheckCircle}
                    alt='Check'
                    width={24}
                    height={24}
                  />
                </div>
                <p className='text-[#e1e1e1]'>
                  Staking/slashing rules derive from IoT telemetry and on-chain
                  proofs.
                </p>
              </div>

              <div className='flex gap-4'>
                <div className='w-6 h-6 flex-shrink-0 mt-1'>
                  <Image
                    src={imgCheckCircle}
                    alt='Check'
                    width={24}
                    height={24}
                  />
                </div>
                <p className='text-[#e1e1e1]'>
                  Participation may be restricted by local laws.
                </p>
              </div>

              <div className='flex gap-4 pt-8'>
                <button className='bg-[#fcc744] px-6 py-3 rounded-lg font-semibold text-[#1e1e1e] hover:bg-[#e6b23a] transition-colors'>
                  Governance draft
                </button>
                <button className='border border-[#fcc744] px-6 py-3 rounded-lg font-semibold text-white hover:bg-[#fcc744] hover:text-[#1e1e1e] transition-colors'>
                  Join Forum <span className='text-xs ml-1'>(Coming soon)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fund a Station CTA */}
      <section className='py-24 px-4'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-[#2b81ff] rounded-3xl p-12 text-center text-white'>
            <h2 className='text-4xl font-bold mb-4'>Fund a Station Today</h2>
            <p className='text-xl mb-8 max-w-3xl mx-auto opacity-90'>
              Your funding powers clean energy access and you receive tokenized
              ownership with performance-based returns.
            </p>
            <div className='flex gap-4 justify-center'>
              <button className='border border-[#fcc744] px-6 py-3 rounded-lg font-semibold text-white hover:bg-[#fcc744] hover:text-[#1e1e1e] transition-colors'>
                $ENERGY token
              </button>
              <button className='bg-[#fcc744] px-6 py-3 rounded-lg font-semibold text-[#1e1e1e] hover:bg-[#e6b23a] transition-colors'>
                Fund a station
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
