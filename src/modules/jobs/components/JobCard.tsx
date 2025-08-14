import { PersonalDetailIcon } from "@/modules/core/components/PersonalDetailIcon";
import { Job } from "../entities/job";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/core/ui/card";
import { Button } from "@/modules/core/ui/button";
import { Badge } from "@/modules/core/ui/badge";

type Props = { job: Job };
export const JobCard = ({ job }: Props) => (
  <Card className="hover:shadow-xl transition duration-600 ease-in-out" >
    <CardHeader>
      <div className="flex">
        <img
          src={job.logoSrc}
          alt={job.title}
          width={30}
          className="mr-3 object-contain"
        />
        <div>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>{job.time}</CardDescription>
        </div>
        {job.isPrivate() && (
          <CardAction className="ml-auto">
            <Badge className="bg-slate-500">PRIVATE</Badge>
          </CardAction>
        )}
      </div>
    </CardHeader>
    <img src={job.image} alt={job.alt} className="object-cover h-[200px]" />
    <CardContent>
      <p>{job.description}</p>
    </CardContent>
    <CardFooter className="mt-auto">
      <div className="flex justify-between items-center w-full">
        <div className="flex">
          {job.skills.map((skill) => (
            <PersonalDetailIcon
              personalDetail={skill}
              key={"job_card_" + skill.icon}
              width={22}
              height={22}
              color="#000"
              fill="#000"
              className="mr-3"
            />
          ))}
        </div>
        <div>
          {job.isPublic() && (
            <Button asChild>
              <a href={job.link} target="_blank">
                VIEW
              </a>
            </Button>
          )}
        </div>
      </div>
    </CardFooter>
  </Card>
);
