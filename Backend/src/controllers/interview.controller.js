import { PDFParse } from 'pdf-parse';
//Getting the ai service
import generateInterviewReport from '../services/ai.service.js';
//Getting the interview model
import interviewReportModel from '../models/interviewReport.model.js';

/**
 * @name generateInterviewReportController
 * @description Recieves a pdf from the user, extracts text from it and also takes selfDescription & jobDescription, sends all this information to AI to generate Interview Report
 * @access Private
 */
async function generateInterviewReportController(req, res) {

    try {
        //Is pdf given by the user or not
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required."
            })
        }

        //Are descriptions given or not
        const { selfDescription, jobDescription } = req.body

        //If selfDescription is not provided or is empty after trimming whitespace, return a 400 error
        if (!selfDescription?.trim()) {
            return res.status(400).json({
                message: "Self Description is required."
            })
        }

        //If jobDescription is not provided or is empty after trimming whitespace, return a 400 error
        if (!jobDescription?.trim()) {
            return res.status(400).json({
                message: "Job Description is required."
            })
        }

        //Creater parser Instance and also sending the pdf which we got from the multer through request
        const parser = new PDFParse({
            data: req.file.buffer
        })

        //Extract text from pdf
        const resumeContent = await parser.getText();

        if (!resumeContent.text?.trim()) {
            return res.status(400).json({
                message: "Could not extract text from the uploaded PDF."
            });
        }

        //console.log(resumeContent.text)

        const interviewReportByAI = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAI
            /**
             * The spread operator is approximately equivalent to:
             * matchScore: interviewReportByAI.matchScore,
             * technicalQuestions: interviewReportByAI.technicalQuestions,
             * behavioralQuestions: interviewReportByAI.behavioralQuestions,
             * skillGaps: interviewReportByAI.skillGaps,
             * preparationPlan: interviewReportByAI.preparationPlan
             */
        })


        res.status(201).json({
            message: "Interview Report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Generate interview report error:", error);

        return res.status(500).json({
            message: "Failed to generate interview report."
        });
    }

}

/**
 * @name getInterviewReportByIdController
 * @description Gets the interview report by interview-id
 * @access Private
 */
async function getInterviewReportByIdController(req, res) {

    //We will be getting the interview id from the url
    const { interviewId } = req.params

    //find the interview report from the database
    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
    })

    //If such interview report doesn't exist
    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview Report Not Found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })

}

/**
 * @name
 * @description Get all the interview reports of logged-in user
 * @access Private
 */
async function getAllInterviewReportsController(req, res) {

    const interviewReports = await interviewReportModel
        .find({
            user: req.user.id
        })
        .sort({
            createdAt: -1
        })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview Reports fetched successfully.",
        interviewReports
    })
}

export { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController }