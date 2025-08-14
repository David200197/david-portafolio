import { JobContainer } from "../components/JobContainer";
import { JobCard } from "../components/JobCard";
import { Jobs } from "../entities/jobs";

type Props = { jobs: Jobs };

export const JobSection = ({ jobs }: Props) => (
  <JobContainer id="jobs">
    <h1 className="text-center text-2xl">{jobs.getSectionTitle()}</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-[10px] md:mx-[30px] lg:mx-[30px] xl:mx-[160px] mt-4">
      {jobs.getJobs().map((job) => (
        <JobCard key={job.image} job={job} />
      ))}
    </div>
  </JobContainer>
);
