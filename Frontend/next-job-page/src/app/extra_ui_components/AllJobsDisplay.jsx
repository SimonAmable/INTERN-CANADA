import React from 'react'
import JobCard from '../ui/JobCard'



const AllJobsDisplay = async () => {
    try {

        let res = await fetch('http://localhost:3000/api/alljobs')
        // let jobs = await data.json()
        

        // let jobs_list=[]
        const json_data = await res.json(); // convert response to json
        const jobs_list = Object.values(json_data); //convert json response to list
        console.log(jobs_list)

        return (
            <div className='w-full flex flex-col items-center '>
                {jobs_list.map((job) => (
                    // Conditionally render JobCard only if apply_link exists
                    job.apply_link ? (
                        <JobCard
                            key={job._id}
                            title={job.title}
                            company={job.company}
                            location={job.location}
                            apply_link={job.apply_link}
                            timestamp={job.timestamp}
                        />
                    ) : null
                ))}
            </div>
        );
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return <div>Error fetching jobs</div>;
    }
}

export default AllJobsDisplay