import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center m-10 text-center">
        <h1 className="text-3xl font-bold pb-10 ">ABOUT US</h1>

        <h1 className="text-xl font-bold pb-5">INTERNSHIPS EH, The Open Source Canadian Internship Page</h1>

        <div className="w-full lg:w-5/12">
            <p>Welcome to INTERNSHIPS EH, your go-to platform for discovering internship opportunities across Canada. This was a personal passionn project dedicated to connecting students and young professionals with meaningful internships that can kickstart their careers.
            <br/>
            <br />
            In rough socio-economic times, Candian Universities still OVERCHARGE for CO-OP progams with limited jobs and often times questionable sites... 
            Thats why this site was created.
            <br/>
            <br/>
            Our mission is to make the internship search process simpler, more transparent, and accessible for everyone. As an open-source project, I am committed to community-driven development and continuous improvement. I believe in the power of collaboration and innovation to create a more inclusive and effective job market.
            <br/>
            <br/>
            To Accomplish this the creator of this project Simon Amable made it full open source so it could be further developed into something greater by others as a community. 
            <br/>
            <br/>
            Whether you are a student seeking your first opportunity or a professional looking to gain new skills, INTERNSHIPS EH provides a comprehensive and user-friendly platform to help you find the perfect internship. Join us in shaping the future of career development in Canada!</p>
        </div>
    </div>
  );
}
