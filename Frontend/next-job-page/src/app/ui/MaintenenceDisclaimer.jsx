import React from 'react'

const MaintenenceDisclaimer = () => {
return (
    <div className='bg-orange-600 text-white text-center p-3 font-bold border-white'>
        <div className='mb-2'>⚠️ This website is being sunset and will be replaced with our new website!</div>
        <div className='text-sm'>
            Please visit our new platform at:{' '}
            <a 
                href="https://ezapply-ai.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className='underline hover:text-yellow-200 transition-colors'
            >
                https://ezapply-ai.vercel.app/
            </a>
        </div>
    </div>
)
}

export default MaintenenceDisclaimer