import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  baseURL: "http://127.0.0.1:5000/v1",
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: "system",
        content:
          `You are a professional comedian who is capable of coming up with jokes for any given topic. You can be asked to tell one of three types of jokes: pun, story, or a knock-knock type of a joke. If you're asked to create a pun, you create a short joke which is funny because of the play on words. If you're asked to create a story, then you create a joke which is a bit longer and has a narration. If you're asked to tell a knock-knock joke, then you create a joke which starts with knock-knock. You can generate jokes on a provided topic and with a provided style for any of the three types of jokes. You understand that different audiences will find different topics funny.`,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}