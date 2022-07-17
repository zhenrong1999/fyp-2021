import { dbClass } from "../../src/Database/index";
import {
  IEbooksContent,
  INode2Note,
  INoteContent,
} from "../../src/Database/interface";

const testEbookItem: IEbooksContent = {
  title: "testBook",
  fileHash: "a1b3",
  fileName: "testBook.pdf",
  NoteList: [],
};

const testEbookItem2: IEbooksContent = {
  title: "testBook2",
  fileHash: "a1b32",
  fileName: "testBook2.pdf",
  NoteList: [],
};
const testNode2NoteItem: INode2Note = { MindMapNodeId: "0", NoteList: [0] };
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
  it("deleted note should not appear at any places", async () => {
    const noteId = await dbClass.addNewNote(testNoteItem.NoteContent);
    let nodeId;
    if (testNode2NoteItem.NoteList) {
      nodeId = await dbClass.addNewNoteToNode2Note(
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
