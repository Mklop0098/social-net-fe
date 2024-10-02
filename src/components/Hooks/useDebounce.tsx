
import { useEffect } from 'react'

export const useDebounce = (value: string, delay: number) => {

    const functionA = () => {
        console.log('a')
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            functionA()
        }, delay)
        return () => clearTimeout(handler)
    }, [value, delay])

    return functionA
}