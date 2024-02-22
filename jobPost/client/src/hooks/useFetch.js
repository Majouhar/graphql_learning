import { useEffect, useState } from "react";
import { APIStatus } from "../enum/status";

export const useFetch = (apiCall) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [apiStatus, setApiStatus] = useState(APIStatus.LOADING);
  useEffect(() => {
    apiCall()
      .then((data) => {
        setData(data);
        setApiStatus(APIStatus.SUCCESS);
      })
      .catch((e) => {
        setApiStatus(APIStatus.ERROR);
        setError(e.response.errors);
      });
  }, []);
  return [data, error, apiStatus];
};
