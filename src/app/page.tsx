import Generator from "@/components/features/paletteGenerator"

export default function Home() {
  return (
    <main className='w-full flex flex-col justify-center items-center mt-20 gap-20'>
      <Generator />
    </main>
  )
}
