'use client'
import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'

export default function ColorPicker () {
  const [input, setInput] = useState<string>('#69D2E7')
  const colorPickerRef = useRef<HTMLInputElement>(null)

  const onChangeInput = ({ target: { value } }: { target: { value: string } }) => {
    if (value.length > 7) return

    setInput(
      `#${value
        .toUpperCase()
        .replace(/^#*/, '')
      }`
    )
  }

  const onChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.toUpperCase())
  }

  const openColorPicker = () => {
    colorPickerRef.current?.click()
  }

  return (
    <div className='flex flex-col gap-6'>
      <p className='text-xl'>Color Base</p>
      <div className='flex items-center gap-6'>
        <div className='relative'>
          <div
            className='absolue z-20 w-[50px] h-[50px] rounded-[.5rem] cursor-pointer hover:opacity-85 transition-colors border-2'
            style={{ backgroundColor: input }}
            onClick={openColorPicker}
          />

          <input
            ref={colorPickerRef}
            type='color'
            value={input}
            onChange={onChangeColor}
            className='absolute bottom-0 left-0 opacity-0 w-[0px] h-[0px]'
          />
        </div>

        <Input
          className='w-36'
          maxLength={7}
          onChange={onChangeInput}
          value={input}
        />
      </div>
    </div>
  )
}
