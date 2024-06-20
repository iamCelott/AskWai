import express, { Request, Response } from "express";
import { requestToGroqAI } from "./utils/groq";
import cors from "cors";

const app = express();
const port: number = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server Started...");
});

app.post("/chat-to-groq", async (req: Request, res: Response) => {
  const { content }: { content: string } = req.body;
  const { API_KEY }: { API_KEY: string } = req.body;
  try {
    const record = await requestToGroqAI(content, API_KEY);
    return res.json({ record, status: 200 });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Something went wrong", status: 500 });
  }
});

app.listen(port, () => {
  console.log(`Server Started at Port ${port}`);
});
