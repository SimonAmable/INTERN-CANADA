import React from 'react'
import Image from "next/image"
import Link from "next/link"

const Header = () => {
  return (
    <div className='bg-primary w-full flex flex-row justify-between p-2 text-center text-black'>

      <a href="/" className='flex flex-col items-center gap-0 lg:gap-3 hover:opacity-70 transition-transform font-mono'>
        <div className='flex flex-row items-center gap-0 lg:gap-3  transition-transform'>
          <Image src='/hidden_leaf_black.png' alt='Logo' width={40} height={40} className=''/>
          <h1 className='capitalize font-bold text-2xl hidden lg:block ' >INTERN CANADA</h1>
        </div>     
        <p className='-translate-y-6 text-lg hidden lg:block'>Co-op Made Easy</p> 
      </a>

      <div className='flex flex-row gap-0 lg:gap-2'>
        {/* <Link href = "/" className='flex  items-center'><p className='text-center hover:font-bold justify-center align-middle items-center p-2 text-xl'> Find Jobs</p></Link> */}
        <Link href = "/about" className='flex items-center'><p className='text-center hover:font-semibold justify-center align-middle items-center p-2 text-xl '> About</p></Link>
        <Link href = "#contact" className='flex items-center'><p className='text-center hover:font-semibold justify-center align-middle items-center p-2 text-xl '> Contact </p></Link>

      </div>

      <div className='flex-row flex gap-2 items-center min-w-20'>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdtBLHJW0hnYMF7jBwgtiF0pyhfztkKVmlqaBQ1Dq-Ds-Bdvg/viewform?usp=sf_link" target="_blank" className='py-2 px-2  text-white border rounded hover:opacity-70'>
          Add Job
        </a>
        <a href="https://github.com/SimonAmable/The-Open-Source-Canadian-Coop-Page" target="_blank" className='flex flex-row  align-middle items-center py-2 px-2 gap-1 text-white border hover:opacity-70 rounded'>
          {/* <p className='hidden lg:block'>Contribute!</p> */}
          <Image src='/github-icon.svg'  className="" title='Open in "GitHub"' alt='Description of the image' width={25} height={25}/>
        </a>
      </div>
      

    </div>
  )
}

export default Header