import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

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

export default generateInterviewReport

