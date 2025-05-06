// Tipos para claridad
export type ColorFormat = 'oklch' | 'hex' | 'rgb'
export type HarmonyType =
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic'
  | 'monochromatic'
  | 'shades'
  | 'neutral'
  | 'accent'

export interface HarmonyOptions {
  type?: HarmonyType
  format?: ColorFormat
  count?: number
}

// Interfaz de paleta sin cambios
export interface ColorPalette {
  light: ThemeColors
  dark: ThemeColors
  harmonies: string[]
  accessibility: AccessibilityInfo
}

export interface ThemeColors {
  background: string
  foreground: string
  primary: string
  secondary: string
  muted: string
  accent: string
  card: string
  border: string
}

export interface AccessibilityInfo {
  lightMode: {
    textContrast: number
    primaryContrast: number
    secondaryContrast: number
  }
  darkMode: {
    textContrast: number
    primaryContrast: number
    secondaryContrast: number
  }
}

// Opciones para la generación de paleta
export interface PaletteOptions {
  /** Formato de color de salida */
  format?: ColorFormat
  /** Ratio de contraste mínimo (basado en diferencia de OKLCH Lightness) */
  minContrastRatio?: number
  /** Tipo de armonía a generar */
  harmonyType?: HarmonyType
  /** Ajustes finos para modo claro */
  lightAdjustments?: Partial<ColorAdjustments>
  /** Ajustes finos para modo oscuro */
  darkAdjustments?: Partial<ColorAdjustments>
}

// Ajustes detallados para los colores generados (valores por defecto similares a los originales)
export interface ColorAdjustments {
  bgL: number // Lightness para background
  fgL: number // Lightness para foreground
  primaryLScale?: number // Escala de Lightness para primary (1 = sin cambio)
  secondaryHueShift: number // Desplazamiento de Hue para secondary
  accentHueShift: number // Desplazamiento de Hue para accent
  chromaScale: number // Escala general de Chroma (0.05 = muy desaturado, 1 = original)
  mutedChromaScale: number // Escala de Chroma específica para muted
  cardLScale?: number // Factor para calcular L de card desde L de background
  borderLScale?: number // Factor para calcular L de border desde L de background
}
