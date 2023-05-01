import {
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, goerli } from 'wagmi';
import { bscTestnet, avalancheFuji, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [goerli, bscTestnet, avalancheFuji, polygonMumbai],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RPS Test',
  projectId: 'YOUR_PROJECT_ID',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export {chains, wagmiClient}