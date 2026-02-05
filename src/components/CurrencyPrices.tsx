// CurrencyPrices.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface PriceData {
  [currency: string]: number; // e.g., { usd: 0.000017, eur: 0.000016 }
}

interface StoredData {
  prices: PriceData;
  timestamp: number;
}

export default function CurrencyPrices() {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //
  // Stop testing
  //
  const stopRequest = true;
  //

  // Format number without decimals, with commas
  const formatPrice = (price: number) => {
    return Math.round(price).toLocaleString('en-US');
  };

  // Fetch BTC prices
  const fetchPrices = async () => {
    try {
      if (!stopRequest) {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,gbp,jpy,cad,aud,nok'
        );
        const newPrices = response.data.bitcoin;
        const data: StoredData = { prices: newPrices, timestamp: Date.now() };
        localStorage.setItem('btcPrices', JSON.stringify(data));
        setPrices(newPrices);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      setError('Failed to load prices');
      setLoading(false);
    }
  };

  // Check localStorage and fetch if needed
  useEffect(() => {
    const stored = localStorage.getItem('btcPrices');
    if (stored) {
      const { prices: storedPrices, timestamp } = JSON.parse(stored) as StoredData;
      const minutesPassed = (Date.now() - timestamp) / (1000 * 60);
      if (minutesPassed < 1) {
        setPrices(storedPrices);
        setLoading(false);
        return;
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-64 px-4 py-6 bg-gray-900 text-white">
        <p className="text-sm text-gray-400">Loading prices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 px-4 py-6 bg-gray-900 text-white">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-64 px-4 py-6 bg-gray-900 text-white space-y-4">
      <h2 className="text-xl font-bold flex items-center">₿ BTC Prices</h2>
      <ul className="space-y-2">
        {Object.entries(prices).map(([currency, price]) => (
          <li
            key={currency}
            className="flex justify-between items-center text-sm border-b border-pink-700/50 pb-1"
          >
            <span className="text-yellow-200 uppercase">{currency}</span>
            <span className="text-gray-300">{formatPrice(price)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}