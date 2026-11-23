# Sticky Notes

Small desktop app built with React, TypeScript and Vite. Implements creating, moving and deleting notes.

## Run locally

Use Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

For a production build and local preview:

```sh
npm run build
npm run preview
```

Run `npm run lint` to check the code.

## Usage

- Choose width and height, click Add Note, then click an empty area of the board.
- Enter text and press Enter or click outside to save. Shift+Enter adds a line break. Text is read-only after saving.
- Drag a note to move it. To delete it, release the pointer inside the Drop to delete zone, which appears while dragging.

## Architecture

NoteBoard owns the notes and the creation state. AppBar contains the size inputs and notifies the board when the user wants to add a note. StickyNote displays each note and handles text entry and pointer events. Notes use a shared TypeScript interface, and styles are split into CSS Modules.

Dragging uses Pointer Events and pointer capture. The starting coordinates are stored in a ref, and a temporary CSS transform moves the note without updating React state on every pointer move. On release, the board either saves the final position or removes the note if the pointer is inside the trash zone. The initial sample notes come from an asynchronous mock in api.ts.

## Notes

- Minimum note size is 120 x 60 pixels. Larger notes are reduced to fit the board, and placement is adjusted at the edges.
- Dragging is limited to the board. Notes are not automatically repositioned when the browser window is resized.
- Resizing notes, editing saved text and keyboard alternatives for placement and dragging are not implemented.
- There is no persistence. Reloading restores the sample notes.
- The app is intended for desktop use at 1024 x 768 or larger.
