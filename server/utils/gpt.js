const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config();
const pdf = require("pdf-parse-new");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);

async function getResumeText(path) {
  let dataBuffer = fs.readFileSync(path);
  let data = await pdf(dataBuffer);
  const model = await genAI.getGenerativeModel({
    // Choose a Gemini model.
    model: "gemini-1.5-pro",
  });
  const prompt = data.text + " roast my resume to extreme level";
  console.log(prompt);
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
    return text;
  } catch (err) {
    return "Looks like the resume contained something that I can't process. Please try again with a different resume.";
  }
}

module.exports = getResumeText;
