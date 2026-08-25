/**
 * Important Note:
 * To generate a JSON object, configure response_format with an object (or an array containing an object) of type text and set its mime_type to application/json. The schema should be provided in the schema field.
 */
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import puppeteer from 'puppeteer';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// This is a JSON Schema object — NOT a runtime data object.
// It's used to tell an LLM (via structured outputs / tool-use / function
// calling) exactly what shape of JSON it must return.
// The model reads this schema and produces a matching JSON object as
// its response, instead of free-form text.
const interviewReportJSONSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number",
            minimum: 0,
            maximum: 100,
            description: "A score indicating how well the user's resume and self-description match the job description, on a scale from 0 to 100."
        },
        technicalQuestions: {
            type: "array",
            description:
                "A list of technical questions that the user might be asked in the interview, along with the intention behind each question and how to answer them.",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string",
                        description: "The technical question that the user might be asked in the interview."
                    },
                    intention: {
                        type: "string",
                        description: "The intention of the interviewer to ask this question."
                    },
                    answer: {
                        type: "string",
                        description: "How to answer this question in the interview, what points to cover."
                    }
                },
                required: ["question", "intention", "answer"],
                additionalProperties: false
            }
        },
        behavioralQuestions: {
            type: "array",
            description:
                "A list of behavioral questions the user might be asked, along with the intention behind each and how to answer them.",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string",
                        description: "The behavioral question that the user might be asked in the interview."
                    },
                    intention: {
                        type: "string",
                        description: "The intention of the interviewer to ask this question."
                    },
                    answer: {
                        type: "string",
                        description: "How to answer this question in the interview, what points to cover."
                    }
                },
                required: ["question", "intention", "answer"],
                additionalProperties: false
            }
        },
        skillGaps: {
            type: "array",
            description:
                "A list of skills the user is lacking and needs to improve, along with the severity of each gap.",
            items: {
                type: "object",
                properties: {
                    skill: {
                        type: "string",
                        description: "The skill that the user is lacking and needs to improve."
                    },
                    severity: {
                        type: "string",
                        // enum restricts the model's output to exactly these 3
                        // values — it cannot invent something like "Critical".
                        enum: ["low", "medium", "high"],
                        description: "The severity of the skill gap, indicating how critical it is for the user to improve this skill."
                    }
                },
                required: ["skill", "severity"],
                additionalProperties: false
            }
        },
        preparationPlan: {
            type: "array",
            description:
                "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
            items: {
                type: "object",
                properties: {
                    day: {
                        type: "integer",
                        minimum: 1,
                        description: "The day number in the preparation plan,starting from 1."
                    },
                    focus: {
                        type: "string",
                        description: "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."
                    },
                    tasks: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        description: "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc."
                    },
                },
                required: ["day", "focus", "tasks"],
                additionalProperties: false
            }
        },
        title: {
            type: "string",
            description: "The title of the job for which the interview report is generated",
            additionalProperties: false,
        }
    },
    // Top-level required fields — ensures the model always returns all
    // four sections rather than omitting one it thinks is less relevant.
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"],
    additionalProperties: false
}

//Above we have defined the schema how the input will be
//This is we have converted that schema with the help of zod
const interviewReportSchema = z.fromJSONSchema(interviewReportJSONSchema)


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
                    Resume:${resume}
                    Self Description:${selfDescription}
                    Job Description:${jobDescription}`

    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: interviewReportJSONSchema
        }
    })

    const response = interviewReportSchema.parse(JSON.parse(interaction.output_text))

    return response

}

//With the help of AI we will be generating HTML Code 
//Puppeteer package converts this HTML Code to a PDF 
//Then we can return this PDF to the user

//This is JSON Schema of generating resume HTML code later which is converted into PDF
const resumePdfJSONSchema = {
    type: "object",
    properties: {
        html: {
            type: "string",
            description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer"
        }
    },
    required: ["html"],
    additionalProperties: false
}

const resumePdfSchema = z.fromJSONSchema(resumePdfJSONSchema)

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an resume for a candidate with the following details:
                    Resume:${resume}
                    Self Description:${selfDescription}
                    Job Description:${jobDescription}
                    
                    the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                    The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                    The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                    you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                    The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                    The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt,
        response_format: {
            //The returned value is still exposed as text containing JSON
            type: 'text',
            mime_type: 'application/json',
            //We will be giving JSON Schema
            schema: resumePdfJSONSchema
        }
    })

    //The schema we get is in JSON format so we now deformat to normal schema
    const jsonContent = resumePdfSchema.parse(JSON.parse(interaction.output_text))

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

//The above given html code generated by AI is given to this function
//With the help of puppeteer we will be converting to PDF file
async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" })
    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pdfBuffer
}

export { generateInterviewReport, generateResumePdf }

