import { MOVE, MOVES } from '@/config/move'
import { FC, useState } from 'react'
import { toast } from 'react-hot-toast'

type Props = {
	solve: (move: number, salt: number) => Promise<any>
	refetch: () => Promise<any>
}

export const SolveForm: FC<Props> = ({ solve, refetch }) => {
	const [salt, setSalt] = useState<number>()
	const [move, setMove] = useState<MOVE>(MOVES[0])
	const [waiting, setWaiting] = useState<boolean>(false)

	const handleSolve = async () => {
		if (!salt) {
			return
		}

		const toastId = toast.loading(`Solving RPS`)

		try {
			setWaiting(true)

			const tx = await solve(MOVES.indexOf(move) + 1, salt)
			await tx.wait()
			await refetch()
			toast.dismiss(toastId)
			toast.success('Successfully solved')
		} catch (err: any) {
			console.log(err)
			toast.dismiss(toastId)
			toast.error(err?.reason ?? err?.message)
		} finally {
			setWaiting(false)
		}
	}

	return (
		<div className="flex flex-col w-full gap-2 mt-10">
			<p className="w-full text-center text-green-600">
				It&#39;s time to solve RPS by clicking following button
			</p>
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
				onClick={handleSolve}
				disabled={waiting}
			>
				{waiting ? 'Solving RPS...' : 'Solve RPS'}
			</button>
		</div>
	)
}
