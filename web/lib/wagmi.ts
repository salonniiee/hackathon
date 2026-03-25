import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xBaB674ad1B4AA2189D6ff549D9d08A3994314295'

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors: [
    injected(),
  ],
})

export const CONTRACT_ADDRESS = contractAddress
