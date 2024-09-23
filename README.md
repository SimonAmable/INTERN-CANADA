# INTERNSHIPS EH : The Open Source Canadian Coop Page.
https://theopensourcecanadiancooppage.vercel.app/
# WHAT IS THIS?
- This is just a OPEN SOURCE JOB SITE FOR INTERNSHIPS IN CANADA Meaning hopefully other people will contribute to the project and jobs base so that it can become something greaters than what it is now.
- This app is Currently in the MVP stage and FULLY WORKS COLLECTING AND DISPLAYING ABOVE 1000 Internships!!!! It currently supports text Keyword Search across the title, company, location, and **description(the description is on the company site but i promise the seacrch still works!)** I will soon add partial text, filters, and experiment with semantic AI search option aswell if costs are low enough. The Data collection for jobs is done automaticatlly using a few personally made webscrapping scripts that Extract internship data from big sites, Transform it for my database, and Load it into the website your viewing) pipelines with cron scheduling to run at midnight every night ensuring the job data is ALWAYS live and valid!!!!

# WHY DID I MAKE THIS?
- WHAT A GREAAATTTTTTT QUESTION!!! If you have used a university Co-op site you know exactly why. The jobs pages have a general trend to be outdated as my grandmother. My schools job page was a table so big it didnt fit on any screen... with no search features... all for limited jobs...this was discouraging to say the least but it motivated me to make something better and that is this job site! (Not to say school coop isnt worth it, if you hav the money and can get a job it 100% pays itself off)

# Contact
- If you would like to suggest a feature please reach out to me and i would love to add it,contact me on any of my social media platforms for the fastest response or mail me at Simonamable@gmail.com !! I look forward to hearing your feedback!!
  
# Tech Stack:
**Frontend:**
- Next.js
- Tailwind CSS
- React MUI
- Vercel
**Backend:**
- Selenium
- Beautiful Soup
- MongoDB
- A Ubuntu VPS/VM 4gb ram
  
## About the tech Stack:
- ***Completxity is the Enemey. Simplicity is your friend. Dogecoin will go to the Moon by Years End  - A Quote By : AI Elon Musk***
- This is a full stack application with a ETL backend all of which I coded in about ~7-10 solid working days for rerfrence. The frontend was done with next.js and tailwind js which helped my quick development time and improved modularity.
- Currently the backend is a few selenium webscrapping scripts that are gonna run on a CRON schedule every day at midnight to collect approx ~1500+ Canadian Intership jobs. These raw job internships then undergo some cleaning and unique filterin and get put into a live hosted MongoDB Database which is connected to the frontend. I Could switch to SQL later on but i'm forsee myself updating the data model frequently so i dont see a need or want. 


# TODO (:
- Keep this appliction lean, dont add tooo many features we dont acctually need. I like the minimalistic design aporach so I built it lean and clean so its easy to maintain.
- Add filters for location(somoe locations are very specific so we need some logical tranlation and a extra coloum to address this).
- Add filters for other attributes deem desirable to filter this can be extensive i just dont know how to add it to the frontend UI in a clean and minimalistic way. Likely just salary once we clean the data layer to get salary consitently. other attributes open aswell is requested
- **Add a quick feature request button!!!! This just need to be a simple mesage form to help me get more feedback on what needs to be implemented so i can follow the User Centered Design Process.**
- Add Sort by.
  
