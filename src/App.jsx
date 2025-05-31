import React from 'react';
import Routes from '@/routes/Routes';
import { Toaster } from 'react-hot-toast';
import { aquaSubnet } from './utils';
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { InjectedConnector } from 'wagmi/connectors/injected'

const { chains, publicClient } = configureChains(
  [aquaSubnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: aquaSubnet.rpcUrls.default.http[0],
      }),
    }),
  ],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [
    new InjectedConnector({ chains }),
  ]
  // webSocketPublicClient,
})


export default function App() {
  return (
    <WagmiConfig config={config}>
      <Routes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </WagmiConfig>
  );
}
