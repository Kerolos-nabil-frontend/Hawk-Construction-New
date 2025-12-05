import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Bank from "../../assets/images/Bank.jpg";
import Mall from "../../assets/images/Mall.jpg";
import Camp from "../../assets/images/Camp.png";
import Tennis from "../../assets/images/Tennis.jpg";
import Hospital2 from "../../assets/images/Hospital2.jpg";
import Directorate from "../../assets/images/Directorate.jpg";
import Villa from "../../assets/images/Villa.png";
import Hospital from "../../assets/images/Hospital.png";
import Central from "../../assets/images/Central.png";
import City from "../../assets/images/City.png";
import Hospital3 from "../../assets/images/Hospital 3.jpg";
import Baker from "../../assets/images/Baker.jpg";
import Back from "../../assets/images/Back.jpg";
import Salam from "../../assets/images/Salam.jpg";
import Airport from "../../assets/images/Airport.jpg";
import Building from "../../assets/images/Building.jpg";
import Court from "../../assets/images/Court.jpg";
import Education from "../../assets/images/Education.jpg";
import Villa3 from "../../assets/images/villa3.jpg";
import Palace from "../../assets/images/Palace.jpg";
import Library from "../../assets/images/Library.jpg";
import Embassy from "../../assets/images/Embassy.jpg";
import Science from "../../assets/images/Science.jpg";
import Tower from "../../assets/images/Tower.jpg";
import Tower2 from "../../assets/images/Tower2.jpg";
import School1 from "../../assets/images/School1.jpeg";
import School2 from "../../assets/images/School2.jpeg";
import School3 from "../../assets/images/School3.jpeg";
import School4 from "../../assets/images/School4.jpeg";
import SchoolVideo from "../../assets/videos/Schoolvideo.mp4";
import NewVideo from "../../assets/videos/NewVideo.mp4";
import HotelVideo from "../../assets/videos/HotelVideo.mp4";
import MallVedio from "../../assets/videos/Mall-Vedio.mp4";
import Andalous from "../../assets/videos/AndaVideo.mp4";
import KuwaitUni from "../../assets/videos/KuwaitUni.mp4";
import Uni1 from "../../assets/images/Uni1.webp";
import Uni2 from "../../assets/images/Uni2.jpg";
import Uni3 from "../../assets/images/Uni3.jpg";
import Uni4 from "../../assets/images/Uni4.jpg";
import Uni5 from "../../assets/images/Uni5.jpg";
import Anda1 from "../../assets/images/Anda1.jpeg";
import Anda2 from "../../assets/images/Anda2.jpeg";
import Anda3 from "../../assets/images/Anda3.jpeg";
import Anda4 from "../../assets/images/Anda4.jpeg";
import Tower3 from "../../assets/images/Tower3.jpeg";
import Tower4 from "../../assets/images/Tower4.jpeg";
import Tower5 from "../../assets/images/Tower5.jpeg";
import School5 from "../../assets/images/School5.jpeg";
import School6 from "../../assets/images/School6.jpeg";
import School7 from "../../assets/images/School7.jpeg";
import School8 from "../../assets/images/School8.jpeg";
import New1 from "../../assets/images/New1.jpeg";
import New2 from "../../assets/images/New2.jpeg";
import New3 from "../../assets/images/New3.jpeg";
import New4 from "../../assets/images/New4.jpeg";  
import Hotel from "../../assets/images/Hotel.jpg";
import Hotel2 from "../../assets/images/Hotel2.jpg";
import Hotel3 from "../../assets/images/Hotel3.jpg";
import Hotel4 from "../../assets/images/Hotel4.jpg";
import Mall1 from "../../assets/images/Mall1.jpeg";
import Mall2 from "../../assets/images/Mall2.jpeg";
import Mall3 from "../../assets/images/Mall3.jpeg";
import Mall4 from "../../assets/images/Mall4.jpeg";
import Mall5 from "../../assets/images/Mall5.jpeg";
import Mall6 from "../../assets/images/Mall6.jpeg";  
import Building1 from "../../assets/images/Building1.jpeg";
import Building2 from "../../assets/images/Building2.jpeg";
import Building3 from "../../assets/images/Building3.jpeg";
import Building4 from "../../assets/images/Building4.jpeg";
import Building5 from "../../assets/images/Building5.jpeg";
import Building6 from "../../assets/images/Building6.jpeg";
import Building7 from "../../assets/images/Building7.jpeg";
import Building8 from "../../assets/images/Building8.jpeg";
import Building9 from "../../assets/images/Building9.jpeg";
import Building10 from "../../assets/images/Building10.jpeg";










