import { FC, useState } from 'react'
import { toast } from 'react-hot-toast'

type Props = {
	timeout: () => Promise<any>
	refetch: () => Promise<any>
}

export const TimeoutForm: FC<Props> = ({ timeout, refetch }) => {
	const [waiting, setWaiting] = useState<boolean>(false)

	const handleTimeout = async () => {
		const toastId = toast.loading(`Resolving conflict`)
		try {
			setWaiting(true)

			const tx = await timeout()
			await tx.wait()
			await refetch()
			toast.dismiss(toastId)
			toast.success('Timeout successes')
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
				Already timed out. You can resolve conflict by clicking this button
			</p>
			<button
				className="flex-shrink-0 py-2 mx-3 text-sm text-white bg-teal-500 border-4 border-teal-500 rounded hover:bg-teal-700 hover:border-teal-700 disabled:cursor-not-allowed"
				type="button"
				onClick={handleTimeout}
				disabled={waiting}
			>
				{waiting ? 'Resolving RPS...' : 'Resolve RPS'}
			</button>
		</div>
	)
}
