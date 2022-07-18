import { dbClass } from "../../src/Database/index";
import {
  IEbooksContent,
  INode2Note,
  INoteContent,
} from "../../src/Database/interface";

const testEbookItem: IEbooksContent = {
  title: "testBook.pdf",
  fileHash: "a1b3",
  fileName: "testBook.pdf",
  NoteList: [],
};

const testEbookItem2: IEbooksContent = {
  title: "testBook2.pdf",
  fileHash: "a1b32",
  fileName: "testBook2.pdf",
  NoteList: [],
};
const testNode2NoteItem: INode2Note = { MindMapNodeId: "0", NoteList: [] };
const testNoteItem: INoteContent = {
  NoteContent: "test",
};
const testNoteItem2: INoteContent = {
  NoteContent: "test2",
};
function initializeDatabase() {}

function clearDatabase() {
  dbClass.getDbInstance().ebooksTable.clear();
  dbClass.getDbInstance().node2NoteTable.clear();
  dbClass.getDbInstance().notesTable.clear();
}
afterAll((done) => {
  clearDatabase();
  dbClass.getDbInstance().close();
  done();
});

describe("Database", () => {
  afterEach(clearDatabase);
  it("delete note that appear in eBook and Node2NotesArray", async () => {
    const noteId = await dbClass.addNewNote(testNoteItem.NoteContent);
    if (testNode2NoteItem.NoteList) {
      await dbClass.addNewNoteToNode2Note(
        testNode2NoteItem.MindMapNodeId,
        noteId
      );
    }
    const ebookId = await dbClass.addNewEbook(
      testEbookItem.fileName,
      testEbookItem.fileHash
    );
    await dbClass.updateNoteContentAndEbookId(
      noteId,
      testNoteItem2.NoteContent,
      ebookId
    );
    await dbClass.deleteNote(noteId).then(async () => {
      await dbClass.getNotesArray().then((count) => {
        expect(count.length).toBe(0);
      });
      await dbClass.getNode2NotesArray().then((count) => {
        expect(count.length).toBe(1);
        expect(count[0].NoteList?.length).toBe(0);
      });
      await dbClass.getEbookCounts().then((count) => {
        expect(count).toBe(1);
      });
      await dbClass.getEbook(ebookId).then((count) => {
        expect(count?.NoteList.length).toBe(0);
      });
    });
  });

  it("delete note that appear in Node2NotesArray", async () => {
    const noteId = await dbClass.addNewNote(testNoteItem.NoteContent);
    if (testNode2NoteItem.NoteList) {
      await dbClass.addNewNoteToNode2Note(
        testNode2NoteItem.MindMapNodeId,
        noteId
      );
    }
    await dbClass.deleteNote(noteId).then(async () => {
      await dbClass.getNotesArray().then((count) => {
        expect(count.length).toBe(0);
      });
      await dbClass.getNode2NotesArray().then((count) => {
        expect(count.length).toBe(1);
        expect(count[0].NoteList?.length).toBe(0);
      });
    });
  });

  it("delete note that appear in eBook", async () => {
    const noteId = await dbClass.addNewNote(testNoteItem.NoteContent);
    const ebookId = await dbClass.addNewEbook(
      testEbookItem.fileName,
      testEbookItem.fileHash
    );
    await dbClass.updateNoteContentAndEbookId(
      noteId,
      testNoteItem2.NoteContent,
      ebookId
    );
    await dbClass.deleteNote(noteId).then(async () => {
      await dbClass.getNotesArray().then((count) => {
        expect(count.length).toBe(0);
      });
      await dbClass.getEbookCounts().then((count) => {
        expect(count).toBe(1);
      });
      await dbClass.getEbook(ebookId).then((count) => {
        expect(count?.NoteList.length).toBe(0);
      });
    });
  });

  it("delete note that is in note only", async () => {
    const noteId = await dbClass.addNewNote(testNoteItem.NoteContent);
    await dbClass.deleteNote(noteId).then(async () => {
      await dbClass.getNotesArray().then((count) => {
        expect(count.length).toBe(0);
      });
    });
  });

  it("update note content and ebook id", async () => {
    const noteId = await dbClass.addNewNote(testNoteItem.NoteContent);
    const ebookId = await dbClass.addNewEbook(
      testEbookItem.fileName,
      testEbookItem.fileHash
    );
    const ebookId2 = await dbClass.addNewEbook(
      testEbookItem2.fileName,
      testEbookItem2.fileHash
    );
    await dbClass.updateNoteContentAndEbookId(
      noteId,
      testNoteItem2.NoteContent
    );
    await dbClass.getNote(noteId).then((noteObj) => {
      expect(noteObj?.NoteContent).toBe(testNoteItem2.NoteContent);
      expect(noteObj?.EbookId).toBeUndefined();
    });
    await dbClass.updateNoteContentAndEbookId(
      noteId,
      testNoteItem2.NoteContent,
      ebookId2
    );
    await dbClass.getNote(noteId).then((noteObj) => {
      expect(noteObj?.NoteContent).toBe(testNoteItem2.NoteContent);
      expect(noteObj?.EbookId).toBe(ebookId2);
    });
    await dbClass.updateNoteContentAndEbookId(
      noteId,
      testNoteItem2.NoteContent,
      ebookId
    );
    await dbClass.getNote(noteId).then((noteObj) => {
      expect(noteObj?.NoteContent).toBe(testNoteItem2.NoteContent);
      expect(noteObj?.EbookId).toBe(ebookId);
    });
  });

  it("add new note without node and ebook", async () => {
    const noteId = await dbClass.addNewNote(
      testNoteItem.NoteContent,
      undefined
    );
    expect(noteId).toBeDefined();
    await dbClass.getNote(noteId).then((note) => {
      expect(note?.NoteContent).toBe(testNoteItem.NoteContent);
      expect(note?.EbookId).toBeUndefined();
    });
  });

  it("add new note with node", async () => {
    const noteId = await dbClass.addNewNote(
      testNoteItem.NoteContent,
      undefined
    );
    if (testNode2NoteItem.NoteList) {
      await dbClass.addNewNoteToNode2Note(
        testNode2NoteItem.MindMapNodeId,
        noteId
      );
    }
    expect(noteId).toBeDefined();
    await dbClass.getNote(noteId).then((note) => {
      expect(note?.NoteContent).toBe(testNoteItem.NoteContent);
    });

    await dbClass.getNode2NotesArray().then((count) => {
      expect(count[0].MindMapNodeId).toBe(testNode2NoteItem.MindMapNodeId);
      if (count[0].NoteList) {
        expect(count[0].NoteList.length).toBe(1);
        expect(count[0].NoteList[0]).toBe(noteId);
      }
    });
  });

  it("add new note with eBook", async () => {
    const ebookId = await dbClass.addNewEbook(
      testEbookItem.fileName,
      testEbookItem.fileHash
    );
    const noteId = await dbClass.addNewNote(testNoteItem.NoteContent, ebookId);
    expect(noteId).toBeDefined();
    await dbClass.getNote(noteId).then((note) => {
      expect(note?.NoteContent).toBe(testNoteItem.NoteContent);
      expect(note?.EbookId).toBe(ebookId);
    });
  });

  it("add new note with node and ebook", async () => {
    const ebookId = await dbClass.addNewEbook(
      testEbookItem.fileName,
      testEbookItem.fileHash
    );
    const noteId = await dbClass.addNewNote(testNoteItem.NoteContent, ebookId);
    if (testNode2NoteItem.NoteList) {
      await dbClass.addNewNoteToNode2Note(
        testNode2NoteItem.MindMapNodeId,
        noteId
      );
    }
    expect(noteId).toBeDefined();
    await dbClass.getNote(noteId).then((note) => {
      expect(note?.NoteContent).toBe(testNoteItem.NoteContent);
      expect(note?.EbookId).toBe(ebookId);
    });

    await dbClass.getNode2NotesArray().then((count) => {
      expect(count[0].MindMapNodeId).toBe(testNode2NoteItem.MindMapNodeId);
      if (count[0].NoteList) {
        expect(count[0].NoteList.length).toBe(1);
        expect(count[0].NoteList[0]).toBe(noteId);
      }
    });

    dbClass.getEbook(ebookId).then((ebook) => {
      if (ebook !== undefined) {
        expect(ebook.title).toBe(testEbookItem.title);
        expect(ebook.fileHash).toBe(testEbookItem.fileHash);
        expect(ebook.fileName).toBe(testEbookItem.fileName);
        expect(ebook.NoteList.length).toBe(1);
        expect(ebook.NoteList[0]).toBe(noteId);
      }
    });
  });

  it("return note array from noteIdArray", async () => {
    const noteId = await dbClass.addNewNote(testNoteItem.NoteContent);
    const noteId2 = await dbClass.addNewNote(testNoteItem2.NoteContent);
    const noteIdArray = [noteId, noteId2];
    const noteArray = await dbClass.getNoteArrayByNoteIdArray(noteIdArray);
    expect(noteArray.length).toBe(2);
    expect(noteArray[0].NoteContent).toBe(testNoteItem.NoteContent);
    expect(noteArray[1].NoteContent).toBe(testNoteItem2.NoteContent);
  });
});
