import fs from "fs"
import path from "path"
import { faker } from "@faker-js/faker"

import { labels, priorities, statuses } from "./data"

const tasks = Array.from({ length: 20 }, () => ({
  id: `TASK-${faker.datatype.number({ min: 1000, max: 9999 })}`,
  title: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
  type: faker.helpers.arrayElement(labels).value,
  description: faker.lorem.paragraph(),
  acceptance_criteria: faker.lorem.paragraph(),
  how_to_reproduce: faker.lorem.paragraph(),
  status: faker.helpers.arrayElement(statuses).value,
  priority: faker.helpers.arrayElement(priorities).value,
}))

fs.writeFileSync(
  path.join(__dirname, "tasks.json"),
  JSON.stringify(tasks, null, 2)
)

console.log("✅ Tasks data generated.")