const featuredProjects = [
  {
    title:
      "The Directorate General of Civil Aviation of Kuwait New Headquarters Building.",
    images: [Directorate],
    category: "Governmental",
    area: "Sabhan Area – International Airport, Farwaniya Gov.",
    scope:
      "Ceramic Tiling, Anti- Carbonation Texture, Fair Face, Cement Plaster & Interior painting.",
    contractor: "M. A. Al-Kharafi & Sons Co. W.L.L",
  },
  {
    title: "Kuwait Airport Project New Terminal 2",
    images: [Airport],
    category: "Governmental",
    area: "Farwaniyah in Kuwait , 16km (10 miles) south of Kuwait City.",
    scope: "EIFS System.",
    contractor: "Limak",
  },
  {
    title:
      "Sheikh Jaber Al-Abdullah Al-Jaber Al-Sabah International Tennis Complex",
    images: [Tennis],
    category: "Governmental",
    area: "Al-Zahra District - Sixth Ring Road",
    scope:
      "Fair Face , Plaster , Gypsum Board, Cement Board, painting & GRG Ceiling.",
    contractor: "Ahmadiah Contracting & Trading Co.",
  },
  {
    title: "Al Amiri Hospital Extension",
    images: [Hospital2],
    category: "Healthcare",
    area: "Al Sharq - Block 3 – Capital Governorate",
    scope: "Gypsum board, Acoustic Ceiling ,painting & Demolition .",
    contractor: "JV Asco and Pizzarotti",
  },
];

