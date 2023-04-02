import {
    Text,
    View,
    Alert,
    ToastAndroid,
    FlatList,
    Vibration,
    StatusBar,
} from 'react-native'
import { useState } from 'react'
import { Motion } from '@legendapp/motion'
import Prompt from 'react-native-input-prompt'
import Modal from 'react-native-modal'

import VibrateIcon from './assets/icons/vibrate.svg'
import useLocalStorage from './hooks/useLocalStorage'

export default function App() {
    const [current, setCurrent] = useLocalStorage('current', {
        id: null,
        name: '',
        count: 0,
    })
    const [saves, setSaves] = useLocalStorage('saves', [])
    const [showDzikirNamePrompt, setShowDzikirNamePrompt] = useState(false)
    const [showSaved, setShowSaved] = useState(false)
    const [enableVibration, setEnableVibration] = useLocalStorage(
        'enable-vibration ',
        true
    )

    const incrementCount = () => {
        if (enableVibration) {
            Vibration.vibrate(100, true)
        }
        setCurrent((c) => {
            const newCurrent = { ...c, count: c.count + 1 }

            if (current.name) {
                setSaves((s) => {
                    const copy = [...s]
                    const savedIndex = copy.findIndex(
                        (c) => c.id === current.id
                    )
                    copy.splice(savedIndex, 1, newCurrent)
                    return copy
                })
            }

            return newCurrent
        })
    }

    const resetCount = () => {
        if (current.count === 0) {
            ToastAndroid.showWithGravity(
                'There is no dzikir in the counter',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            )
            return
        }
        Alert.alert('Reset', 'Are you sure you want to reset the counter?', [
            {
                text: 'No',
                onPress: () => {},
            },
            {
                text: 'Yes',
                onPress: () => {
                    setCurrent((c) => ({ id: null, name: '', count: 0 }))
                },
            },
        ])
    }

    const onSave = (dzikirName) => {
        const newDzikir = {
            id: Date.now(),
            name: dzikirName,
            count: current.count,
        }
        setSaves((s) => [...s, newDzikir])
        setCurrent(newDzikir)
        setShowDzikirNamePrompt(false)
        ToastAndroid.showWithGravity(
            `${dzikirName} saved`,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        )
    }

    const showSaveDzikirPrompt = () => {
        if (current.count === 0) {
            ToastAndroid.showWithGravity(
                "Your dzikir counter isn't enough for save",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            )
            return
        }
        setShowDzikirNamePrompt(true)
    }

    const onSelectSaved = (item) => {
        setCurrent(item)
        setShowSaved(false)
    }

    const onDeleteSaved = (item) => {
        setSaves((s) => {
            const copy = [...s]
            const deletedIndex = copy.findIndex((c) => c.id === item.id)
            copy.splice(deletedIndex, 1)
            return copy
        })
        if (item.id === current.id) {
            setCurrent((c) => ({ ...c, id: null, name: '' }))
        }
    }

    return (
        <View
            className='bg-gray-900 flex-1 items-center justify-center'
            style={{
                paddingTop: StatusBar.currentHeight,
            }}
        >
            <StatusBar backgroundColor='transparent' translucent />
            {/* top */}
            <View className='flex-col w-full px-5 pt-5'>
                <Motion.Pressable
                    onPress={() => setEnableVibration(!enableVibration)}
                >
                    <Motion.View
                        className='ml-auto flex items-center justify-center'
                        style={{
                            opacity: enableVibration ? 1 : 0.5,
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 300,
                        }}
                    >
                        <VibrateIcon width={30} height={30} />
                    </Motion.View>
                </Motion.Pressable>
            </View>

            {/* counter */}
            <View className='w-full flex-1 items-center justify-center'>
                <Text className='text-white font-bold text-8xl'>
                    {current.count}
                </Text>
                <Text className='text-blue-500 font-medium text-lg'>
                    {current.name}
                </Text>
            </View>

            {/* bottom */}
            <View className='mt-auto items-center p-8 pt-0'>
                <Motion.Pressable onPress={incrementCount}>
                    <Motion.View
                        className='w-28 h-28 bg-blue-500 border rounded-full flex items-center justify-center shadow-2xl shadow-blue-400'
                        whileTap={{ scale: 0.9 }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 300,
                        }}
                    >
                        <Text className='text-white text-4xl font-medium'>
                            +
                        </Text>
                    </Motion.View>
                </Motion.Pressable>
                <View className='mt-10 flex-row space-x-5'>
                    <Motion.Pressable onPress={resetCount}>
                        <Motion.View
                            className='bg-gray-700 py-3 px-6 rounded-2xl'
                            whileTap={{ scale: 0.9 }}
                            transition={{
                                type: 'spring',
                                damping: 20,
                                stiffness: 300,
                            }}
                        >
                            <Text className='text-white text-center font-medium text-lg'>
                                Reset
                            </Text>
                        </Motion.View>
                    </Motion.Pressable>
                    {!current.name && (
                        <Motion.Pressable onPress={showSaveDzikirPrompt}>
                            <Motion.View
                                className='bg-gray-700 py-3 px-6 rounded-2xl'
                                whileTap={{ scale: 0.9 }}
                                transition={{
                                    type: 'spring',
                                    damping: 20,
                                    stiffness: 300,
                                }}
                            >
                                <Text className='text-white text-center font-medium text-lg'>
                                    Save
                                </Text>
                            </Motion.View>
                        </Motion.Pressable>
                    )}
                    <Prompt
                        visible={showDzikirNamePrompt}
                        title='Dzikir name'
                        placeholder='e.g. Sholawat Jibril'
                        submitText='Save'
                        onCancel={() => setShowDzikirNamePrompt(false)}
                        onSubmit={onSave}
                    />
                    <Motion.Pressable onPress={() => setShowSaved(true)}>
                        <Motion.View
                            className='bg-gray-700 py-3 px-6 rounded-2xl'
                            whileTap={{ scale: 0.9 }}
                            transition={{
                                type: 'spring',
                                damping: 20,
                                stiffness: 300,
                            }}
                        >
                            <Text className='text-white text-center font-medium text-lg'>
                                Saved
                            </Text>
                        </Motion.View>
                    </Motion.Pressable>
                    <Modal
                        isVisible={showSaved}
                        onBackdropPress={() => setShowSaved(false)}
                        onSwipeComplete={() => setShowSaved(false)}
                        swipeDirection='down'
                        useNativeDriver={true}
                    >
                        <View className='bg-gray-800 mt-auto p-5 rounded-2xl h-[60%]'>
                            <View className='flex-row items-center justify-between mb-2'>
                                <Text className='text-white font-bold text-xl'>
                                    Saved Dzikir
                                </Text>
                                <Motion.Pressable
                                    onPress={() => setShowSaved(false)}
                                >
                                    <Motion.View
                                        whileTap={{ scale: 0.9 }}
                                        transition={{
                                            type: 'spring',
                                            damping: 20,
                                            stiffness: 300,
                                        }}
                                    >
                                        <Text className='text-lg'>✖️</Text>
                                    </Motion.View>
                                </Motion.Pressable>
                            </View>
                            {saves.length > 0 ? (
                                <FlatList
                                    data={saves}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <Motion.Pressable
                                            className='mt-5'
                                            onPress={() => onSelectSaved(item)}
                                            onLongPress={() =>
                                                onDeleteSaved(item)
                                            }
                                        >
                                            <Motion.View
                                                className='bg-gray-900 p-3 rounded-md flex-row justify-between items-center'
                                                whileTap={{ scale: 0.9 }}
                                                transition={{
                                                    type: 'spring',
                                                    damping: 20,
                                                    stiffness: 300,
                                                }}
                                            >
                                                <Text className='text-white font-medium'>
                                                    {item.name}
                                                </Text>
                                                <View className='bg-blue-500 p-2 rounded-md'>
                                                    <Text className='text-white font-medium'>
                                                        {item.count}
                                                    </Text>
                                                </View>
                                            </Motion.View>
                                        </Motion.Pressable>
                                    )}
                                />
                            ) : (
                                <View className='flex-1 items-center justify-center'>
                                    <Text className='text-white'>
                                        You have no dzikir saved yet
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    )
}
