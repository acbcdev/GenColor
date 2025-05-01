"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from "@/components/ui/select"
import { useState } from "react"
import ColorPicker from "@/components/features/paletteGenerator/colorPicker"
import SelectImage from "@/components/features/paletteGenerator/selectImg"
import { useThemeStore } from "@/store/theme"
import { formatHex } from "culori"

export default function Generator() {
  const [option, setOption] = useState<string>("Hexadecimal")
  const theme = useThemeStore((state) => state.theme)
  return (
    <Card className='mt-16'>
      <CardContent className='flex flex-col gap-12 pt-6'>
        <div className='flex'>
          <div className='space-y-5'>
            <p className='text-nowrap'>Metodo de generación:</p>
            <Select
              defaultValue='Hexadecimal'
              onValueChange={(e) => setOption(e)}
            >
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
            {option === "Hexadecimal" ? <ColorPicker /> : <SelectImage />}
          </div>
        </div>
      </CardContent>
      <CardFooter className='space-x-10'>
        <section>
          <h2 className='text-lg font-bold'>Dark Mode</h2>
          <div>
            {Object.entries(theme?.dark ?? {}).map(([key, value]) => {
              return (
                <div key={key} className=''>
                  <div
                    className=' rounded-lg cursor-pointer hover:opacity-85 transition-colors border-2'
                    style={{ backgroundColor: value }}
                  >
                    {formatHex(value)}
                  </div>
                  <p>{key}</p>
                </div>
              )
            })}
          </div>
        </section>
        <section>
          <h2 className='text-lg font-bold'>Ligth Mode</h2>
          <div>
            {Object.entries(theme?.light ?? {}).map(([key, value]) => (
              <div key={key}>
                <div
                  className=' rounded-lg cursor-pointer hover:opacity-85 transition-colors border-2'
                  style={{ backgroundColor: value }}
                >
                  {formatHex(value)}
                </div>
                <p>{key}</p>
              </div>
            ))}
          </div>
        </section>
      </CardFooter>
    </Card>
  )
}
