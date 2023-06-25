import { query, mutation } from "./_generated/server";

export const get = query(async ({ db }) => {
  return await db.query("repo").collect();
});

export const addRepo = mutation(async ({ db }, body) => {
  const {
    url = null,
    owner = null,
    name = null,
  } = body;

  const repoId = await db.insert("repo", { url, owner, name });

  return repoId;
});
