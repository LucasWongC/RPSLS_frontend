import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { menus } from '@/config/navigation'
import cx from 'classnames'

const Header = () => {
	const router = useRouter()

	return (
		<div className="w-full p-4 shadow-md shadow-slate-600">
			<div className="relative flex flex-col items-center justify-between gap-3 mx-auto text-center md:flex-row md:text-start">
				<h3 className="text-xl font-bold lg:text-4xl">RPS Test</h3>
				<ul className="flex-1 hidden h-full px-10 transform lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-6">
					{menus.map((menu) => (
						<li key={menu.title}>
							<Link
								className={cx('text-sm text-gray-400 hover:text-gray-500', {
									'!text-blue-600': router.asPath === menu.link,
								})}
								href={menu.link}
							>
								{menu.title}
							</Link>
						</li>
					))}
				</ul>
				<div className="flex flex-row items-center w-full md:w-auto">
					<ConnectButton />
				</div>
			</div>
		</div>
	)
}

export default Header
