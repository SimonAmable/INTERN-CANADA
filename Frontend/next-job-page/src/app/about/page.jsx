import Image from "next/image";
import MarkdownComponent from "../ui/MarkdownComponet";
// FIX THIS PAGE SIMON
const markdownContent = `
# **ABOUT US**

## **Intern Canada**: Your Gateway to Canadian Internships

Welcome to **Intern Canada**, the **FREE** platform designed to make finding internships across Canada easy, accessible, and stress-free. Whether you're a student navigating the tricky waters of job searching or simply looking for better opportunities, you've come to the right place! Unlike university CO-OP programs that often charge over **$400** a semester for a overwhelming 100-300 job postings, and top of the line resources and network opportunities, we offer a **completely free** service to help student find internships with **no strings attached!** 

Helllooo there! My names Simon Amable, and I built Intern Canada honestly just because I got frustrated with the lack of good resources and the ridiculous fees/need for engagment that came with them. I just wanted a simple, easy way to find good internships, and I knew other students were feeling the same. So what did i do???? I rolled up my sleeves, and built this site to make it easier for all of us to find internships in Canada!!! 

If there's anything you'd like to see improved or added, or maybe you see this site  bugging out, don't hesitate to let me know — I'm always open to feedback and would love to hear yours!

Thanks again for visiting. I hope this helps you find that perfect opportunity.
 **Good luck, and happy job hunting!**

`;

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full lg:w-4/12 min-h-[80vh] p-5 lg:p-10 text-center">
        <MarkdownComponent content={markdownContent} />
    </div>
  );
}
