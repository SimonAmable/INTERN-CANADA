import Image from "next/image";

// import HomeTop from "./extra_ui_components/HomeTop";
// import AllJobsDisplay from "./extra_ui_components/AllJobsDisplay";
import JobSearchPage from "./ui/JobSearchPage";

export default function Home() {
  return (
      <main className="flex flex-col w-full min-w-full items-center ">
        <JobSearchPage/>
      </main>
      
  );
}
