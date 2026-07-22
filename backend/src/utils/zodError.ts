import { ZodError } from "zod";

export function zodFieldErrors(err: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path[0]?.toString() ?? "_root";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}
