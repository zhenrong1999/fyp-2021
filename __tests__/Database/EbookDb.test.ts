import { dbClass } from "../../src/Database/index";
import {
  IEbooksContent,
  INode2Note,
  INoteContent,
} from "../../src/Database/interface";
const testEbookItem: IEbooksContent = {
  EbookId: 1,
  title: "testBook",
  fileHash: "a1b3",
  fileName: "testBook.pdf",
  NoteList: [],
};

const testEbookItem2: IEbooksContent = {
  EbookId: 2,
  title: "testBook2",
  fileHash: "a1b32",
  fileName: "testBook2.pdf",
  NoteList: [],
};
const testNode2NoteItem: INode2Note = { MindMapNodeId: " 0", NoteList: [1] };
const testNoteItem: INoteContent = {
  NoteContent: "test",
};
const testNoteItem2: INoteContent = {
  NoteContent: "test2",
  EbookId: 1,
};

function initializeDatabase() {
  dbClass.getDbInstance().ebooksTable.add(testEbookItem, testEbookItem.EbookId);
  dbClass.getDbInstance().node2NoteTable.add(testNode2NoteItem);
  dbClass.getDbInstance().notesTable.add(testNoteItem, testNoteItem.NoteId);
}

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

describe("Ebook DB test", () => {
  beforeEach(initializeDatabase);
  afterEach(clearDatabase);
  it("should have 1 note linked", async () => {
    const EbookId: number = testEbookItem.EbookId ? testEbookItem.EbookId : -1;
    const NoteId: number = testNoteItem.NoteId ? testNoteItem.NoteId : -1;
    await dbClass.linkEbookToNote(EbookId, NoteId);
    const ebookObject = await dbClass.getDbInstance().ebooksTable.get(EbookId);
    const noteList = ebookObject ? ebookObject.NoteList : [];
    expect(noteList[0]).toBe(NoteId);
  });

  it("update eBook Title", async () => {
    const EbookId: number = testEbookItem.EbookId ? testEbookItem.EbookId : -1;
    const title: string = "testBook2";
    await dbClass.updateEbookTitle(EbookId, title);
    const ebookObject = await dbClass.getDbInstance().ebooksTable.get(EbookId);
    expect(ebookObject?.title).toBe(title);
  });

  it("delete eBook", async () => {
    const EbookId: number = testEbookItem.EbookId ? testEbookItem.EbookId : -1;
    await dbClass.getNotesArray().then(async (notes) => {
      if (notes[0].NoteId) {
        await dbClass.updateNoteContentAndEbookId(
          notes[0].NoteId,
          testNoteItem.NoteContent,
          EbookId
        );
      }
    });
    await dbClass.deleteEbook(EbookId);
    const ebookObject = await dbClass.getDbInstance().ebooksTable.get(EbookId);
    expect(ebookObject).toBe(undefined);
    await dbClass.getNotesArray().then((notes) => {
      expect(notes.length).toBe(1);
      expect(notes[0].EbookId).toBeUndefined();
    });
  });

  it("get ebooks array", async () => {
    const ebookArray = await dbClass.getEbooksArray();
    expect(ebookArray.length).toBe(1);
    expect(ebookArray[0].EbookId).toBe(testEbookItem.EbookId);
    expect(ebookArray[0].title).toBe(testEbookItem.title);
    expect(ebookArray[0].fileHash).toBe(testEbookItem.fileHash);
    expect(ebookArray[0].fileName).toBe(testEbookItem.fileName);
  });

  it("test have same ebook content function", async () => {
    const ebookObject = await dbClass.haveSameEbookContent(
      testEbookItem.fileHash
    );
    expect(ebookObject).toBe(true);
  });
  it("test have different ebook content function", async () => {
    const ebookObject = await dbClass.haveSameEbookContent(
      testEbookItem2.fileHash
    );
    expect(ebookObject).toBe(false);
  });
});
