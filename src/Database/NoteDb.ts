import { INoteContent, INode2Note, dbClass } from "./index";
import { ADbFunctions } from "./BaseDb";
import { EbookFunctions } from "./EbookDb";

export class NoteFunctions extends ADbFunctions {
  async getNote(noteId: number) {
    return NoteFunctions.db.transaction(
      "r",
      NoteFunctions.db.notesTable,
      async () => {
        return NoteFunctions.db.notesTable.get(noteId);
      }
    );
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
      NoteFunctions.db.ebooksTable,
      async () => {
        await NoteFunctions.db.node2NoteTable.each((node) => {
          if (node.NoteList.includes(noteId)) {
            NoteFunctions.db.node2NoteTable.update(node, {
              NoteList: node.NoteList.filter((id) => id !== noteId),
            });
          }
        });
        await NoteFunctions.db.ebooksTable.each((ebook) => {
          if (ebook.NoteList.includes(noteId)) {
            NoteFunctions.db.ebooksTable.update(ebook, {
              NoteList: ebook.NoteList.filter((id_1) => id_1 !== noteId),
            });
          }
        });
        return await NoteFunctions.db.notesTable
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

    return await this.addNote(newNote).then((note) => {
      if (ebookId) {
        dbClass.linkEbookToNote(ebookId, note);
      }
      return note;
    });
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
        if (note.EbookId !== undefined) {
          dbClass.unLinkEbookFromNote(note.EbookId, noteId);
        }
        if (newNote.EbookId !== undefined) {
          dbClass.linkEbookToNote(newNote.EbookId, noteId);
        }
      }
    });
    return await this.updateNote(noteId, newNote);
  }
}
