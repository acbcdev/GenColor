import { Card, CardContent } from '@/components/ui/card'
import ColorPicker from './colorPicker'
import ColorPalette from './colorPalette'
import Copy from './copy'

export default function Generator () {
  return (
    <Card>
      <CardContent className='flex flex-col gap-12'>
        <ColorPicker />
        <ColorPalette />
        <Copy />
      </CardContent>
    </Card>
  )
}
