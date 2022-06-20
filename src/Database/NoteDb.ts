import { INoteContent, INode2Note, dbClass } from "./index";
import { ADbFunctions } from "./BaseDb";
import { EbookFunctions } from "./EbookDb";

export class NoteFunctions extends ADbFunctions {
  async getNote(noteId: number) {
    return NoteFunctions.db.notesTable.get(noteId);
  }

  async updateNote(noteId: number, noteUpdated: INoteContent) {
    return NoteFunctions.db.transaction(
      "rw",
      NoteFunctions.db.notesTable,
      async () => {
        return NoteFunctions.db.notesTable.update(noteId, noteUpdated);
      }
    );
  }

  async addNote(note: INoteContent) {
    return NoteFunctions.db.transaction(
      "rw",
      NoteFunctions.db.notesTable,
      async () => {
        return NoteFunctions.db.notesTable.add(note, note.NoteId);
      }
    );
  }

  async deleteNote(noteId: number) {
    return NoteFunctions.db.transaction(
      "rw",
      NoteFunctions.db.node2NoteTable,
      NoteFunctions.db.notesTable,
      () => {
        NoteFunctions.db.node2NoteTable.each((node) => {
          if (node.NoteList.includes(noteId)) {
            NoteFunctions.db.node2NoteTable.update(node, {
              NoteList: node.NoteList.filter((id) => id !== noteId),
            });
          }
        });
        return NoteFunctions.db.notesTable
          .where("NoteId")
          .equals(noteId)
          .delete();
      }
    );
  }

  async getNotesArray() {
    return NoteFunctions.db.notesTable.toArray();
  }

  async getNoteArrayByNoteIdArray(noteIdArray: number[]) {
    return NoteFunctions.db.notesTable
      .where("NoteId")
      .anyOf(noteIdArray)
      .toArray();
  }

  async addNewNote(noteContentInput: string, ebookId?: number) {
    const newNote: INoteContent = {
      NoteContent: noteContentInput,
      EbookId: ebookId ? ebookId : undefined,
    };
    return await NoteFunctions.db.notesTable.add(newNote);
  }

  async updateNoteContentAndEbookId(
    noteId: number,
    noteContentInput: string,
    ebookId?: number
  ) {
    const newNote: INoteContent = {
      NoteContent: noteContentInput,
      EbookId: ebookId ? ebookId : undefined,
    };
    NoteFunctions.db.notesTable.get(noteId).then((note) => {
      if (note.EbookId !== newNote.EbookId) {
        dbClass.linkEbookToNote(newNote.EbookId, noteId);
      }
    });
    return await NoteFunctions.db.notesTable.update(noteId, newNote);
  }
}
