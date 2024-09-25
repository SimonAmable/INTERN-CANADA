"use client";
import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import Loading from "./Load";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TuneIcon from '@mui/icons-material/Tune';
import { Tune } from "@mui/icons-material";

const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]); // State to hold the job search results
  const [keyword, setKeyword] = useState(""); // State to hold the search keyword
  const [page, setPage] = useState(1); // State to hold the current page number
  const [limit, setLimit] = useState(10); // State to hold the number of jobs per page
  const [totalPages, setTotalPages] = useState(1); // State to hold total number of pages
  const [initialLoad, setInitialLoad] = useState(true); // State to handle the initial load
  const [currentResultCount, setCurrentResultCount] = useState(0); // State to hold the current page number
  const [location,setLocation]= useState("")
  const [isLoading,setIsLoading]= useState(true)  // State to handle loading state
  const [selectedFilters, setSelectedFilters] = useState({
    jobType: "",
    jobCategory: "",
    salary: "",
  }); // State to hold the selected filters

  const [showFilters, setShowFilters] = useState(false);  // State to manage the visibility of filter options



  // Function to handle fetching jobs based on keyword and page number
  const fetchJobs = async (keyword,location,page,limit) => {
    const queryParams = new URLSearchParams({ keyword, location, page,limit});
    // Add selected filters to the query params
    setIsLoading(true)
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    try {
      const response = await fetch(`/api/jobsearch?${queryParams}`);
      const data = await response.json();
      setIsLoading(false)
      setJobs(data.results); // Set the search results
      setCurrentResultCount(data.totalResults)
      // console.log(data.results)
      setTotalPages(data.totalPages); // Set the total number of pages
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Function to handle search submission from form
  const handleSearch = (event) => {
    event.preventDefault(); // Prevent default form submission
    setPage(1); // Reset to the first page when a new search is initiated
    fetchJobs(keyword,location, 1,limit); // Fetch jobs for the new search keyword and page 1
  };

  // Function to handle going to the next page
  const handleNextPage = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      // fetchJobs(keyword, nextPage); 
    }
  };

  // Function to handle going to the previous page
  const handlePreviousPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      // fetchJobs(keyword, prevPage); # Now triggered by the use effect
    }
  };
// triger data load on page change to handle load
// Disable the ESLint rule for this line
/* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
      fetchJobs(keyword,location, page,limit);
    
  }, [page,selectedFilters,limit]);
/* eslint-enable react-hooks/exhaustive-deps */


// tate magagement bs for accordian drop down filters
  const [isOpen, setIsOpen] = useState(null);
  const toggleAccordion = (index) => {
    setIsOpen(isOpen === index ? null : index);
  };
