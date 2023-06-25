import { query, mutation } from "./_generated/server";

export const get = query(async ({ db }) => {
  return await db.query("tickets").collect();
});

export const createTicket = mutation(async ({ db }, body) => {
  const {
    name = null,
    description = null,
    type = null,
    acceptance_criteria = null,
    how_to_reproduce = null,
    status = null,
  } = body;

  const ticketId = await db.insert("tickets", { name, description, type, acceptance_criteria, how_to_reproduce, status });

  return ticketId;
});
