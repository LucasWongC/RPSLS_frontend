import { createContext, PropsWithChildren, useEffect, useState } from 'react'

export const CurrentTimeContext = createContext<number>(0)

const CurrentTimeContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [currentTime, setCurrentTime] = useState<number>(0)

	// Set up the timeout.
	useEffect(() => {
		const id = setInterval(() => {
			setCurrentTime(Math.floor(Date.now() / 1000))
		}, 1000)

		return () => clearInterval(id)
	}, [])

	return <CurrentTimeContext.Provider value={currentTime}>{children}</CurrentTimeContext.Provider>
}

export default CurrentTimeContextProvider
