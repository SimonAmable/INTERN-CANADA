import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center m-10 text-center">
        <h1 className="text-3xl font-bold pb-10 ">ABOUT US</h1>

        <h1 className="text-xl font-bold pb-5">INTERNSHIPS EH, The Open Source Canadian Internship Page</h1>

        <div className="w-full lg:w-5/12">
            <p>Welcome to <strong> Intern Canada </strong>, your go-to platform for discovering internship opportunities across Canada. 
            <br/>
            <br />
            Candian Universities charge upwards of $400+ every 4 month for CO-OP progams with limited jobs and often times questionable sites.... 
            Thats why this site was created. I wanted to make it easier for students to find internships in Canada and beyond that make it FREE.
            <br/>
            <br/>
            </p>
            </div>
    </div>
  );
}
