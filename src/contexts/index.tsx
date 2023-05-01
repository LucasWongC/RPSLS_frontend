import { FC, PropsWithChildren } from 'react'
import CurrentTimeContextProvider from './CurrentTimeContext'

export const ContextProviders: FC<PropsWithChildren> = ({ children }) => {
	return <CurrentTimeContextProvider>{children}</CurrentTimeContextProvider>
}
