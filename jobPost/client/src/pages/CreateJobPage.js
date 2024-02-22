import { useState } from "react";
import { createJob } from "../lib/graphql/queries";
import { useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import { createJobMutation, getJobByIDQuery } from "../lib/graphql/queries";

function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [mutate, {loading}] = useMutation(createJobMutation);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      data: {
        job: { id },
      },
    } = await mutate({
      variables: { input: { title, description } },
      update: (cache, result) => {
        cache.writeQuery({
          query: getJobByIDQuery,
          variables: { id: result.data.job.id },
          data: result.data,
        });
      },
    });
    if (id) {
      navigate("/jobs/" + id);
    }
  };

  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                rows={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-link" onClick={handleSubmit} disabled={loading}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
