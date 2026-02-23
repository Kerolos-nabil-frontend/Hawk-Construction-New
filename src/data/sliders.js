
import Mall from "../assets/images/Mall.jpg";
import Bank from "../assets/images/Bank.jpg";
import Hospital from "../assets/images/Hospital.png";
import Aknan from "../assets/videos/Aknan.mp4";
import Messila from "../assets/videos/Messila-small.mp4";
import Library from "../assets/images/Library.jpg";
import Building from "../assets/images/Building.jpg";
import Directorate from "../assets/images/Directorate.jpg";
import Back from "../assets/images/Back.jpg";

export const defaultSlides = [
    {
        id: "static-1",
        type: "video",
        video: Aknan,
        heading: "Aknan Tower: From Finish Works to Landmark",
        text: "Our Key of Success is the Integrated Daily Effort Shared by Everyone at Hawk Al Ahlia.",
        button: "Our Services",
        path: "/services",
        sliderLocationID: 1
    },
    {
        id: "static-2",
        type: "image",
        image: Bank,
        heading: "Building the Future",
        text: "Our Portfolio Includes the Development of Commercial Centers, Banks, and Hotels.",
        button: "Explore Projects",
        path: "/projects",
        sliderLocationID: 1
    },
    {
        id: "static-3",
        type: "image",
        image: Hospital,
        heading: "Innovative Engineering",
        text: "We Deliver Quality and Precision in Every Project We Undertake.",
        button: "Learn More",
        path: "/about",
        sliderLocationID: 1
    },
    {
        id: "static-4",
        type: "video",
        video: Messila,
        heading: "Messila Beach",
        text: "With a Highly Skilled Team and Proven Track Record, Hawk Al Ahlia Continues to Grow and Innovate.",
        button: "View Certificates",
        path: "/certificates",
        sliderLocationID: 1
    },
    {
        id: "static-5",
        type: "image",
        image: Mall,
        heading: "Trusted Expertise",
        text: "Delivering Exceptional Quality and Sustainable Infrastructure.",
        button: "Contact Us",
        path: "/contact",
        sliderLocationID: 1
    },
];

export const aboutSlides = [
    {
        id: "static-about-1",
        type: "image",
        image: Library,
        heading: "Our Beginning",
        text: "Eng /Hany Samir Abdallah began his professional journey in the construction field in 2005, driven by a deep passion for the industry and a strong entrepreneurial spirit. From the beginning, he dedicated himself to expanding his technical knowledge and developing the skills required to lead in project execution and management.",
        sliderLocationID: 2
    },
    {
        id: "static-about-2",
        type: "image",
        image: Building,
        heading: "Company Vision",
        text: "Since the company was founded in 2015, Hawk Al Ahlia has been actively delivering specialized contracting and construction services across a wide range of sectors including commercial centers, banks, hotels, resorts, universities, highways, and bridges.",
        sliderLocationID: 2
    },
    {
        id: "static-about-3",
        type: "image",
        image: Directorate,
        heading: "Growth & Expansion",
        text: "Our Journey Began with a Focus on Finishing Works such as Painting, Gypsum Plaster, Cement Plaster, and Fair Face. Over Time, We Expanded Our Capabilities to Include Exterior Finish Systems and Exterior Insulation Finish Systems.",
        sliderLocationID: 2
    },
    {
        id: "static-about-4",
        type: "image",
        image: Bank,
        heading: "Global Reach",
        text: "With a Highly Skilled Team and a Proven Track Record of Successful Project Delivery, Hawk Al Ahlia continues to grow and evolve, and now we are also operating our New branch at Dubai U.A.E. maintaining all our services overseas from Kuwait to United Arab Emirates committed to quality, safety, innovation, and exceeding client expectations in every project we undertake.",
        sliderLocationID: 2
    }
];

export const projectSlides = [
    {
        id: "static-proj-1",
        type: "image",
        image: Back,
        heading: "Projects",
        text: "Explore Our Featured and Completed Projects below.",
        sliderLocationID: 3
    }
];
