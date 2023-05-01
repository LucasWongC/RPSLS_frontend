import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, wagmiClient } from '@/config/wagmi'
import Layout from '@/layout'
import { ContextProviders } from '@/contexts'
import { Suspense } from 'react'
import ErrorBoundary from '@/components/ErroBoundary'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Suspense>
			<ErrorBoundary>
				<WagmiConfig client={wagmiClient}>
					<RainbowKitProvider chains={chains}>
						<ContextProviders>
							<Layout>
								<Component {...pageProps} />
							</Layout>
						</ContextProviders>
					</RainbowKitProvider>
				</WagmiConfig>
			</ErrorBoundary>
		</Suspense>
	)
}
