import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaidIcon from '@mui/icons-material/Paid';
import Link from "next/link"

const JobCard = ({ title, company, location, salary,apply_link,timestamp }) => {
    // fomating date start--------------------------------------------------------------------------------
    const dateObject = new Date(timestamp);
        // Get today's date
    const today = new Date();
    // Check if the timestamp is from today
    const isToday = dateObject.toDateString() === today.toDateString();
    // Format the date using toLocaleDateString if not today
    const formattedDate = isToday
        ? "Today"
        : dateObject.toLocaleDateString('en-US', {
            weekday: 'long', // "Monday"
            year: 'numeric', // "2024"
            month: 'long', // "September"
            day: 'numeric' // "5"
        });
        // formating salary, if salary is less than 12 characters, it is not a salary it is a glitch. lol. fix this on the backend simon.
    const formattedSalary = String(salary).trim();
    if ((salary == null)|| (formattedSalary.length == 0)) {
        salary = "Check Employers Page";
    }
      if (formattedSalary.length > 0 && formattedSalary != null) {
      const numbers = formattedSalary.match(/\d+/g);
    
        if (numbers < 12) {
          salary = "Check Employers Page";
        }
    } 
    // fomating date end--------------------------------------------------------------------------------


  return (
    
    <div className='m-5 flex flex-col w-11/12 bg-slate-200 border rounded-xl border-gray-400 hover:bg-slate-300 hover:cursor-pointer'>
      <a href={apply_link} target='_blank' >
      <div className='flex items-center justify-between'>
        <h1 className='pl-4 pt-4 text-2xl font-bold text-black'>{title}</h1>
        {/* <h1 className='text-gray-400 pr-3 text-sm'>Date: {formattedDate}</h1> */}
        {/* <h1 className='pr-4 pt-4 font-bold '> Click To Open</h1> */}
      </div>
      <p className='pl-4 text-gray-700 text-lg'>{company}</p>
      
      <div className='pl-3 p-3 flex flex-row w-full justify-between gap-3'> 
        <div className='flex flex-row items-center'>
          <LocationOnIcon />
          <p className='pl-1'>{location}</p>
        </div>
        <div className='flex flex-row items-center'>
          <PaidIcon />
          <p className='pl-1'>{salary}</p>
        </div>
      </div>
      </a>
      {/* <a href={apply_link} target='_blank' className='bg-black hover:bg-red-500 text-white font-bold p-2 rounded w-28 text-center ml-3 mb-3'>
        Apply Now
      </a> */}
    </div>
  );
};

export default JobCard;
