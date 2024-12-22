import { Header } from "@/components/Subject/header"
import { SubjectCard } from "@/components/Subject/subject-card"
import { Pagination } from "@/components/Subject/pagination"
import Layout from "@/components/Layout"

const subjects = [
  {
    title: "English Language",
    image: "/image/subject/english.png",
    schedule: {
      days: "Monday - Friday",
      time: "10:00am - 12:00pm"
    },
    teacher: {
      name: "Mrs. Yetunde Adebayo",
      image: "/image/teachers/english.png"
    }
  },
  {
    title: "Mathematics",
    image: "/image/subject/mathematics.png",
    schedule: {
      days: "Monday - Wednesday",
      time: "8:00am - 10:00pm"
    },
    teacher: {
      name: "Mr. Miebi Perebuowei",
      image: "/image/teachers/mathematics.png"
    }
  },
  {
    title: "Civic Education",
    image: "/image/subject/civic-education.png",
    schedule: {
      days: "Friday",
      time: "10:00am - 12:00pm"
    },
    teacher: {
      name: "Mrs.Chisom Okechukwu",
      image: "/image/teachers/civic.png"
    }
  },
  // second
  {
    title: "Mathematics",
    image: "/image/subject/mathematics.png",
    schedule: {
      days: "Monday - Wednesday",
      time: "8:00am - 10:00pm"
    },
    teacher: {
      name: "Mr. Miebi Perebuowei",
      image: "/image/teachers/mathematics.png"
    }
  },
  {
    title: "Civic Education",
    image: "/image/subject/civic-education.png",
    schedule: {
      days: "Friday",
      time: "10:00am - 12:00pm"
    },
    teacher: {
      name: "Mrs.Chisom Okechukwu",
      image: "/image/teachers/civic.png"
    }
  },
  {
    title: "English Language",
    image: "/image/subject/english.png",
    schedule: {
      days: "Monday - Friday",
      time: "10:00am - 12:00pm"
    },
    teacher: {
      name: "Mrs. Yetunde Adebayo",
      image: "/image/teachers/english.png"
    }
  },
  
  
  // third
  {
    title: "English Language",
    image: "/image/subject/english.png",
    schedule: {
      days: "Monday - Friday",
      time: "10:00am - 12:00pm"
    },
    teacher: {
      name: "Mrs. Yetunde Adebayo",
      image:"/image/teachers/english.png"
    }
  },
  {
    title: "Mathematics",
    image: "/image/subject/mathematics.png",
    schedule: {
      days: "Monday - Wednesday",
      time: "8:00am - 10:00pm"
    },
    teacher: {
      name: "Mr. Miebi Perebuowei",
      image: "/image/teachers/mathematics.png"
    }
  },
  {
    title: "Civic Education",
    image: "/image/subject/civic-education.png",
    schedule: {
      days: "Friday",
      time: "10:00am - 12:00pm"
    },
    teacher: {
      name: "Mrs.Chisom Okechukwu",
      image: "/image/teachers/civic.png"
    }
  },
  // Repeat the same subjects to match the image
]
export default function Page() {
  return (
    <Layout>
      {/* Ensure the layout fills the entire viewport */}
      <div className="h-screen bg-[#FBFBFB] flex flex-col">
        {/* Fixed Header */}
        <Header />

        {/* Scrollable Main Content */}
        <main className=" w-[100%] flex-grow overflow-y-auto mx-auto px-16 py-5 space-y-6 scrollbar-hide">
           {/* Fixed "All Subjects" Header */}
           <div className="sticky top-[-19px] bg-[#FBFBFB]  z-10 py-2 pt-6 ">
            <h1 className="text-2xl font-semibold">All Subjects</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <SubjectCard key={index} {...subject} />
            ))}
          </div>
        </main>

        {/* Fixed Pagination */}
        <Pagination />
      </div>
    </Layout>
  );
}

