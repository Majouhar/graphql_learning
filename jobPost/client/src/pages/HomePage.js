import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../lib/graphql/queries";
import PaginationBar from "../components/PaginationBar";

const JOBS_PER_PAGE = 3;
function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    getJobs(JOBS_PER_PAGE, JOBS_PER_PAGE * (currentPage - 1)).then(setJobs);
  }, [currentPage]);
  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <JobList jobs={jobs?.items ?? []} />
    </div>
  );
}

export default HomePage;
