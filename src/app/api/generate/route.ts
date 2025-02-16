import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, model, maxWords, jobDetails, promptTaste } = await req.json()
  console.log({
    prompt, model, maxWords, jobDetails, promptTaste
  })

  const systemMessage = `You are a ${promptTaste} proposal writer. Generate a proposal for the following job:
      Title: ${jobDetails.title}
      Budget: ${jobDetails.clientBudget}
      Duration: ${jobDetails.duration}
      Level: ${jobDetails.experienceLevel}
      Skills: ${jobDetails.tokens.join(", ")}

      Keep your response under ${maxWords} words and focus on why you're the perfect candidate for this position.`

  const result = streamText({
    model: google(model),
    temperature: 0.6,
    maxTokens: maxWords,
    system: systemMessage,
    prompt: prompt || "Generate a proposal for this job position.",
  });

  return result.toDataStreamResponse();
}
