import { Groq } from "groq-sdk";

export const requestToGroqAI = async (content: string, API_KEY: string) => {
  const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
  const reply = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content,
      },
    ],
    model: "llama3-8b-8192",
  });
  return reply.choices[0]?.message?.content || "";
};
