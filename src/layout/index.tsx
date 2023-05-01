import { FC, PropsWithChildren } from 'react'
import Header from './header'
import Toast from '@/components/Toast';

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className={`relative w-screen h-screen flex flex-col items-center  ${inter.className}`}>
			<Header />
			<div className="w-full flex-1 h-[calc(100vh-74px)] overflow-x-visible overflow-y-auto ">
				{children}
			</div>
			<Toast />
		</div>
	)
}

export default Layout
