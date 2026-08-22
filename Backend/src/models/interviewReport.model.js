import mongoose from "mongoose"

/**
 * This data is all from the user
 * 1. Job Description Schema : String
 * 2. Resume Text : String
 * 3. Self Description : String
 * 
 * With the help of AI we will generate these and also store them in the DB
 * So that the user can see them later if needed
 * 4. Match Score : Number
 * 5. Technical Questions : (
 *      There will be multiple questions for each question there will be answer;
 *      what is the intention of the interviwer to ask this question )
 *              [{
 *                  Question:
 *                  Intention:
 *                  Answer:
 *              }]
 * 6. Behavioral Questions : 
 *              [{
 *                  Question:
 *                  Intention:
 *                  Answer:
 *              }]
 * 7. Skill Gaps : (
 *       It is same as the above but here the severity meaning is that, 
 *       is the skill can be learned in few number of days or not)
 *              [{
 *                  Skill:
 *                  Severity:{
 *                      Type:
 *                      Enum:[Low,Medium,High]
 *                   }
 *              }]
 * 8. Preparation Plan : 
 *              [{
 *                  Day:
 *                  Focus:
 *                  Tasks:
 *              }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required."]
    },
    intention: {
        type: String,
        required: [true, "Intention is required."]
    },
    answer: {
        type: String,
        required: [true, "Answer is required."]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Behavioral question is required."]
    },
    intention: {
        type: String,
        required: [true, "Intention is required."]
    },
    answer: {
        type: String,
        required: [true, "Answer is required."]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is Required."]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is Required."]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required."]
    },
    focus: {
        type: String,
        required: [true, "Focus is required."]
    },
    tasks: [{
        type: String,
        required: [true, "Tasks are required."]
    }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job Description is Required."]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    //For every interview report generation there will be a user related to it
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [true, "Job title is required."]
    }
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)

export default interviewReportModel