interface TeacherProps {
    name: string;
    image: string;
  }
  
  interface SubjectCardProps {
    title: string;
    image: string;
    schedule: {
      days: string;
      time: string;
    };
    teacher: TeacherProps;
  }
  
  export function SubjectCard({ title, image, schedule, teacher }: SubjectCardProps) {
    return (
      <div className="rounded-lg overflow-hidden border bg-card">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4 space-y-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {schedule.days}: {schedule.time}
          </p>
          <div className="flex items-center gap-3">
            <img
              src={teacher.image}
              alt={teacher.name}
              className="h-8 w-8 rounded-full"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium">{teacher.name}</p>
              <p className="text-xs text-muted-foreground">Teacher</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  