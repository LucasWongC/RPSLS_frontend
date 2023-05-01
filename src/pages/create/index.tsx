import { MOVE, MOVES } from '@/config/move'
import { useMemo, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { isAddress } from 'ethers/lib/utils.js'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import { toast } from 'react-hot-toast'
import { calculateHashFromSalt, deployRPS } from '@/api/web3'
import { shortenAddress } from '@/utils'

const CreatePage: NextPage = () => {
	const router = useRouter()
	const { isConnected, address } = useAccount()
	const { data: signer } = useSigner()
	const { chain } = useNetwork()

	const [playerAddress, setPlayerAddress] = useState<string>()
	const [stakeAmount, setStakeAmount] = useState<number>(0)
	const [salt, setSalt] = useState<number>()
	const [move, setMove] = useState<MOVE>(MOVES[0])
	const [waiting, setWaiting] = useState<boolean>(false)

	const isValidAddress = useMemo(
		() =>
			isAddress(playerAddress as `0x${string}`) &&
			playerAddress?.toLowerCase() != address?.toLowerCase(),
		[address, playerAddress]
	)

	const handleSubmit = async () => {
		if (chain?.unsupported) {
			toast.error(`Couldn't create RPS on this network`)
		}
		if (!isConnected) {
			toast.error('Please connect your wallet to create new RPS')
		}
		if (stakeAmount <= 0) {
			toast.error('Please select valid token amount')
		}

		if (!isValidAddress || !salt) {
			return
		}

		const toastId = toast.loading(
			`Creating New RPS with ${shortenAddress(playerAddress as `0x${string}`)}`
		)

		const hash = calculateHashFromSalt(salt, MOVES.indexOf(move) + 1)

		try {
			setWaiting(true)
			const rpsAddress = await deployRPS(hash, playerAddress!, stakeAmount, signer!)

			toast.dismiss(toastId)
			toast.success('Successfully created')
			router.push(`/rps/${rpsAddress}?network=${chain?.id}`)
		} catch (err: any) {
			console.log(err)
			toast.dismiss(toastId)
			toast.error(err?.reason ?? err?.message)
		} finally {
			setWaiting(false)
		}
	}

	return (
		<main className="flex flex-col items-center justify-around min-h-full p-24">
			<div className="relative flex place-items-center">
				<h1 className="text-6xl font-bold text-black">Create New RPS</h1>
			</div>

			<div className="flex flex-col w-full max-w-lg gap-2">
				<div className="w-full px-3 mb-6 md:mb-0">
					<label
						className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
						htmlFor="player-address"
					>
						Player Address
					</label>
					<input
						className={cx(
							'appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
						)}
						id="player-address"
						type="text"
						placeholder="0x00..."
						value={playerAddress}
						onChange={(e) => setPlayerAddress(e.target.value)}
						disabled={waiting}
					/>
					{!isValidAddress && (
						<p className="text-xs italic text-red-500">Please fill out with valid address.</p>
					)}
				</div>
				<div className="w-full px-3 mb-6 md:mb-0">
					<label
						className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
						htmlFor="param-salt"
					>
						Salt
					</label>
					<input
						className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
						id="param-salt"
						type="number"
						placeholder="Please fill out this field for security"
						value={salt}
						onChange={(e) => setSalt(parseInt(e.target.value))}
						disabled={waiting}
					/>
					{!salt && <p className="text-xs italic text-red-500">Please fill out this field.</p>}
				</div>
				<div className="w-full px-3 mb-6 md:mb-0">
					<label
						className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
						htmlFor="param-stake"
					>
						Stake Amount
					</label>
					<input
						className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
						id="param-stake"
						type="number"
						placeholder="Please fill out this field for security"
						value={stakeAmount}
						onChange={(e) => setStakeAmount(parseFloat(e.target.value))}
						disabled={waiting}
					/>
					{!stakeAmount && (
						<p className="text-xs italic text-red-500">Please fill out this field.</p>
					)}
				</div>
				<div className="w-full px-3 mb-6 md:mb-0">
					<label
						className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
						htmlFor="grid-state"
					>
						Move
					</label>
					<div className="relative">
						<select
							className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded-sm appearance-none focus:outline-none focus:bg-white focus:border-gray-500 disabled:cursor-not-allowed"
							id="grid-state"
							value={move}
							onChange={(e) => setMove(e.target.value as MOVE)}
							disabled={waiting}
						>
							{MOVES.map((item) => (
								<option key={item}>{item}</option>
							))}
						</select>
						<div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
							<svg
								className="w-4 h-4 fill-current"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
							</svg>
						</div>
					</div>
				</div>
				<button
					className="flex-shrink-0 py-2 mx-3 text-sm text-white bg-teal-500 border-4 border-teal-500 rounded hover:bg-teal-700 hover:border-teal-700 disabled:cursor-not-allowed"
					type="button"
					onClick={handleSubmit}
					disabled={!isValidAddress || !salt || waiting}
				>
					{waiting ? 'Creating New RPS...' : 'Create RPS'}
				</button>
			</div>
		</main>
	)
}

export default CreatePage
