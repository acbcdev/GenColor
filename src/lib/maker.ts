import type {
  ColorAdjustments,
  ColorFormat,
  ColorPalette,
  HarmonyOptions,
  PaletteOptions,
  ThemeColors
} from "@/types/maker"
import { formatHex, formatRgb, converter, wcagLuminance } from "culori"

const toOklch = converter("oklch") // Crear un conversor reutilizable

/**
 * Formatea un color Culori al formato deseado.
 * @param color - Objeto color de Culori (e.g., resultado de oklch())
 * @param format - Formato deseado ('oklch', 'hex', 'rgb')
 * @returns Color como string en el formato solicitado.
 */
function formatColor(
  color: ReturnType<typeof toOklch>,
  format: ColorFormat = "oklch"
): string {
  if (!color) return "" // Manejo básico si el color es inválido/undefined
  switch (format) {
    case "hex":
      return formatHex(color)
    case "rgb":
      return formatRgb(color)
    case "oklch":
    default:
      // Asegurar valores definidos para h (importante para oklch string)
      const l = color.l ?? 0
      const c = color.c ?? 0
      const h = color.h ?? 0
      return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})` // Redondear para limpieza
  }
}

/**
 * Asegura una diferencia mínima de luminosidad OKLCH entre dos colores.
 * Modifica la luminosidad del color2 si es necesario.
 * @param color1Str - Primer color (e.g., fondo)
 * @param color2Str - Segundo color (e.g., texto), este será modificado si es necesario
 * @param minLightnessDiff - Diferencia mínima de luminosidad requerida (0-1)
 * @param outputFormat - Formato para el color devuelto
 * @returns El color2 (potencialmente modificado) en el formato especificado.
 */
export function ensureContrast(
  color1Str: string,
  color2Str: string,
  minLightnessDiff = 0.4, // Aumentado ligeramente el default
  outputFormat: ColorFormat = "oklch"
): string {
  const c1 = toOklch(color1Str)
  let c2 = toOklch(color2Str)

  if (!c1 || !c2) {
    console.warn("EnsureContrast: Invalid color format provided.", {
      color1Str,
      color2Str
    })
    // Devolver el color original o un valor seguro
    return (
      formatColor(c2, outputFormat) ||
      (outputFormat === "hex" ? "#000000" : "oklch(0 0 0)")
    )
  }

  const lightnessDiff = Math.abs(c1.l - c2.l)

  if (lightnessDiff < minLightnessDiff) {
    // Calcula la nueva luminosidad L para c2
    // Si c1 es claro (>0.5), haz c2 más oscuro. Si c1 es oscuro (<=0.5), haz c2 más claro.
    const targetL =
      c1.l > 0.5 ? c1.l - minLightnessDiff : c1.l + minLightnessDiff

    // Ajusta L de c2, pero manteniéndolo dentro de límites razonables [0.05, 0.95]
    const newL = Math.max(0.05, Math.min(0.95, targetL))

    // Crear el nuevo color modificado
    c2 = { ...c2, l: newL }
  }

  return formatColor(c2, outputFormat)
}

/**
 * Calcula el ratio de contraste entre dos colores.
 * @param color1 - Primer color como string.
 * @param color2 - Segundo color como string.
 * @returns El ratio de contraste entre los dos colores.
 */
function calculateContrastRatio(color1: string, color2: string): number {
  const l1 = wcagLuminance(color1)
  const l2 = wcagLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Optimiza un color para alcanzar un ratio de contraste objetivo.
 * @param bgColor - Color de fondo como string.
 * @param fgColor - Color de primer plano como string.
 * @param targetRatio - Ratio de contraste objetivo.
 * @returns El color de primer plano optimizado.
 */
function optimizeForContrast(
  bgColor: string,
  fgColor: string,
  targetRatio = 4.5
): string {
  const bg = toOklch(bgColor)
  const fg = toOklch(fgColor)

  if (!bg || !fg) throw new Error("Invalid color format")

  let contrast = calculateContrastRatio(bgColor, fgColor)
  let attempts = 0
  const maxAttempts = 10

  while (contrast < targetRatio && attempts < maxAttempts) {
    // Ajustar la luminosidad para mejorar el contraste
    if (fg.l > bg.l) {
      fg.l = Math.min(0.95, fg.l + 0.05)
    } else {
      fg.l = Math.max(0.05, fg.l - 0.05)
    }

    const newFgColor = formatColor(fg, "oklch")
    contrast = calculateContrastRatio(bgColor, newFgColor)
    attempts++
  }

  return formatColor(fg, "oklch")
}

// Valores por defecto para los ajustes de generación
const defaultLightAdjustments: ColorAdjustments = {
  bgL: 0.98,
  fgL: 0.1,
  primaryLScale: 1,
  secondaryHueShift: 30,
  accentHueShift: 60,
  chromaScale: 0.08,
  mutedChromaScale: 0.04,
  cardLScale: 0.98, // Ligeramente diferente al fondo, o igual
  borderLScale: 0.9
}

const defaultDarkAdjustments: ColorAdjustments = {
  bgL: 0.15,
  fgL: 0.95,
  primaryLScale: 1.1, // Hacer el primario un poco más brillante en dark mode
  secondaryHueShift: 30,
  accentHueShift: 60,
  chromaScale: 0.1,
  mutedChromaScale: 0.06,
  cardLScale: 1.1, // Factor sobre bgL para card (e.g., 0.15 * 1.1)
  borderLScale: 1.3 // Factor sobre bgL para border (e.g., 0.15 * 1.3)
}

/**
 * Genera una paleta de colores para modos claro y oscuro basada en un color base.
 * @param baseColorStr - El color base como string (cualquier formato CSS válido).
 * @param options - Opciones para personalizar la generación.
 * @returns Un objeto ColorPalette con los colores generados.
 */
export function generatePalette(
  baseColorStr: string,
  options: PaletteOptions = {}
): ColorPalette {
  const base = toOklch(baseColorStr)
  if (!base) throw new Error(`Invalid base color format: ${baseColorStr}`)

  const {
    format = "oklch",
    minContrastRatio = 4.5,
    harmonyType = "analogous",
    lightAdjustments: lightOpts = {},
    darkAdjustments: darkOpts = {}
  } = options

  // Generar paletas básicas
  const light = generateThemeColors(
    base,
    true,
    { ...defaultLightAdjustments, ...lightOpts },
    format
  )
  const dark = generateThemeColors(
    base,
    false,
    { ...defaultDarkAdjustments, ...darkOpts },
    format
  )

  // Optimizar contraste
  light.foreground = optimizeForContrast(
    light.background,
    light.foreground,
    minContrastRatio
  )
  light.primary = optimizeForContrast(
    light.background,
    light.primary,
    minContrastRatio
  )
  dark.foreground = optimizeForContrast(
    dark.background,
    dark.foreground,
    minContrastRatio
  )
  dark.primary = optimizeForContrast(
    dark.background,
    dark.primary,
    minContrastRatio
  )

  // Generar armonías
  const harmonies = generateHarmonies(baseColorStr, {
    type: harmonyType,
    format
  })

  // Calcular información de accesibilidad
  const accessibility = {
    lightMode: {
      textContrast: calculateContrastRatio(light.background, light.foreground),
      primaryContrast: calculateContrastRatio(light.background, light.primary),
      secondaryContrast: calculateContrastRatio(
        light.background,
        light.secondary
      )
    },
    darkMode: {
      textContrast: calculateContrastRatio(dark.background, dark.foreground),
      primaryContrast: calculateContrastRatio(dark.background, dark.primary),
      secondaryContrast: calculateContrastRatio(dark.background, dark.secondary)
    }
  }

  return { light, dark, harmonies, accessibility }
}

/**
 * Genera los colores de un tema basado en un color base y ajustes.
 * @param base - Color base en formato OKLCH.
 * @param isLight - Indica si es para modo claro.
 * @param adjustments - Ajustes de color.
 * @param format - Formato de salida.
 * @returns Un objeto ThemeColors con los colores generados.
 */
function generateThemeColors(
  base: ReturnType<typeof toOklch>,
  isLight: boolean,
  adjustments: ColorAdjustments,
  format: ColorFormat
): ThemeColors {
  if (!base) throw new Error("Invalid base color")

  const h = base.h || 0
  // const factor = isLight ? 1 : -1

  const colors = {
    background: {
      l: isLight ? adjustments.bgL : adjustments.bgL,
      c: base.c * adjustments.chromaScale * (isLight ? 0.5 : 0.7),
      h
    },
    foreground: {
      l: isLight ? adjustments.fgL : adjustments.fgL,
      c: base.c * adjustments.chromaScale,
      h
    },
    primary: {
      l: base.l * (adjustments.primaryLScale ?? 1),
      c: base.c,
      h
    },
    secondary: {
      l: isLight ? 0.8 : 0.3,
      c: base.c * 0.5,
      h: (h + adjustments.secondaryHueShift) % 360
    },
    muted: {
      l: isLight ? 0.85 : 0.25,
      c: base.c * adjustments.mutedChromaScale,
      h
    },
    accent: {
      l: isLight ? Math.max(0.5, base.l * 0.9) : Math.min(0.8, base.l * 1.1),
      c: base.c * (isLight ? 0.8 : 1.2),
      h: (h + adjustments.accentHueShift) % 360
    },
    card: {
      l: isLight ? 0.95 : 0.2,
      c: base.c * adjustments.chromaScale * (isLight ? 0.3 : 0.5),
      h
    },
    border: {
      l: isLight ? 0.8 : 0.3,
      c: base.c * adjustments.chromaScale * (isLight ? 1.2 : 1.5),
      h
    }
  }

  return Object.entries(colors).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: formatColor({ ...value, mode: "oklch" }, format)
    }),
    {}
  ) as ThemeColors
}

/**
 * Genera colores armoniosos basados en un color base.
 * @param baseColorStr - El color base como string.
 * @param options - Opciones para personalizar la generación (tipo de armonía, formato).
 * @returns Un array de colores armoniosos como strings.
 */
export function generateHarmonies(
  baseColorStr: string,
  options: HarmonyOptions = {}
): string[] {
  const base = toOklch(baseColorStr)
  if (!base) throw new Error(`Invalid base color format: ${baseColorStr}`)

  const { format = "oklch", type = "analogous", count = 5 } = options
  const { l, h = 0 } = base // Usar h=0 si es undefined

  const harmonies: ReturnType<typeof toOklch>[] = [base]

  switch (type) {
    case "complementary":
      harmonies.push({ ...base, h: (h + 180) % 360 })
      break
    case "split-complementary":
      harmonies.push({ ...base, h: (h + 150) % 360 })
      harmonies.push({ ...base, h: (h + 210) % 360 })
      break
    case "analogous":
      harmonies.push({ ...base, h: (h + 30) % 360 })
      harmonies.push({ ...base, h: (h - 30 + 360) % 360 }) // Asegurar positivo
      break
    case "triadic":
      harmonies.push({ ...base, h: (h + 120) % 360 })
      harmonies.push({ ...base, h: (h + 240) % 360 })
      break
    case "tetradic": // Rectangular
      harmonies.push({ ...base, h: (h + 60) % 360 })
      harmonies.push({ ...base, h: (h + 180) % 360 })
      harmonies.push({ ...base, h: (h + 240) % 360 })
      break
    case "monochromatic":
      // Genera variaciones de luminosidad manteniendo C y H
      const step = (1 - l) / count // Hacia blanco
      const stepDark = l / count // Hacia negro
      for (let i = 1; i < Math.ceil(count / 2); i++) {
        harmonies.push({ ...base, l: Math.min(0.95, l + i * step) }) // Más claros
      }
      for (let i = 1; i < Math.floor(count / 2); i++) {
        harmonies.push({ ...base, l: Math.max(0.05, l - i * stepDark) }) // Más oscuros
      }
      // Reordenar por luminosidad
      harmonies.sort((a, b) => (a?.l ?? 0) - (b?.l ?? 0))
      break
    default: // Incluye el caso original si no se especifica un tipo válido
      harmonies.push({ ...base, h: (h + 30) % 360 })
      harmonies.push({ ...base, h: (h + 60) % 360 })
      harmonies.push({ ...base, h: (h + 180) % 360 })
      harmonies.push({ ...base, h: (h + 210) % 360 })
  }

  // Limitar al número base + 4 (o count para monocromatic) y formatear
  const finalCount = type === "monochromatic" ? count : 5
  return harmonies
    .slice(0, finalCount)
    .map((color) => formatColor(color, format))
}
