'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select'
import { useState } from 'react'
import ColorPicker from './colorPicker'
import SelectImage from './selectImg'
import ColorPalette from './colorPalette'
import Copy from './copy'

export default function Generator () {
  const [option, setOption] = useState<string>('Hexadecimal')

  return (
    <Card className='mt-16'>
      <CardContent className='flex flex-col gap-12 pt-6'>
        <div className='flex'>
          <div className='space-y-5'>
            <p className='text-nowrap'>Metodo de generación:</p>
            <Select defaultValue='Hexadecimal' onValueChange={e => setOption(e)}>
              <SelectTrigger>
                <SelectValue placeholder='Metodo de generación' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='Hexadecimal'>Hexadecimal</SelectItem>
                  <SelectItem value='Imagen'>Imagen</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='w-full flex justify-center items-center h-56'>
            {option === 'Hexadecimal' ? <ColorPicker /> : <SelectImage />}
          </div>
        </div>
        <ColorPalette />
        <Copy />
      </CardContent>
    </Card>
  )
}
