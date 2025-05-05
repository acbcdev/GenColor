import Generator from "@/components/features/paletteGenerator"

export default function Home() {
  return (
    <main className='w-full h-screen flex flex-col justify-center items-center gap-20'>
      <Generator />
    </main>
  )
}
