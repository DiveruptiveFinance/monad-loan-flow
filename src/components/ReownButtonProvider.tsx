import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { AppKitNetwork, monadTestnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://dashboard.reown.com
const projectId = import.meta.env.VITE_PROJECT_ID

// 2. Create a metadata object - optional
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks = [monadTestnet] as [AppKitNetwork, ...AppKitNetwork[]]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  themeMode: "light",
  themeVariables: {
    "--w3m-color-mix": "#836EF9", // LOANAD logo purple
    "--w3m-color-mix-strength": 40,
  },
  features: {
    email: true, // default to true
    socials: [
      "google",
    ],
    emailShowWallets: false, // default to true
  },
  allWallets: "SHOW", // default to SHOW
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}