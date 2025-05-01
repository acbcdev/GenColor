import Image from "next/image"
export default function header() {
  return (
    <header className='w-full fixed top-0 left-0 flex px-10 py-2 justify-start items-center  backdrop-blur-sm'>
      <Image src='/logo.svg' width={50} height={50} alt='logo' />
    </header>
  )
}
