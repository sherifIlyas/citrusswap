import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig, Chain, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import theme from '../theme';
import {
  bybitWallet,
  coinbaseWallet,
  ledgerWallet,
  okxWallet,
  rabbyWallet,
  walletConnectWallet,
  injectedWallet
} from '@rainbow-me/rainbowkit/wallets';

const sonic = {
  id: 146,
  name: 'Sonic',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.soniclabs.com'] },
  },
  blockExplorers: {
    default: { name: 'SonicScan', url: 'https://sonicscan.org' },
  },
  contracts: {},
} as const satisfies Chain;

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Installed',
      wallets: [
        injectedWallet
      ],
    },
    {
      groupName: 'Recommended',
      wallets: [
        rabbyWallet,
        bybitWallet,
        coinbaseWallet,
        okxWallet,
        ledgerWallet,
        walletConnectWallet
      ],
    },
  ],
  {
    appName: 'Citrus Shadow',
    projectId: 'abef33618efec2facc187297d98e9868',
  }
);

// Create a custom storage handler to properly handle connection errors
const createCustomStorage = () => {
  // Create a no-op storage for server-side rendering
  const noopStorage = {
    getItem: (_key: string) => null,
    setItem: (_key: string, _value: string) => {},
    removeItem: (_key: string) => {}
  };
  
  // Return no-op storage if window is undefined (SSR)
  if (typeof window === 'undefined') {
    return noopStorage;
  }
  
  // Check if localStorage is available
  try {
    // Test localStorage functionality
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    
    // Return localStorage implementation for client-side
    return {
      getItem: (key: string) => {
        try {
          const storedValue = window.localStorage.getItem(key);
          // Only process wallet-related keys
          if (storedValue && key.includes('wallet')) {
            try {
              const parsed = JSON.parse(storedValue);
              // Clear any problematic wallet states (error, disconnected, or connecting)
              if (
                parsed?.state?.status === 'error' || 
                parsed?.state?.status === 'disconnected' ||
                (parsed?.state?.status === 'connecting' && Date.now() - (parsed?.state?.lastUpdated || 0) > 30000)
              ) {
                console.log(`Clearing problematic wallet state: ${parsed?.state?.status}`);
                window.localStorage.removeItem(key);
                return null;
              }
            } catch (parseError) {
              // If JSON parsing fails, clear the stored value as it might be corrupted
              console.warn(`Failed to parse wallet data, clearing: ${parseError}`);
              window.localStorage.removeItem(key);
              return null;
            }
          }
          return storedValue;
        } catch (error) {
          console.error('Error accessing localStorage:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          // For wallet keys, ensure we're not storing problematic states
          if (key.includes('wallet')) {
            try {
              const parsed = JSON.parse(value);
              // Add a timestamp to connecting states to handle timeouts
              if (parsed?.state?.status === 'connecting') {
                parsed.state.lastUpdated = Date.now();
                value = JSON.stringify(parsed);
              }
            } catch (e) {
              // Continue with original value if parsing fails
            }
          }
          window.localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error setting localStorage:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    };
  } catch (e) {
    console.warn('localStorage is not available:', e);
    return noopStorage; // Return no-op storage if localStorage is not available
  }
};

const config = getDefaultConfig({
  appName: 'Citrus Shadow',
  projectId: 'abef33618efec2facc187297d98e9868',
  chains: [sonic],
  ssr: true,
  connectors,
  storage: createCustomStorage()
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}