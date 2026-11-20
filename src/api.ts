import type { Note } from "./types/note";

const notes: Note[] = [
  {
    id: crypto.randomUUID(),
    content: "Note 1",
    position: { x: 10, y: 10 },
    size: { width: 120, height: 60 },
  },
  {
    id: crypto.randomUUID(),
    content: "Note 2",
    position: { x: 120, y: 150 },
    size: { width: 200, height: 75 },
  },
];

export async function getNotes(): Promise<Note[]> {
  const response = await Promise.resolve(notes);
  return response;
}
