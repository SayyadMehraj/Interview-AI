import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

/**
 * @description Generates an interview report by sending the job description, self-description, and resume file to the backend API.
 * @param {Object} params - The parameters for generating the interview report.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    //We are creating form data because whenever we need to send files to backend
    //It is possible through form data 

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)


    try {
        const response = await api.post("/api/interview", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
    }

}

/**
 * @description Fetches an interview report by its ID from the backend API.
 * @param {string} interviewId - The ID of the interview report to fetch.
 */
export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

/**
 * @description Fetches all interview reports for the authenticated user from the backend API.
 */
export const getAllInterviewReports = async () => {
    try {
        const response = await api.get("/api/interview/")

        return response.data
    } catch (error) {
        console.log(error)
    }
}