import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function SelectImage () {
  return (
    <Card>
      <CardContent className='flex items-center justify-center py-12'>
        <div className='w-[450px] h-[260px] border-2 rounded-[.5rem] hover:bg-accent cursor-pointer transition-colors border-dashed flex flex-col gap-4 items-center justify-center'>
          <Image
            src='/img.svg'
            width={80}
            height={80}
            alt='img'
            className='opacity-60'
          />
          <p className='font-sem'>Arrastra una imagen o haz clic para seleccionar</p>
          <Button className='cursor-pointer'>
            <Image src='/upload.svg' width={20} height={20} alt='upload' className='invert' />
            Cargar imagen
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
