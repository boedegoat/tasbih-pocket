import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useLocalStorage = (key, initialValue) => {
    const [state, setState] = useState(initialValue)

    useEffect(() => {
        AsyncStorage.getItem(key).then((value) => {
            if (!value) return
            setState(JSON.parse(value))
        })
    }, [])

    useEffect(() => {
        AsyncStorage.setItem(key, JSON.stringify(state))
    }, [state])

    return [state, setState]
}

export default useLocalStorage
