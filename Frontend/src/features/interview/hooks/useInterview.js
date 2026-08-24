import { generateInterviewReport, getInterviewReportById, getAllInterviewReports } from "../services/interview.api.js"
import { InterviewContext } from "../interview.context.jsx"
import { useContext,useEffect } from "react"
import { useParams } from "react-router"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {

        setLoading(true)
        let response = null

        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport

    }

    const getReportById = async (interviewId) => {

        setLoading(true)
        let response = null

        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null

        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReports
    }

    //This is similar to the useEffect in useAuth.js where we are checking if the user is on the interview page or on the home page
    //Here were already currently a user generated a report and when an user reloads a page then it shows the same report
    //This is rehydrating 
    useEffect(() => {
        if(interviewId){
            getReportById(interviewId)
        }else{
            getReports()
        }
    },[interviewId])

    return { loading, report, reports, generateReport, getReportById, getReports }
}
