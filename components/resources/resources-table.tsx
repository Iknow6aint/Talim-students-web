import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Image, Video, AlignLeft, Download } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  subject: string;
  uploadDate: string;
  teacherName: string;
  type: "pdf" | "img" | "vid" | "txt";
}

const getFileIcon = (type: Resource["type"]) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-4 w-4" />;
    case "img":
      return <Image className="h-4 w-4" />;
    case "vid":
      return <Video className="h-4 w-4" />;
    case "txt":
      return <AlignLeft className="h-4 w-4" />;
  }
};

interface ResourcesTableProps {
  resources: Resource[];
}

export function ResourcesTable({ resources }: ResourcesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {" "}
            <Checkbox /> Name
          </TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Upload Date</TableHead>
          <TableHead>Teacher's Name</TableHead>
          <TableHead>Download file</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.map((resource) => (
          <TableRow key={resource.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getFileIcon(resource.type)}
                <span>{resource.name}</span>
              </div>
            </TableCell>
            <TableCell>{resource.subject}</TableCell>
            <TableCell className="text-[#616161]">{resource.uploadDate}</TableCell>
            <TableCell>{resource.teacherName}</TableCell>
            <TableCell className="bg-[#ADBECE] hover:bg-blue-200">
              <button className="flex items-center justify-center w-full py-4 text-sm text-white  transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
