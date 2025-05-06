'use client'
import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { generatePalette } from '@/lib/maker'
import { useThemeStore } from '@/store/theme'
import { useDebounce } from '@uidotdev/usehooks'

export default function ColorPicker() {
  const [input, setInput] = useState<string>('#69D2E7')
  const colorPickerRef = useRef<HTMLInputElement>(null)
  const setTheme = useThemeStore((state) => state.setTheme)
  const debounceInput = useDebounce(input, 200)
  const onChangeInput = ({
    target: { value }
  }: {
    target: { value: string }
  }) => {
    if (value.length > 7) return

    setInput(`#${value.toUpperCase().replace(/^#*/, '')}`)
  }

  useEffect(() => {
    const palette = generatePalette(input)
    setTheme(palette)
  }, [debounceInput])

  const onChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.toUpperCase())
  }

  const openColorPicker = () => {
    colorPickerRef.current?.click()
  }

  return (
    <div className='flex flex-col gap-6'>
      <p className='text-xl'>Color Base</p>
      <div className='flex  items-center gap-6'>
        <div className='relative'>
          <div
            className='absolue z-20 w-14 h-14 rounded-lg cursor-pointer hover:opacity-85 transition-colors border-2'
            style={{ backgroundColor: input }}
            onClick={openColorPicker}
          />

          <input
            ref={colorPickerRef}
            type='color'
            value={input}
            onChange={onChangeColor}
            className='absolute inset-0 opacity-0 w-0 h-0 '
          />
        </div>

        <Input maxLength={7} onChange={onChangeInput} value={input} />
      </div>
    </div>
  )
}
