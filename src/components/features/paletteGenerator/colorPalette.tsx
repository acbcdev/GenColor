import { Card, CardHeader, CardContent } from '@/components/ui/card'

const data = ['#1E1E1E', '#3A3A3A', '#D4D4D4', '#FF9E6D', '#69D2E7']

export default function ColorPalette () {
  return (
    <div className='flex justify-between gap-6'>
      {data.map((item: string) => (
        <Card key={item} className='w-full py-0 pb-3 gap-0'>
          <CardHeader className='p-0 m-0'>
            <div
              className='w-full h-[100px] rounded-t-[.5rem]'
              style={{ backgroundColor: item }}
            />
          </CardHeader>
          <CardContent>
            {item}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}