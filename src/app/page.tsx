import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Generator from '@/components/features/generator'
import SelectImage from '@/components/features/selectImg'

export default function Home () {
  return (
    <main className='w-full flex flex-col justify-center items-center mt-20 gap-20'>
      <h1 className='text-6xl font-bold'>GenColor</h1>
      <Tabs defaultValue='generate'>
        <TabsList className='grid w-4xl grid-cols-2'>
          <TabsTrigger value='generate'>Generador</TabsTrigger>
          <TabsTrigger value='extract-from-img'>Extraer de imagen</TabsTrigger>
        </TabsList>
        <div className='mt-8'>
          <TabsContent value='generate'>
            <Generator />
          </TabsContent>
          <TabsContent value='extract-from-img'>
            <SelectImage />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  )
}
