'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useThemeStore } from '@/store/theme'
import type { ThemeColors } from '@/types/maker'

export default function Copy() {
  const theme = useThemeStore((state) => state.theme)

  // Modificamos la función para aceptar el modo y añadir variables faltantes
  const generateCssVariables = (colors: ThemeColors | undefined): string => {
    if (!colors) return ''

    const variableMap: { [K in keyof ThemeColors]: string } = {
      background: '--background',
      foreground: '--foreground',
      primary: '--primary',
      secondary: '--secondary',
      muted: '--muted',
      accent: '--accent',
      card: '--card',
      border: '--border'
    }

    let cssString = ''
    // Añadir variables mapeadas directamente desde ThemeColors
    for (const key in variableMap) {
      if (Object.prototype.hasOwnProperty.call(colors, key)) {
        const themeKey = key as keyof ThemeColors
        const cssVarName = variableMap[themeKey]
        const cssValue = colors[themeKey]
        // Indentación con 2 espacios
        cssString += `  ${cssVarName}: ${cssValue};\n`
      }
    }

    return cssString
  }

  const lightModeCss = generateCssVariables(theme?.light)
  const darkModeCss = generateCssVariables(theme?.dark)

  const fullCssCode = `:root {\n  --radius: 0.5rem;\n${lightModeCss}}\n\n.dark {\n${darkModeCss}}`

  const copyStyles = () => async () => {
    await navigator.clipboard.writeText(fullCssCode).then(() => {
      toast.message('Estilos copiados')
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='cursor-pointer'>
          Copiar estilos
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Theme</DialogTitle>
          <DialogDescription>
            Copie y pegue el siguiente código en su archivo CSS global (por
            ejemplo, `globals.css`).
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4 grid gap-4'>
          <div className='flex justify-end'>
            <Button onClick={copyStyles()} className='cursor-pointer'>
              Copiar
            </Button>
          </div>
          <pre className='rounded-md bg-muted p-4 max-h-[60vh] overflow-y-auto'>
            <code className='block whitespace-pre text-sm font-mono overflow-x-auto'>
              {fullCssCode}
            </code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}
