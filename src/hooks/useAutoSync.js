import { useEffect } from 'react'
import useValetStore from '../store/useValetStore'
import useOrderStore from '../store/useOrderStore'

export default function useAutoSync(intervalMs = 3000) {
  useEffect(() => {
    // Function to rehydrate stores from localStorage for cross-tab sync
    const syncStores = () => {
      try {
        if (useValetStore.persist?.rehydrate) {
          useValetStore.persist.rehydrate()
        }
        if (useOrderStore.persist?.rehydrate) {
          useOrderStore.persist.rehydrate()
        }
      } catch (err) {
        // Fallback rehydrate fail safety
      }
    }

    // 1. Listen for window storage changes (instant cross-tab update when watchman or customer acts in another window/tab)
    const handleStorageChange = (e) => {
      if (e.key === 'takeaway-valet-storage' || e.key === 'takeaway-orders-storage') {
        syncStores()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // 2. Continuous 3-5 second polling loop so every view stays 100% synchronized automatically
    const intervalId = setInterval(() => {
      syncStores()
    }, intervalMs)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(intervalId)
    }
  }, [intervalMs])
}
