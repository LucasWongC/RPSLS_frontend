import { useContext } from 'react'
import { CurrentTimeContext } from '@/contexts/CurrentTimeContext'

export const useCurrentTime = () => {
	return useContext(CurrentTimeContext)
}
