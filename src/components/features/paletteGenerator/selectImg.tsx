import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function SelectImage () {
  return (
    <div className='aspect-video h-full border-2 border-dashed rounded-[.5rem] hover:bg-accent cursor-pointer transition-colors flex flex-col gap-4 items-center justify-center p-4'>
      <Image
        src='/img.svg'
        width={80}
        height={80}
        alt='img'
        className='opacity-60'
      />
      <p className='font-sem'>Arrastra una imagen o haz clic para seleccionar</p>
      <Button className='cursor-pointer'>
        <Image src='/upload.svg' width={20} height={20} alt='upload' />
        Cargar imagen
      </Button>
    </div>
  )
}
