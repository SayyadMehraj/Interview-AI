//This is used to set the states of the interview
import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  //Loading state
  const [loading, setLoading] = useState(false);

  //Single Report -> Intially there will be no reports
  const [report, setReport] = useState(null);

  //Multiple reports -> Intially empty array
  const [reports, setReports] = useState([]);

  return(
    <InterviewContext.Provider value={{loading,setLoading,report,setReport,reports,setReports}}>
        {children}
    </InterviewContext.Provider>
  )
}
