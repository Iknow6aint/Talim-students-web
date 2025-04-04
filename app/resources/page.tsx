import { ResourcesTable } from "@/components/resources/resources-table";
import { Pagination } from "@/components/Subject/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import Layout from "@/components/Layout";

const resources = [
  {
    id: "1",
    name: "History Video.pdf",
    subject: "Maths",
    uploadDate: "October 10, 2024",
    teacherName: "Mr. Miebi Perebuowei",
    type: "pdf" as const,
  },
  {
    id: "2",
    name: "History Video.img",
    subject: "English",
    uploadDate: "October 10, 2024",
    teacherName: "Mrs. Yetunde Adeba...",
    type: "img" as const,
  },
  {
    id: "3",
    name: "History Video.vid",
    subject: "Civic Education",
    uploadDate: "October 10, 2024",
    teacherName: "Mrs. Joan Okechukwu",
    type: "vid" as const,
  },
  {
    id: "4",
    name: "History Video.txt",
    subject: "History",
    uploadDate: "October 10, 2024",
    teacherName: "Mrs. Yetunde Adeba...",
    type: "txt" as const,
  },
  {
    id: "5",
    name: "History Video.txt",
    subject: "History",
    uploadDate: "October 10, 2024",
    teacherName: "Mrs. Yetunde Adeba...",
    type: "txt" as const,
  },
  {
    id: "6",
    name: "History Video.txt",
    subject: "History",
    uploadDate: "October 10, 2024",
    teacherName: "Mrs. Yetunde Adeba...",
    type: "txt" as const,
  },
  {
    id: "7",
    name: "History Video.txt",
    subject: "History",
    uploadDate: "October 10, 2024",
    teacherName: "Mrs. Yetunde Adeba...",
    type: "txt" as const,
  },
  {
    id: "8",
    name: "History Video.txt",
    subject: "History",
    uploadDate: "October 10, 2024",
    teacherName: "Mrs. Yetunde Adeba...",
    type: "txt" as const,
  },
  {
    id: "9",
    name: "History Video.txt",
    subject: "History",
    uploadDate: "October 10, 2024",
    teacherName: "Mrs. Yetunde Adeba...",
    type: "txt" as const,
  },
  {
    id: "10",
    name: "History Video.txt",
    subject: "History",
    uploadDate: "October 10, 2024",
    teacherName: "Mrs. Yetunde Adeba...",
    type: "txt" as const,
  },
  {
    id: "11",
    name: "History Video.txt",
    subject: "History",
    uploadDate: "October 10, 2024",
    teacherName: "Mrs. Yetunde Adeba...",
    type: "txt" as const,
  },
];

export default function Page() {
  return (
    <Layout>
      <div className="h-screen bg-[#F8F8F8] flex flex-col">
        <main className="container flex-grow overflow-y-auto mx-auto p-4 space-y-6 scrollbar-hide">
          <div className="flex sm:flex-row flex-col gap-1 sm:gap-0 justify-between items-left sm:items-center">
            <div>
              <h1 className="text-xl text-[#2F2F2F] font-medium">Resources</h1>
              <p className="text-[#AAAAAA]">
                Everything your teachers shared for you!
              </p>
            </div>
            <div className="flex h-full sm:flex-row gap-4 items-center">
            <div className="flex w-full h-10 sm:h-12 border border-[#F0F0F0] bg-white items-center p-2 rounded-lg text-[#898989]">
              <Search strokeWidth="1.5" className="" />
              <Input type="search" placeholder="Search" className="flex-1 border-none shadow-none focus:outline-none focus-visible:ring-0" />
            </div>
            <Button className="w-full h-10 sm:h-12 sm:w-auto bg-[#003366] hover:bg-blue-800">
              <Download className="" /> Download All
            </Button>
          </div>
          </div>

         

          <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto">
              <ResourcesTable resources={resources} />
            </div>
          </div>
        </main>
        {/* Fixed Pagination */}
        <Pagination />
      </div>
    </Layout>
  );
}
