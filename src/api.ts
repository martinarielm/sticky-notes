import type { Note } from "./types/note";

const notes: Note[] = [
  {
    id: crypto.randomUUID(),
    content: "Lorem ipsum dolor sit amet...",
    position: { x: 120, y: 90 },
    size: { width: 200, height: 60 },
  },
  {
    id: crypto.randomUUID(),
    content: "Consectetur adipiscing elit...",
    position: { x: 350, y: 60 },
    size: { width: 300, height: 75 },
  },
  {
    id: crypto.randomUUID(),
    content:
      "...sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    position: { x: 200, y: 170 },
    size: { width: 280, height: 90 },
  },
];

export async function getNotes(): Promise<Note[]> {
  const response = await Promise.resolve(notes);
  return response;
}
