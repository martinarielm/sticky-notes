import { useEffect, useRef, useState } from "react";
import { getNotes } from "../api";
import type { Note } from "../types/note";
import StickyNote from "./StickyNote";
import styles from "./NoteBoard.module.css";
import AppBar from "./AppBar";

export default function NoteBoard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newNote, setNewNote] = useState<Note | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const trashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchNotes() {
      try {
        const response = await getNotes();
        if (!ignore) setNotes(response);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void fetchNotes();

    return () => {
      ignore = true;
    };
  }, []);

  const handleMoveNote = (
    id: string,
    position: Note["position"],
    pointer: { x: number; y: number },
  ) => {
    const trash = trashRef.current?.getBoundingClientRect();
    const shouldDelete = trash &&
      pointer.x >= trash.left && pointer.x <= trash.right &&
      pointer.y >= trash.top && pointer.y <= trash.bottom;

    setNotes((previous) =>
      shouldDelete
        ? previous.filter((note) => note.id !== id)
        : previous.map((note) => (note.id === id ? { ...note, position } : note)),
    );
  };

  const handleAddNote = (width: number, height: number) => {
    setIsCreating(true);

    setNewNote({
      id: crypto.randomUUID(),
      content: "",
      position: { x: 0, y: 0 },
      size: { width, height },
    });
  };

  const handleBoardClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!newNote || event.target !== event.currentTarget) return;

    const board = event.currentTarget;
    const rect = board.getBoundingClientRect();

    const position = {
      x: Math.max(
        0,
        Math.min(
          event.clientX - rect.left,
          board.clientWidth - newNote.size.width,
        ),
      ),
      y: Math.max(
        0,
        Math.min(
          event.clientY - rect.top,
          board.clientHeight - newNote.size.height,
        ),
      ),
    };

    setNotes((prevNotes) => [...prevNotes, { ...newNote, position }]);
    setEditingNoteId(newNote.id);
    setNewNote(null);
    setIsCreating(false);
  };

  const handleSaveContent = (id: string, content: string) => {
    setNotes((previous) =>
      previous.map((note) => (note.id === id ? { ...note, content } : note)),
    );
    setEditingNoteId(null);
  };

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className={styles.workspace}>
      <AppBar
        onCreateNote={handleAddNote}
        disabled={isCreating || editingNoteId !== null}
      />

      <main onClick={handleBoardClick} className={styles.board}>
        {isCreating && (
          <p className={styles.userMessage}>
            Click on the board to place the note
          </p>
        )}
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onDraggingChange={setIsDragging}
            onMove={handleMoveNote}
            onSaveContent={handleSaveContent}
            isEditing={editingNoteId === note.id}
          />
        ))}

        {isDragging && <div ref={trashRef} className={styles.trashZone}>Drop to delete</div>}
      </main>
    </div>
  );
}
