"use client"
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
  // Add more items to match the screenshot
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
          <div>
            <h1 className="text-2xl font-semibold">Resources</h1>
            <p className="text-muted-foreground">
              Everything your teachers shared for you!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search" className="pl-8" />
            </div>
            <Button className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800">
              <Download className="mr-2 h-4 w-4" /> Download All
            </Button>
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
