import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  acceptance_criteria: z.string(),
  how_to_reproduce: z.string(),
  status: z.string(),
  priority: z.string(),
})

export type Task = z.infer<typeof taskSchema>