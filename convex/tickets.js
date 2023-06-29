import { query, mutation } from "./_generated/server";

export const get = query(async ({ db }, userId) => {
  return await db.query("tickets").filter(q => q.eq(q.field("user_id"), userId)).collect();
});

const usersNamedAlex = await db
  .query("users")
  .filter(q => q.eq(q.field("name"), "Alex"))
  .collect();


export const createTicket = mutation(async ({ db }, body) => {
  const {
    user_id = null,
    name = null,
    description = null,
    type = null,
    acceptance_criteria = null,
    how_to_reproduce = null,
    status = null,
  } = body;

  const ticketId = await db.insert("tickets", { user_id, name, description, type, acceptance_criteria, how_to_reproduce, status });

  return ticketId;
});
