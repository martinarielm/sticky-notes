import { useRef } from "react";
import type { Note } from "../types/note";
import styles from "./StickyNote.module.css";

interface DragRef {
  pointerId: number;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

interface StickyNoteProps {
  note: Note;
  onDraggingChange: (isDragging: boolean) => void;
  onSaveContent: (id: string, content: string) => void;
  onMove: (id: string, position: Note["position"], pointer: { x: number; y: number }) => void;
  isEditing: boolean;
}

export default function StickyNote({
  note,
  onSaveContent,
  onMove,
  isEditing,
  onDraggingChange,
}: StickyNoteProps) {
  const dragRef = useRef<DragRef | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isEditing || event.button !== 0) return;

    event.preventDefault();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      initialX: note.position.x,
      initialY: note.position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    onDraggingChange(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    event.currentTarget.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;

    const position = {
      x: drag.initialX + event.clientX - drag.startX,
      y: drag.initialY + event.clientY - drag.startY,
    };

    const element = event.currentTarget;
    element.style.left = `${position.x}px`;
    element.style.top = `${position.y}px`;
    element.style.transform = "";

    dragRef.current = null;
    onMove(note.id, position, { x: event.clientX, y: event.clientY });
    onDraggingChange(false);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;

    event.currentTarget.style.transform = "";
    dragRef.current = null;
    onDraggingChange(false);
  };

  return (
    <div
      className={styles.note}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handlePointerCancel}
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
      }}
    >
      <textarea
        aria-label="Note text"
        autoFocus={isEditing}
        className={styles.content}
        defaultValue={note.content}
        id={`note-content-${note.id}`}
        onBlur={(e) => {
          if (isEditing) onSaveContent(note.id, e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        readOnly={!isEditing}
      />
    </div>
  );
}
