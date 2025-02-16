import { z } from "zod";

export const createNewPromptSchema = z.object({
  name: z.string().min(3, {
    message: "name is required of minimum 3 characters"
  }),
  prompt: z.string().min(20, {
    message: "prompt is required of minimum 20 words"
  }).max(2000, {
    message: "prompt too long, max 2000 words"
  }),
  visibility: z.string(),
  tags: z.string().array(),
  defaultPrompt: z.boolean(),
  category: z.string()
})


export type CreateNewPromptSchemaType = z.infer<typeof createNewPromptSchema>
