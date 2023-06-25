import { query, mutation } from "./_generated/server";

export const get = query(async ({ db }) => {
  return await db.query("repo").collect();
});

export const addRepo = mutation(async ({ db }, body) => {
  const {
    user_id = null,
    user_email = null,
    url = null,
    owner = null,
    name = null,
  } = body;

  const repoId = await db.insert("repo", { url, owner, name, user_email, user_id });

  return repoId;
});
