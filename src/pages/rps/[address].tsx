import { MOVES } from '@/config/move'
import { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { BigNumber } from 'ethers'
import { toast } from 'react-hot-toast'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { PlayForm, SolveForm, Spinner, TimeoutForm } from '@/components'
import { useRps } from '@/hooks/useRps'
import { formatBigNumberWithUnits, shortenAddress } from '@/utils'

const RPSRoom: NextPage = () => {
	const router = useRouter()
	const { address: rpsAddress, network } = router.query as {
		address: `0x${string}`
		network: string
	}
	const { chain } = useNetwork()
	const { switchNetwork } = useSwitchNetwork()
	const { isConnected } = useAccount()

	const { data, isCreator, isJoiner, expired, refetch, play, solve, timeout } = useRps(rpsAddress)

	const handleCopyUrl = () => {
		navigator.clipboard.writeText(window.location.origin + router.asPath)
		toast.success('Copied to clipboard')
	}

	useEffect(() => {
		if (isConnected && chain?.id && network && chain.id != parseInt(network)) {
			toast.error('Invalid network, Please switch your network')

			switchNetwork?.(parseInt(network))
		}
	}, [chain, isConnected, network, switchNetwork])

	useEffect(() => {
		if (data?.stakeAmount && data?.stakeAmount.eq(0)) {
			toast.error('This RPS already finished')
		}
	}, [data?.stakeAmount])

	return (
		<main className="flex flex-col items-center justify-around min-h-full p-24">
			<div className="relative flex place-items-center">
				<h1 className="text-6xl font-bold text-black">RPS Data</h1>
			</div>

			<div className="flex flex-col w-full max-w-2xl gap-2">
				{data ? (
					data?.creator ? (
						<>
							<div className="flex flex-col w-full gap-1">
								<div
									className="italic font-bold text-green-700 underline cursor-pointer w-fit"
									onClick={handleCopyUrl}
								>
									Please send this url to player 2
								</div>
								<div className="flex items-center justify-between w-full text-black">
									<div>Vault Address</div>
									<div className="font-bold">{shortenAddress(rpsAddress)}</div>
								</div>
								<div className="flex items-center justify-between w-full text-black">
									<div>Player 1</div>
									<div className="font-bold">
										{isCreator ? 'You' : shortenAddress(data.creator)}
									</div>
								</div>
								<div className="flex items-center justify-between w-full text-black">
									<div>Player 1 Hash</div>
									<div className="font-bold">{shortenAddress(data.c1Hash)}</div>
								</div>
								<div className="flex items-center justify-between w-full text-black">
									<div>Player 2</div>
									<div className="font-bold">{isJoiner ? 'You' : shortenAddress(data.joiner)}</div>
								</div>
								<div className="flex items-center justify-between w-full text-black">
									<div>Player 2 Move</div>
									<div className="font-bold">
										{data.joinerMove ? MOVES[data.joinerMove - 1] : "Did't move yet"}
									</div>
								</div>
								<div className="flex items-center justify-between w-full text-black">
									<div>Staking Amount</div>
									<div className="font-bold">{formatBigNumberWithUnits(data.stakeAmount)} ETH</div>
								</div>
							</div>
							{isJoiner && !expired && !data?.joinerMove && (
								<PlayForm play={play} refetch={refetch} />
							)}
							{isCreator && !!data?.joinerMove && data?.stakeAmount.gt(BigNumber.from('0')) && (
								<SolveForm solve={solve} refetch={refetch} />
							)}
							{expired &&
								data?.stakeAmount.gt(BigNumber.from('0')) &&
								((isCreator && !data?.joinerMove) || (isJoiner && data?.joinerMove)) && (
									<TimeoutForm timeout={timeout} refetch={refetch} />
								)}
						</>
					) : (
						<div className="w-full text-2xl text-center text-red-600">Invalid contract address</div>
					)
				) : (
					<div className="flex items-center justify-center w-full h-full">
						<Spinner />
					</div>
				)}
			</div>
		</main>
	)
}

export default RPSRoom
