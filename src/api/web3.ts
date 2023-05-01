import rpsArtifact from '@/artifacts/RPS.json'
import { ContractFactory, Signer } from 'ethers'
import { parseEther, solidityKeccak256 } from 'ethers/lib/utils.js'

export const calculateHashFromSalt = (salt: number, move: number) => {
	return solidityKeccak256(['uint8', 'uint256'], [move, salt])
}

export const deployRPS = async (
	hash: string,
	player: string,
	stakeAmount: number,
	signer: Signer
) => {
	const factory = new ContractFactory(rpsArtifact.abi, rpsArtifact.data.bytecode.object, signer)

	const contract = await factory.deploy(hash, player, { value: parseEther(stakeAmount.toString()) })

	await contract.deployTransaction.wait()

	return contract.address
}
