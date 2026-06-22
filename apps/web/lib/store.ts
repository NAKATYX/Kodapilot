import { create } from 'zustand'
import type { Order } from './api'

interface AppStore {
  // User state
  userAddress: string | null
  userName: string
  userBalance: number
  setUser: (address: string, name: string, balance: number) => void

  // Current order being created/viewed
  currentOrder: Order | null
  setCurrentOrder: (order: Order | null) => void

  // Demo flow state
  step: 'signin' | 'sell' | 'list' | 'share' | 'checkout' | 'track' | 'wallet'
  setStep: (step: AppStore['step']) => void
}

export const useStore = create<AppStore>((set) => ({
  userAddress: null,
  userName: 'Chiamaka U.',
  userBalance: 48200,
  setUser: (address, name, balance) =>
    set({ userAddress: address, userName: name, userBalance: balance }),

  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),

  step: 'sell',
  setStep: (step) => set({ step }),
}))
