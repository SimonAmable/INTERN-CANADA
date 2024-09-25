import React from 'react'
import Image from 'next/image'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
const Footer = () => {
  return (
    <footer id="contact"className='contact flex lg:flex-row flex-col min-h-32 bg-primary justify-between  p-4 mt-auto'>
        <div className='flex flex-col gap-1'>
            <p  className='font-bold text-lg'>Contact:</p>
            {/* <a href="https://github.com/SimonAmable" target="_blank" className='flex flex-row items-center hover:underline'>
                <Image src="github-icon.svg" cn='' width={30} height={30} alt="Github"/>
                <p className=''>Github</p>
            </a> */}
            <a href="https://www.linkedin.com/in/simon-amable-59ab091ab/"  target="_blank" className='flex flex-row gap-1 items-center hover:underline'>
                <Image src="linkedin.svg" className='' width={30} height={30} alt="LinkedIn"/>
                <p className=''>LinkedIn (Pretty fast response time) </p>
            </a>
            <a href="mailto:simonamable@gmail.com"  target="_blank" className='flex flex-row gap-1 items-center hover:underline'>
                <Image src="/mail_png.png" className='' width={30} height={30} alt="Email"/>
                <p className=''>Email (Fastest response time)</p>
            </a>
            <a href="https://SimonAmable.com"  title='Open my Portfolio (Might as well look at more of my projects while you still here!)' target="_blank" className='flex flex-row gap-1 items-center hover:underline'>
                <Image unoptimized src="/construction_man_png_black.gif" className='' width={30} height={30} alt="Personal Portfolio Site"/>
                <p className=''>My Portfolio Site (Choose this one!) </p>
            </a>
        </div>
        <div className='flex items-end font-semibold italic hover:cursor-pointer hover:underline mt-1'>
            <a target="_blank" href="https://SimonAmable.com"><p>© Simon Amable 2024. All information is free.</p></a>
        </div> 
        
        
    </footer>
  )
}

export default Footer