import Image from "next/image";
import MarkdownComponent from "../ui/MarkdownComponet";
// FIX THIS PAGE SIMON
const markdownContent = `
# **ABOUT US**

## **Intern Canada**: The Open source canadian intern page

Welcome to **Intern Canada**, the **FREE** platform designed to make finding internships across Canada easy, accessible, and stress-free. Whether you're a student navigating the tricky waters of job searching or simply looking for better opportunities, you've come to the right place! Unlike university CO-OP programs that often charge over **$400** a semester for a overwhelming 100-300 job postings + top of the line resources and network opportunities, we simply offer a **completely free** service to help student find internships with **no strings attached!** 

If there's anything you'd like to see improved or added, or maybe you see this site bugging out, please don't hesitate to let me know!

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
