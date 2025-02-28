// import { streamText } from 'ai';
// import { google } from '@ai-sdk/google';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { prompt, model, maxWords, jobDetails, promptTaste } = await req.json()
//   console.log({
//     prompt, model, maxWords, jobDetails, promptTaste
//   })

//   console.log("prompt:", prompt);

//   const systemMessage = `You are a ${promptTaste} proposal writer. Generate a proposal for the following job:
//       Title: ${jobDetails.title}
//       Budget: ${jobDetails.clientBudget}
//       Duration: ${jobDetails.duration}
//       Level: ${jobDetails.experienceLevel}
//       Skills: ${jobDetails.tokens.join(", ")}

//       Keep your response under ${maxWords} words and focus on why you're the perfect candidate for this position.`

//   const result = streamText({
//     model: google(model),
//     temperature: 0.6,
//     maxTokens: maxWords,
//     system: systemMessage,
//     prompt: prompt || "Generate a proposal for this job position.",
//   });

//   return result.toDataStreamResponse();
// }


import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt, model, maxWords, jobDetails, promptTaste } = await req.json();
    console.log({ model })

    // Validate input
    if (!jobDetails) {
      return new Response(JSON.stringify({ error: "Job details are required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ensure model is properly formatted for google provider
    // const cleanModel = model.replace('gpt-', ''); // Remove 'gpt-' prefix if present

    // Default max tokens calculation (approx 1.5 words per token)
    const maxTokens = Math.ceil(maxWords * 1.5);
    // Build a comprehensive system message
    const systemMessage = `You are a ${promptTaste || 'professional'} proposal writer. Generate a proposal for the following job:
      Title: ${jobDetails.title || 'Untitled Position'}
      Budget: ${jobDetails.clientBudget || 'Not specified'}
      Duration: ${jobDetails.duration || 'Not specified'}
      Level: ${jobDetails.experienceLevel || 'Not specified'}
      Skills: ${jobDetails.tokens?.join(", ") || 'Not specified'}

      Keep your response under ${maxWords || 200} words and focus on why you're the perfect candidate for this position.
      Structure your proposal with a brief introduction, your relevant experience, approach to the project, and a conclusion.`;

    // Stream the response
    const result = streamText({
      model: google("gemini-1.5-flash"),
      temperature: 0.6,
      maxTokens: maxTokens,
      system: systemMessage,
      prompt: prompt || "Generate a compelling proposal for this job position that highlights relevant skills and experience.",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
