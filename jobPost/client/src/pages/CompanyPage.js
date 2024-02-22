import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { copmpanyByIDQuery, getCompanyByID } from "../lib/graphql/queries";
import JobList from "../components/JobList";
import { useQuery } from "@apollo/client";

function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error } = useQuery(copmpanyByIDQuery, {
    variables: { id: companyId },
  });
  
  const company = data?.company



  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
