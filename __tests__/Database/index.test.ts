import { dbClass, db } from "../../src/Database/index";
import {
  IEbooksContent,
  INode2Note,
  INoteContent,
} from "../../src/Database/interface";

const testEbookItem: IEbooksContent = {
  EbookId: 0,
  title: "testBook.pdf",
  fileHash: "a1b3",
  fileName: "testBook.pdf",
  NoteList: [],
};
const testNode2NoteItem: INode2Note = { MindMapNodeId: " 0", NoteList: [0] };
const testNoteItem: INoteContent = {
  NoteContent: "test",
  EbookId: 0,
};
const testNoteItem2: INoteContent = {
  NoteContent: "test2",
  EbookId: 0,
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
  afterAll(clearDatabase);

  it("defined variable", () => {
    expect(dbClass).toBeDefined();
    expect(db()).toBeDefined();
  });

  it("should have 1 item for each table", async () => {
    const noteId = await dbClass.addNewNote(
      testNoteItem.NoteContent,
      testNoteItem.EbookId
    );
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
    await dbClass.getEbookCounts().then((count) => {
      expect(count).toBe(1);
    });

    await dbClass.getNode2NotesArray().then((count) => {
      expect(count.length).toBe(1);
    });

    await dbClass.getNotesArray().then((count) => {
      expect(count.length).toBe(1);
    });

    await dbClass.getNode2NotesArray().then((count) => {
      expect(count[0].MindMapNodeId).toBe(testNode2NoteItem.MindMapNodeId);
      if (count[0].NoteList) {
        expect(count[0].NoteList.length).toBe(1);
      }
    });

    dbClass.getNote(noteId).then((note) => {
      if (note !== undefined) {
        expect(note.NoteContent).toBe(testNoteItem2.NoteContent);
        expect(note.EbookId).toBe(ebookId);
      }
    });

    dbClass.getEbook(ebookId).then((ebook) => {
      if (ebook !== undefined) {
        expect(ebook.title).toBe(testEbookItem.title);
        expect(ebook.fileHash).toBe(testEbookItem.fileHash);
        expect(ebook.fileName).toBe(testEbookItem.fileName);
        expect(ebook.NoteList.length).toBe(1);
      }
    });
  });

  it("clear database", async () => {
    dbClass.getDbInstance().clear();
    await dbClass.getEbookCounts().then((count) => {
      expect(count).toBe(0);
    });
    await dbClass.getNode2NotesArray().then((count) => {
      expect(count.length).toBe(0);
    });
    await dbClass.getNotesArray().then((count) => {
      expect(count.length).toBe(0);
    });
  });

  it("import from json", async () => {
    const jsonString =
      '{"ebooks": [' +
      JSON.stringify(testEbookItem) +
      "]," +
      '"node2notes":[' +
      JSON.stringify(testNode2NoteItem) +
      "]," +
      '"notes":[' +
      JSON.stringify(testNoteItem) +
      "]}";
    const json = JSON.parse(jsonString);
    await dbClass
      .getDbInstance()
      .importFromJson(json.ebooks, json.node2notes, json.notes);
    await dbClass.getEbookCounts().then((count) => {
      expect(count).toBe(1);
    });
    await dbClass.getNode2NotesArray().then((count) => {
      expect(count.length).toBe(1);
    });
    await dbClass.getNotesArray().then((count) => {
      expect(count.length).toBe(1);
    });
  });
});
