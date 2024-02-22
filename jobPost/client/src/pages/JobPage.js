import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { useEffect, useState } from "react";
import { deleteJob, getJob, updateJob } from "../lib/graphql/queries";
import { APIStatus } from "../enum/status";
import { useFetch } from "../hooks/useFetch";

function JobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, error, apiStatus] = useFetch(() => getJob(jobId));
  console.log(error);
  if (apiStatus == APIStatus.LOADING) {
    return <p> Loading...</p>;
  } else if (apiStatus == APIStatus.ERROR) {
    return (
      <div>
        <p>Error </p>
        <ul>
          {error.map((er, index) => (
            <li key={index}>{er.message}</li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div>
      <h1 className="title is-2">{job.title}</h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div>
        <button>Edit</button>
        <button
          onClick={() => {
            deleteJob(jobId);
            navigate("/");
          }}
        >
          Delete
        </button>
      </div>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job.date, "long")}
        </div>
        <p className="block">{job.description}</p>
      </div>
    </div>
  );
}

export default JobPage;
