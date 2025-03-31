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

export function SubjectCard({
  title,
  image,
  schedule,
  teacher,
}: SubjectCardProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-[#F0F0F0] bg-card">
      <div className="aspect-video relative">
        <img
          src={image}
          alt={title}
          className="rounded-lg object-cover mt-2 mx-auto w-[92%] h-full"
        />
      </div>
      <div className="p-4 ">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="font-manrope text-base text-[030E18] ">
          <span className="text-base text-[#7D7D7D]"> {schedule.days}: </span>{" "}
          {schedule.time}
        </p>
        <div className="flex items-center mt-4 gap-3">
          <img
            src={teacher.image}
            alt={teacher.name}
            className="h-8 w-8 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium">{teacher.name}</p>
            <p className="text-xs text-muted-foreground">Teacher</p>
          </div>
        </div>
      </div>
    </div>
  );
}