//------------------------------Filtering functionality-----------------------------------
  // Handle change for select dropdowns
  const handleFilterChange = (e, category) => {
    setPage(1); // Reset to the first page when a new filter is selected
    const { value } = e.target;
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [category]: value,
    }));
  };
  // Function to toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const clearSelectedFilters = () => {
    setSelectedFilters({
      jobType: "",
      jobCategory: "",
      salary: "",
    });
  };

  return (
    <div className='w-full '>
              <div className='w-full'>
              <div className=' flex items-center justify-center min-h-[170px] lg:min-h-[260px] w-full bg-primary p-5 '>
                  <div className="flex flex-col ">

                      <h1 className='text-2xl lg:text-4xl font-bold '>Find Your Dream Internship in Canada Today!</h1>
                      <p className='mt-2 text-base lg:text-xl font-medium '>Search, filter, and apply with ease. All Jobs updated daily.</p>
                      
                      <form onSubmit={handleSearch} className='mt-4 flex lg:flex-row flex-col gap-1'>
                          {/* <div className="flex lg:w-5/12  sm:w-5/12 focus-within:border-blue-500">
                          <SearchIcon className="bg-white h-10 w-10"/> */}
                            <input
                                type='text'
                                placeholder='Search by Title, Company, or Keywords...'
                                // value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className=' p-2 border rounded lg:w-7/12  w-full'
                            />
                            
                          {/* </div> */}

                          <input
                              type='text'
                              placeholder='Location...'
                              // value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className='border rounded p-2 w-full lg:w-3/12 '
                          />
                          <div className="relative flex flex-row justify-between gap-1 w--">
                              <button type='submit' className='bg-red-500-blue-500 text-white p-2 bg-black w-3/12 min-w-20 border rounded hover:opacity-70 pl-2' >
                                  Search
                              </button>
                            <div className="flex flex-col ">
                              <div className="relative flex flex-row items-center cursor-pointer p-2 max-h-10 bg-white border rounded w-fit" onClick={toggleFilters} >
                                <TuneIcon/>
                                {/* <h1 className="font-bold text-xl ">Filters:</h1> */}
                              </div>



                                  {showFilters && (<div className="mt-10  right-0 absolute flex flex-col min-w-44 bg-white gap-2 p-1 w-fit border rounded ">
                                                  {/* Job Fields */}
                                                  <div className="">
                                                    <label className="block font-semibold ">Field/Category:</label>
                                                    <select
                                                      className="w-full border p-2 rounded hover:cursor-pointer"
                                                      value={selectedFilters.jobCategory}
                                                      onChange={(e) => handleFilterChange(e, "jobCategory")}
                                                    >
                                                      <option value="">All</option>
                                                      <option value="software">Software Development</option>
                                                      <option value="information tech">IT</option>
                                                      <option value="engineering">Engineering</option>
                                                      <option value="marketing">Marketing</option>
                                                      <option value="finance">Finance</option>
                                                      <option value="healthcare">Healthcare</option>
                                                      <option value="education">Education</option>
                                                      <option value="sales">Sales</option>
                                                      <option value="customer service">Customer Service</option>
                                                      <option value="architecturee">Architecture</option>
                                                      <option value="graphic Design">Design</option>
                                                    </select>
                                                  </div>
                                                  <div className="">
                                                    <label className="block font-semibold">Working Type:</label>
                                                    <select
                                                      className="w-full border p-2 rounded hover:cursor-pointer"
                                                      value={selectedFilters.jobType}
                                                      onChange={(e) => handleFilterChange(e, "jobType")}
                                                    >
                                                      <option value="">All</option>
                                                      <option value="remote">Remote</option>
                                                      <option value="hybrid">Hybrid</option>
                                                      <option value="on site">On-Site</option>
                                                    </select>
                                                  </div>
                                                  <div className="">
                                                    <label className="block font-semibold">Jobs Per Page:</label>
                                                    <select
                                                      className="w-full border p-2 rounded hover:cursor-pointer"
                                                      value={limit}
                                                      onChange={(e) => setLimit(e.target.value)}
                                                    >
                                                      <option value="10">10</option>
                                                      <option value="25">25</option>
                                                      <option value="50">50</option>
                                                      <option value="50">100</option>
                                                      <option value="9000">Over 9000</option>
                                                    </select>
                                                  </div>
                                                  
                                                    <p onClick={clearSelectedFilters} className="text-primary underline hover:font-bold hover:cursor-pointer self-center">Clear all filters</p>
                                                  
                                              </div>)}        
                            </div>
                      </div>
                    </form>

                      {/* I'm doing way to much questionable styling, its good enought right now i gotta ship this shit already */}
              {/* Filter box defined */}
              



                  </div>
              </div>
              <div className=''>
              </div>
            </div>

{/* here or in the div above we will add filtering, it would look nice of the left so fuck it that what we do for now, */}


      {/* <div className="flex flex-col items ">
        <p className="px-1 font-semibold underline">Location</p>
        <select onChange={(e) => setLocation(e.target.value)} className='border rounded p-2 lg:w-2/12 max-w-24 sm:w-3/12'>
          <option value="Canada">Canada</option>
          <option value="Ontario">Ontario</option>
        i'm pushing the filter feature because i'm lazy rn sorry boys and girls soon enough.
        </select>
      </div> */}

      <div className="">
        {/* START OF THE FILTER ACCORDIAN DIV, */}
        {/* <div className="max-w-56 w-full border-black lg:border-r-2 border-2 h-fit m-2 p-1">
          <div className="flex flex-row items-center cursor-pointer p-1" onClick={toggleFilters} >
            <TuneIcon/>
            <h1 className="font-bold text-xl">Filters:</h1>
          </div>        */}
                  {/* Add filter accoirdian items selection for common job filter:
          {/* Working Location Filter 
          <div className="mb-4">
            <div className="flex flex-row border rounded p-1">
              <button className="w-full text-left font-semibold " onClick={() => toggleAccordion(2)}>
                Working Location
              </button>
              <ArrowDropDownIcon/>
            </div>
            <div className={`mt-2 ${isOpen === 2 ? 'block' : 'hidden'}`}>
              <label className="block">
                <input type="checkbox" name="location" value="remote" /> Remote
              </label>
              <label className="block">
                <input type="checkbox" name="location" value="onsite" /> Onsite
              </label>
              <label className="block">
                <input type="checkbox" name="location" value="hybrid" /> Hybrid
              </label>
            </div>
          </div> 
          </div>
          */}

            
        

        <div className="flex flex-col items-center">
          <div className="flex pt-2 pl-10 self-baseline">
            <p>Number Jobs Found : {currentResultCount}</p>
          </div>
          {isLoading && <Loading />}
      {/* Display job cards based on search results */}
          <div className="flex flex-wrap justify-center ">
          
            {jobs.map((job) => (
              job.apply_link ? ( //make sure the element has a link to click before displaying
              <JobCard
                key={job._id} // Assuming each job has a unique _id
                title={job.title}
                company={job.company}
                location={job.location}
                salary={job.salary}
                apply_link={job.apply_link}
                timestamp={job.timestamp}
              />) : null
            ))}
          </div>
        </div>

      </div>
      {/* Pagination controls */}
      <div className="flex justify-center my-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={`py-2 px-4 mr-2 rounded ${
            page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 text-white"
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className={`py-2 px-4 ml-2 rounded ${
            page === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary text-white"
          }`}
        >
          Next
        </button>
      </div>
      <div>

      </div>
    </div>
  );
};

export default JobSearchPage;
