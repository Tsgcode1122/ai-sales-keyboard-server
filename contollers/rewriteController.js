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
You are a sales assistant for Instagram DMs.
Rewrite the message to sound ${toneMap[tone] || toneMap.professional}.
Rules:
- Keep the original meaning
- Keep it short (DM style)
- Do NOT invent prices, guarantees, or promises
- Keep emojis only if user already used emojis
Return ONLY the rewritten message.
`.trim();

    const response = await client.responses.create({
      model: "gpt-5.2-mini",
      input: [
        { role: "system", content: instruction },
        { role: "user", content: text },
      ],
    });

    const improvedText = response.output_text?.trim();

    res.status(200).json({ improvedText });
  } catch (error) {
    console.error("Rewrite error:", error);
    res.status(500).json({ error: "AI rewrite failed" });
  }
};
