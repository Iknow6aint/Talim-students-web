'use client'

import { Bell, Calendar, ChevronDown, FileText, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface Subject {
  name: string
  testScore: number
  examScore: number
  totalScore: number
}

const subjects: Subject[] = [
  { name: "Mathematics", testScore: 24, examScore: 56, totalScore: 80 },
  { name: "English Language", testScore: 27, examScore: 61, totalScore: 88 },
  { name: "Basic Science", testScore: 18, examScore: 54, totalScore: 72 },
  { name: "Social Studies", testScore: 30, examScore: 65, totalScore: 85 },
  { name: "Computer Studies", testScore: 22, examScore: 62, totalScore: 84 },
  { name: "Creative Arts", testScore: 25, examScore: 59, totalScore: 84 },
]

export default function ResultsDashboard() {
  const totalTestScore = subjects.reduce((sum, subject) => sum + subject.testScore, 0)
  const totalExamScore = subjects.reduce((sum, subject) => sum + subject.examScore, 0)
  const totalScore = subjects.reduce((sum, subject) => sum + subject.totalScore, 0)

  return (
    <div className=" h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto container space-y-10">

        {/* Results Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Results</h1>
            <p className="text-sm text-gray-500">Everything your teachers shared for you!</p>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  View <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Current Term</DropdownMenuItem>
                <DropdownMenuItem>Previous Term</DropdownMenuItem>
                <DropdownMenuItem>All Results</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className=" bg-blue-900 hover:bg-blue-800">Download Results</Button>
          </div>
        </div>

        {/* Results Table */}
        <div className="rounded-lg border bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  
                </TableHead>
                <TableHead className="  ">
                    <div className="flex items-center gap-2">
                    <Checkbox className="h-4 w-4 text-gray-500" />
                    Subject
                    </div>
                
                    </TableHead>
                <TableHead className="text-left">Test Score (30%)</TableHead>
                <TableHead className="text-left">Exam Score (70%)</TableHead>
                <TableHead className="text-left">Total Score (100%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.name}>
                  <TableCell className="w-[40px]">
                 
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {subject.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-left">{subject.testScore}</TableCell>
                  <TableCell className="text-left">{subject.examScore}</TableCell>
                  <TableCell className="text-left">{subject.totalScore}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold">
                <TableCell></TableCell>
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-left">{totalTestScore}</TableCell>
                <TableCell className="text-left">{totalExamScore}</TableCell>
                <TableCell className="text-left">{totalScore}/600</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

