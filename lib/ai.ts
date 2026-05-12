import { GoogleGenerativeAI } from "@google/generative-ai";
import { Job } from "@/types/job";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY!
);

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

export async function generateAISummary(jobs: Job[]) {
  const simplified = jobs.slice(0, 50).map((j) => ({
    prefix: j.prefix,
    pendingDays: j.pendingDays,
    customer: j.Customer,
    aging: j.agingBucket,
  }));

  const prompt = `
You are a logistics analytics expert.

Analyze this outstanding jobs data and generate:

1. Business Summary
2. Key Risks
3. Delayed Shipments
4. Missing Data Warnings
5. Operational Insights

Data:
${JSON.stringify(simplified)}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}
