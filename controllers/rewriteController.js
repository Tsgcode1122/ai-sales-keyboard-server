import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const toneMap = {
  professional: "professional, clear, and confident",
  friendly: "friendly, warm, and natural",
  short: "very short, direct, and clear",
  persuasive: "persuasive but not pushy",
};

export const rewriteText = async (req, res) => {
  try {
    const { text, tone = "professional" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    if (text.length > 2000) {
      return res.status(413).json({ error: "Text too long" });
    }

   const instruction = `
You are a REWRITE engine for Instagram DMs.

Task: rewrite the user's text in a ${toneMap[tone] || toneMap.professional} tone.

Hard rules (must follow):
- ONLY rewrite the text. DO NOT answer it.
- Keep the same meaning and the same intent.
- If the input is a question, the output MUST remain a question (do not add answers).
- Do NOT add new information, prices, promises, guarantees, links, or details.
- Keep it short (DM style).
- Keep emojis ONLY if the user used emojis.
- Output ONLY the rewritten message. No extra words, no labels.

Examples:
Input: "How much is it?"
Output: "How much does it cost?"

Input: "Do you deliver to New York?"
Output: "Do you deliver to New York?"
`.trim();


   
const response = await client.responses.create({
  model: "gpt-5-nano",
reasoning: {
    effort: "minimal",
  },


  text: { verbosity: "low" },

  max_output_tokens: 120,
  input: [
    { role: "system", content: instruction },
    { role: "user", content: text },
  ],
});

    const improvedText = response.output_text?.trim();

    res.status(200).json({ improvedText });
    console.log(improvedText);
    
  } catch (error) {
    console.error("Rewrite error:", error);
    res.status(500).json({ error: "AI rewrite failed" });
  }
};
