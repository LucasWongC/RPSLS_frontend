import rpsArtifact from '@/artifacts/RPS.json'
import { useCallback, useMemo } from 'react'
import { BigNumber } from 'ethers'
import { useAccount, useContract, useContractReads, useSigner } from 'wagmi'
import { toast } from 'react-hot-toast'
import { useCurrentTime } from './useCurrentTime'

export const useRps = (rpsAddress: `0x${string}`) => {
	const { address } = useAccount()
	const { data: signer } = useSigner()
	const currentTime = useCurrentTime()

	const rpsConfig = {
		address: rpsAddress,
		abi: rpsArtifact.abi,
	}

	const contract = useContract({ ...rpsConfig, signerOrProvider: signer })

	const { data, refetch } = useContractReads({
		contracts: [
			{
				...rpsConfig,
				functionName: 'j1',
			},
			{
				...rpsConfig,
				functionName: 'j2',
			},
			{
				...rpsConfig,
				functionName: 'c1Hash',
			},
			{
				...rpsConfig,
				functionName: 'c2',
			},
			{
				...rpsConfig,
				functionName: 'stake',
			},
			{
				...rpsConfig,
				functionName: 'TIMEOUT',
			},
			{
				...rpsConfig,
				functionName: 'lastAction',
			},
		],
		suspense: true,
		select: (rawData) => {
			const isMultiCallFailed = rawData.indexOf(null) > -1
			if (!isMultiCallFailed) {
				return {
					creator: rawData[0] as `0x${string}`,
					joiner: rawData[1] as `0x${string}`,
					c1Hash: rawData[2] as `0x${string}`,
					joinerMove: rawData[3] as number,
					stakeAmount: BigNumber.from(rawData[4]),
					endTime: BigNumber.from(rawData[6]).toNumber() + BigNumber.from(rawData[5]).toNumber(),
				}
			}

			return { failed: true }
		},
		onError: (err) => {
			console.log(err)
		},
		allowFailure: true,
	})

	const isCreator = useMemo(
		() => data?.creator?.toLowerCase() == address?.toLowerCase(),
		[data, address]
	)

	const isJoiner = useMemo(
		() => data?.joiner?.toLowerCase() == address?.toLowerCase(),
		[data, address]
	)

	const expired = useMemo(() => (data?.endTime ?? 0) < currentTime, [currentTime, data?.endTime])

	const play = useCallback(
		(move: number) => {
			if (!contract) {
				throw Error('Please connect wallet to play')
			}
			if (!data) {
				toast.error('Please wait until fetch')
				return
			}
			if (!isJoiner) {
				throw Error(`You can't play this rps`)
			}

			return contract.play(move, {
				value: data.stakeAmount,
			})
		},
		[contract, data, isJoiner]
	)

	const solve = useCallback(
		(move: number, salt: number) => {
			if (!contract) {
				throw Error('Please connect wallet to play')
			}
			if (!data) {
				toast.error('Please wait until fetch')
				return
			}
			if (!isCreator) {
				throw Error(`You can't solve this rps`)
			}

			return contract.solve(move, salt)
		},
		[contract, data, isCreator]
	)

	const timeout = useCallback(() => {
		if (!contract) {
			throw Error('Please connect wallet to play')
		}
		if (!data) {
			toast.error('Please wait until fetch')
			return
		}
		if (!isCreator && !isJoiner) {
			throw Error(`You can't finish this rps`)
		}
		if (!expired) {
			throw Error('Not finished yet')
		}

		return (data?.joinerMove ? contract.j1Timeout : contract.j2Timeout)()
	}, [contract, data, isCreator, isJoiner, expired])

	return {
		data,
		isCreator,
		isJoiner,
		expired,
		refetch,
		play,
		solve,
		timeout,
	}
}
