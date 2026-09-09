// Docs page: Logs (house component)
import type { Doc } from "../../site";

export const doc: Doc = {
  id: "logs",
  title: "Logs",
  lede: "Striped 30px mono rows: time, method, status, host, path.",
  tags: ["acme-logs"],
  house: true,
  examples: [
    {
      h: "Default",
      html: `<acme-logs rows='[{"time":"12:02:14","method":"GET","status":200,"host":"acme.vercel.app","path":"/api/tasks"},{"time":"12:02:15","method":"POST","status":201,"host":"acme.vercel.app","path":"/api/tasks"},{"time":"12:02:19","method":"GET","status":500,"host":"acme.vercel.app","path":"/api/tasks/42"}]'></acme-logs>`,
    },
  ],
};
