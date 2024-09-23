"use client"
import React,{useState} from 'react'

import AllJobsDisplay from './AllJobsDisplay';

const HomeTop = ({handleSearch}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // const handleSearch = (event) => {
  //     event.preventDefault(); // Prevent the default form submission

  //     // Update state to trigger re-render with the new search term
  //     setSearchTerm(searchTerm);



  // };


  return (
    <div className='w-full'>
      <div className=' flex items-center justify-center min-h-[320px] w-full bg-red-500 p-5'>
          <div >
              <h1 className='text-4xl font-bold'>Find Your Next Canadian Internship Today</h1>
              <p className='mt-2 text-xl font-medium'>Discover the best internship opportunities in Canada! Search, filter, and apply with ease.</p>
              
              <form onSubmit={handleSearch} className='mt-4'>
                  <input
                      type='text'
                      placeholder='Search for jobs by any keyword, seperate with a empty space " " ...'
                      // value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='border rounded p-2 lg:w-10/12  sm:w-8/12'
                  />
                  <button type='submit' className='bg-red-500-blue-500 text-white p-2 bg-black w-2/12 min-w-20 border rounded hover:opacity-90' >
                      Search
                  </button>
              </form>


          </div>
      </div>

      <div className=''>
      </div>
    </div>
    
  )
}

export default HomeTop