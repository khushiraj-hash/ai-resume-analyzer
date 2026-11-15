
const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// Retry Gemini requests for temporary API errors
async function generateContentWithRetry(options, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await ai.models.generateContent(options)
        } catch (error) {
            const status = error.status
            const isRetryable = [429, 500, 502, 503, 504].includes(status)

            if (!isRetryable || attempt === maxRetries) {
                throw error
            }

            const delay = 1000 * Math.pow(2, attempt - 1)

            console.log(`Gemini API error ${status}. Retrying in ${delay / 1000}s...`)

            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }
}

// Interview report schema
const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    title: z.string()
})

// Generate interview report
async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    const prompt = `
        Generate a detailed interview preparation report.

        Resume:
        ${resume}

        Self Description:
        ${selfDescription || "Not provided"}

        Job Description:
        ${jobDescription}

        Return JSON with these exact field names:
        - match_score: number between 0 and 100
        - job_title: string
        - technical_questions: array of objects with question, intention, answer
        - behavioral_questions: array of objects with question, intention, answer
        - missing_or_weak_skills: array of objects with skill and severity (low, medium, high)
        - preparation_plan: array of objects with day, focus and tasks (array of strings)

        Important:
        - Technical and behavioral questions must be objects, not strings.
        - Give useful, specific sample answers.
        - Do not invent candidate experience or qualifications.
        - Always provide every field.
    `

    const response = await generateContentWithRetry({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
    responseMimeType: "application/json",
    responseSchema: {
        type: "OBJECT",
        properties: {
            match_score: {
                type: "NUMBER"
            },
            job_title: {
                type: "STRING"
            },
            technical_questions: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        question: { type: "STRING" },
                        intention: { type: "STRING" },
                        answer: { type: "STRING" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behavioral_questions: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        question: { type: "STRING" },
                        intention: { type: "STRING" },
                        answer: { type: "STRING" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            missing_or_weak_skills: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        skill: { type: "STRING" },
                        severity: { type: "STRING", enum: ["low", "medium", "high"] }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparation_plan: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        day: { type: "INTEGER" },
                        focus: { type: "STRING" },
                        tasks: {
                            type: "ARRAY",
                            items: { type: "STRING" }
                        }
                    },
                    required: ["day", "focus", "tasks"]
                }
            }
        },
        required: [
            "match_score",
            "job_title",
            "technical_questions",
            "behavioral_questions",
            "missing_or_weak_skills",
            "preparation_plan"
        ]
    }
}
    })

    console.log("RAW GEMINI RESPONSE:", response.text)

    if (!response.text) {
        throw new Error("Gemini returned an empty response.")
    }

    let rawReport

    try {
        rawReport = JSON.parse(response.text)
    } catch (error) {
        console.error("JSON parsing failed:", error)
        throw new Error("Gemini returned invalid JSON.")
    }

    console.log("PARSED GEMINI RESPONSE:", rawReport)

    // Normalize Gemini's snake_case fields into our app's camelCase schema
    const report = {
        matchScore: rawReport.match_score,
        technicalQuestions: rawReport.technical_questions,
        behavioralQuestions: rawReport.behavioral_questions,
        skillGaps: rawReport.missing_or_weak_skills,
        preparationPlan: rawReport.preparation_plan,
        title: rawReport.job_title
    }

    const validatedReport = interviewReportSchema.parse(report)

    if (!validatedReport.title.trim()) {
        throw new Error("Gemini did not return a valid job title.")
    }

    return validatedReport
}

// Generate PDF from HTML
async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()

    try {
        const page = await browser.newPage()

        await page.setContent(htmlContent, {
            waitUntil: "networkidle0"
        })

        return await page.pdf({
            format: "A4",
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            },
            printBackground: true
        })
    } finally {
        await browser.close()
    }
}

// Generate tailored resume PDF
async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {
    const resumePdfSchema = z.object({
        html: z.string()
    })

    const prompt = `
        Generate a professional, ATS-friendly resume using the following details.

        Existing Resume:
        ${resume}

        Self Description:
        ${selfDescription || "Not provided"}

        Job Description:
        ${jobDescription}

        Requirements:
        - Tailor the resume to the job description.
        - Highlight relevant skills and experience.
        - Keep it approximately 1-2 pages.
        - Use a simple, professional design.
        - Make the content sound natural and human-written.
        - Do not invent qualifications, experience or achievements.
        - Return valid HTML inside a JSON object with a single field named "html".
    `

    const response = await generateContentWithRetry({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema)
        }
    })

    if (!response.text) {
        throw new Error("Gemini returned an empty resume response.")
    }

    const jsonContent = JSON.parse(response.text)
    const validatedContent = resumePdfSchema.parse(jsonContent)

    return await generatePdfFromHtml(validatedContent.html)
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
}
