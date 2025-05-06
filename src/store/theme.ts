import { ColorPalette } from '@/types/maker'
import { create } from 'zustand'

export interface ThemeState {
  theme?: ColorPalette
  setTheme: (theme: ColorPalette) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: undefined,
  setTheme: (theme) => set(() => ({ theme }))
}))
