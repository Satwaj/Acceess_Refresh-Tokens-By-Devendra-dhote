
instead of pure JSON.

Create:

```ts
export function cleanAiJson(response: string): string {
  return response
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export function parseAiJson<T>(response: string): T {
  const cleaned = cleanAiJson(response);

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error("AI returned invalid JSON");
  }
}
