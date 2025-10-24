// Currency conversion utilities for USD to HBAR

// Fallback HBAR price in USD (update this periodically or fetch from API)
const FALLBACK_HBAR_PRICE_USD = 0.054; // Example: $0.054 per HBAR

/**
 * Convert USD amount to HBAR
 * @param usdAmount Amount in USD
 * @param hbarPriceUsd Current HBAR price in USD (optional, uses fallback if not provided)
 * @returns Amount in HBAR
 */
export function usdToHbar(usdAmount: number, hbarPriceUsd?: number): number {
  const price = hbarPriceUsd || FALLBACK_HBAR_PRICE_USD;
  return usdAmount / price;
}

/**
 * Convert HBAR amount to USD
 * @param hbarAmount Amount in HBAR
 * @param hbarPriceUsd Current HBAR price in USD (optional, uses fallback if not provided)
 * @returns Amount in USD
 */
export function hbarToUsd(hbarAmount: number, hbarPriceUsd?: number): number {
  const price = hbarPriceUsd || FALLBACK_HBAR_PRICE_USD;
  return hbarAmount * price;
}

/**
 * Get current HBAR price from CoinGecko API
 * @returns Promise<number> HBAR price in USD
 */
export async function getHbarPriceUsd(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        // Cache for 5 minutes to avoid rate limiting
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch HBAR price');
    }

    const data = await response.json();
    const price = data['hedera-hashgraph']?.usd;

    if (typeof price !== 'number' || price <= 0) {
      throw new Error('Invalid price data received');
    }

    return price;
  } catch (error) {
    console.warn('Failed to fetch HBAR price from API, using fallback:', error);
    return FALLBACK_HBAR_PRICE_USD;
  }
}

/**
 * Format number with appropriate decimal places for display
 * @param value Number to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted string
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format currency amount for display
 * @param amount Amount to format
 * @param currency Currency symbol (default: '$')
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = '$',
  decimals: number = 2
): string {
  return `${currency}${formatNumber(amount, decimals)}`;
}

/**
 * Format HBAR amount for display
 * @param amount HBAR amount to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted HBAR string
 */
export function formatHbar(amount: number, decimals: number = 2): string {
  return `${formatNumber(amount, decimals)} HBAR`;
}