const allProjects = [
   {
    title: "Al Hayaah School sabah Al Salem",
    images: [School1, School2, School3, School4,School5],
    category: "Educational",
    area: "Street 109, Sabah Al Salem, Mubarak Al-Kabeer Governorate",
    scope:"EIFS System & External Painting",
    contractor:"Aljaidaa international general trading and contracting co.",
  },
   {
    title: "One international School ",
    images: [School6, School7, School8],
    video: SchoolVideo,
    category: "Educational",
    area: "Khaitan, Farwaniya Governorate, Kuwait",
    scope:"Cement Plaster, Fair Face ,GRG wall cladding and ceiling, Ceramic tiles, Granite , Painting Granix Flooring &Interlock and Curbstone",
    contractor:"First United Building Construction company",
  },
  {
    title: "New Maternity Hospital",
    images: [New1, New2,Hospital, New3, New4],
    video: NewVideo,
    category: "Healthcare",
    area: "Al-Sabah Health District – Shuwaikh",
    scope:
      "Concrete Screed, Self-Leveling Screed, Curbstones , Walk ways, Concrete Crack Injection, Blockwork, Plaster, Forming, Painting, Steel Reinforcing ,Ceramic Tiles , Lightweight Concrete,Fair Face Treatment, Exterior Plaster Exterior Texture & Landscape",
    contractor: "Impressa Pizarrotti",
  },
   {
    title: "Safir AL-Fintas Hotel",
    images: [Hotel, Hotel2, Hotel3, Hotel4],
    video: HotelVideo,
    category: "Hotels",
    area: "Al Aqeelah Beach, Coastal Road 209",
    scope: "External Facades Refurbishment.",
    contractor: "Kuwait Hotels Company",
  },
   {
    title: "Al Khairan Mall",
    images: [Mall1, Mall2, Mall3, Mall4,Mall5, Mall6],
    video: MallVedio,
    category: "Commercial",
    area: "Sabah Al Ahmad Sea City area of the Al Khiran district ",
    scope: " internal paint, Render plaster, Skim coat",
    contractor: "SEC",
  },
   {
    title: "Al Andulus Mall",
    images: [Anda1, Anda3, Anda2, Anda4],
    video: Andalous,
    category: "Commercial",
    area: "Hawalli Governorate, Kuwait",
    scope: "Supply and Installation of EIFS system",
    contractor: " First united General Trading and Contracting W.L.L.",
  },
   {
    title: "Kuwait Univesrsity",
    images: [Uni1, Uni2, Uni3, Uni4,Uni5],
    video: KuwaitUni,
    category: "Educational",
    area: "Al-Shadadiya area, Kuwait",
    scope: "",
    contractor: "",
  },
  {
    title: "The business District of the Hessah Al Mubarak District",
    images: [Building1,Building2,Building3,Building4,Building5],
    category: "Residents buildings",
    area: "Hessah Al Mubarak",
    scope:
      "EIFS, FairFace, and Bitumen Coating",
    contractor: "Ahmadiah Contracting and Trading Company",
  },
  {
    title: "The business District of the Hessah Al Mubarak District - Phase 2",
    images: [Building6,Building7,Building8,Building9,Building10],
    category: "Residents buildings",
    area: "Hessah Al Mubarak ",
    scope:
      "FairFace, Paint and Anti Carbonation",
    contractor: "First United building and construction Company ",
  },
  {
    title: "The Central Bank of Kuwait",
    images: [Bank],
    category: "Governmental",
    area: "Al- Sharq, Al’Asimah, 25 Rd.",
    scope:
      "Concrete Forming, Steel Reinforcing, Fair Face, Concrete Chipping, Ceramic, Tiling Block Work, Cement Plaster & Cement Screed.",
    contractor: "M. A. Al-Kharafi & Sons Co. W.L.L",
  },
  {
    title: "The Avenues Mall Phase 1, 4A & 4B",
    images: [Mall],
    category: "Commercial",
    area: "Al-Rai, Block No. 1, Farwaniya Gov.",
    scope:
      "EIFS/ETICS Facades System, Control Joints Mastic, Fair Face, Painting, Micro Concrete Screed & Cement Plaster.",
    contractor:
      "Al-Ghanim International Contracting Co. & Ahmadiah Contracting Trading Co.",
  },
  {
    title: "Al Ghunaim Residential Towers Al salmyia block 10",
    images: [Tower3,Tower4,Tower5],
    category: "Residents buildings",
    area: "Al Ghunaim Apartments, Al Blajat St, Salmiya",
  },
 
  {
    title: "Kazma Camp Kuwait National Guard",
    images: [Camp],
    category: "Governmental",
    area: "Saad Al Abdulla Al Sabah Rd",
    scope:
      "EIFS/ETICS Facades System , Acrylic Render Plaster, Metal Ceiling, Gypsum Board, Acoustic Ceiling, painting, Epoxy Paint ,PU Coating & anti-Carbonation Paint.",
    contractor: "Ahmadiah Contracting & Trading Co.",
  },
  
  {
    title: "Sabah Al-Ahmed City (100 Villas + 3 Mosques)",
    images: [City],
    category: "Residents buildings",
    area: "Al-Wafra Area - Kilo 40 Road 306 - Al-Ahmadi Governorate.",
    scope:
      "Concrete forming, Steel reinforcing, Fair Face, Block work, Cement plaster, Painting & Exterior texture.",
    contractor: "M.A.Al Kharafi & Sons Co. W.L.L.",
  },
  {
    title: "New Extension Of Al Jahra Hospital",
    images: [Hospital3],
    category: "Healthcare",
    area: "Al-Qasr, Al-Jahra Governorate, Kuwait.",
    scope: "Cement board, painting work, vinyl flooring & gypsum board work.",
    contractor: "M.A.Al Kharafi & Sons Co.",
  },
 
  {
    title: "Mr.Baker Restaurants",
    images: [Baker],
    category: "Commercial",
    area: "Multiple Locations",
    scope: "Gypsum Board.",
    contractor: "Mr. Baker Group",
  },
  {
    title: "Al Salam Hospital Worker’s Residence - 10 Floors",
    images: [Salam],
    category: "Healthcare",
    area: "Al Ahmadi, Kuwait.",
    scope: "Fair Face, Cement Plaster, Painting & Exterior Texture.",
    contractor: "Tasneim Company for General Trading & Contracting.",
  },
  {
    title: "Airport Project New Terminal 2",
    images: [Airport],
    category: "Governmental",
    area: "Farwaniya governorate",
    scope: "EIFS System.",
    contractor: "Limak",
  },
  {
    title: "Wafra Villas - (440 Villas)",
    images: [Villa],
    category: "Villas",
    area: "Wafra Area – 40 km on 306 road.",
    scope: "Fair Face, Cement Plaster, Painting & Exterior texture.",
    contractor: "G. A. K ACICO Construction Co.",
  },
  {
    title: "Education City Project",
    images: [Education],
    category: "Educational",
    area: "Doha, Kuwait",
    scope: "Plaster, Gypsum, and Finishing Works",
    contractor: "Kharafi National",
  },
  {
    title: "Royal Palace Project",
    images: [Palace],
    category: "Governmental",
    area: "Bayan, Kuwait",
    scope: "High-End Finishing, Painting, GRG, and Fair Face Concrete",
    contractor: "M.A. Kharafi & Sons Co.",
  },
  {
    title: "National Library Project",
    images: [Library],
    category: "Educational",
    area: "Al-Qibla, Kuwait",
    scope: "EIFS, Interior Painting, Ceiling Work.",
    contractor: "Ahmadiah Contracting",
  },
  {
    title: "Embassy Building Project",
    images: [Embassy],
    category: "Governmental",
    area: "Diplomatic Area, Kuwait",
    scope: "Painting, Gypsum, and EIFS Facade System.",
    contractor: "M.A. Kharafi & Sons",
  },
  {
    title: "Jahra Court Complex",
    images: [Court],
    category: "Governmental",
    area: "Al Jahra governorate of Kuwait.",
    scope: "Repairing Joints, Base Reapply Paint on Gypsum Cladding & Ceiling",
    contractor: "M.A.Al Kharafi & Sons Co.s",
  },
  {
    title: "Science Center Expansion",
    images: [Science],
    category: "Educational",
    area: "Salmiya, Kuwait",
    scope: "EIFS System, Plaster, and Finishing Works.",
    contractor: "Al Ghanim International",
  },
  {
    title: "Residential Tower 2 Project",
    images: [Tower2],
    category: "Residents buildings",
    area: "Fintas, Kuwait",
    scope: "Interior Paint, Ceiling, EIFS Facades.",
    contractor: "Private Client",
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = allProjects.filter((proj) => {
    const matchesCategory =
      category === "All" ||
      proj.category.toLowerCase() === category.toLowerCase();

    const matchesSearch =
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gray-900 text-white">
        <img
          src={Back}
          alt="Projects Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Projects</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Explore our featured and completed projects below.
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Featured Projects
        </h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="rounded-2xl shadow-lg"
        >
          {featuredProjects.map((proj, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative cursor-pointer group"
                onClick={() => setSelectedProject(proj)}
              >
                <img
                  src={proj.images[0]}
                  className="w-full h-[450px] object-cover rounded-2xl transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition rounded-2xl flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white">
                    {proj.title}
                  </h3>
                  <p className="text-sm mt-2 line-clamp-2 text-white">
                    {proj.scope}
                  </p>
                  <button className="mt-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow hover:bg-gray-200">
                    View Details
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* All Projects */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          All Projects
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "All",
              "Commercial",
              "Educational",
              "Governmental",
              "Healthcare",
              "Mosques",
              "Residents buildings",
              "Villas",
              "Hotels",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold border transition ${
                  category === cat
                    ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-full px-5 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols- gap-10">
          {filteredProjects.map((proj, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:scale-105 border-2 border-gray-100 hover:border-blue-400"
              onClick={() => setSelectedProject(proj)}
            >
              <div className="relative">
                <img
                  src={proj.images[0]}
                  className="w-full h-72 object-cover group-hover:scale-110 transition duration-500 rounded-t-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-blue-700/60 transition flex items-end justify-center opacity-0 group-hover:opacity-100 rounded-t-3xl">
                  <span className="bg-white text-blue-700 px-4 py-2 mb-6 rounded-lg text-base font-semibold shadow-lg animate-bounce">
                    View Details
                  </span>
                </div>
              </div>
              <div className="p-7 flex flex-col gap-2">
                <h3 className="text-2xl font-bold mb-1 text-blue-700 group-hover:text-blue-900 transition">
                  {proj.title}
                </h3>
                <p className="text-gray-700 text-base font-medium">
                  <span className="font-semibold text-gray-500">Area:</span>{" "}
                  {proj.area}
                </p>
                <p className="text-gray-600 text-sm line-clamp-3">
                  <span className="font-semibold text-gray-500">Scope:</span>{" "}
                  {proj.scope}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold text-gray-500">
                    Contractor:
                  </span>{" "}
                  {proj.contractor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
     {/* Modal */}
{selectedProject && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
    <div
      className="bg-white rounded-3xl shadow-xl w-full max-w-5xl p-6 relative animate-[fadeIn_0.25s_ease-out]"
      style={{ maxHeight: "90vh", overflowY: "auto" }}
    >
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
        onClick={() => setSelectedProject(null)}
      >
        ✖
      </button>

      {/* Media Swiper */}
      <div className="rounded-2xl overflow-hidden mb-6">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation
          loop
          className="rounded-2xl overflow-hidden"
        >
          {/* Images */}
          {selectedProject.images.map((img, i) => (
            <SwiperSlide key={`img-${i}`}>
              <img
                src={img}
                alt={selectedProject.title}
                className="w-full h-[550px] object-cover"
              />
            </SwiperSlide>
          ))}

          {/* Video */}
          {selectedProject.video && (
            <SwiperSlide key="video">
              <div className="relative w-full h-[550px] bg-black flex items-center justify-center">
                <video
                  className="w-full h-full object-contain"
                  controls
                  playsInline
                  controlsList="nodownload"
                >
                  <source src={selectedProject.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Content */}
      <div className="px-2">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">
          {selectedProject.title}
        </h2>

        <p className="text-gray-700 mb-2 text-lg">
          <strong className="text-gray-900">Area:</strong> {selectedProject.area}
        </p>

        {selectedProject.scope && (
          <p className="text-gray-700 mb-2 text-lg leading-relaxed">
            <strong className="text-gray-900">Scope:</strong> {selectedProject.scope}
          </p>
        )}

        {selectedProject.contractor && (
          <p className="text-gray-700 text-lg">
            <strong className="text-gray-900">Contractor:</strong>{" "}
            {selectedProject.contractor}
          </p>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
}
