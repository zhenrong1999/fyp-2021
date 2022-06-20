import { dbClass } from "../../src/Database/index";
import {
  IEbooksContent,
  INode2Note,
  INoteContent,
} from "../../src/Database/interface";

const testEbookItem: IEbooksContent = {
  EbookId: 0,
  title: "test",
  fileHash: "test",
  NoteList: [],
};
const testNode2NoteItem: INode2Note = { MindMapNodeId: 0, NoteList: [0] };
const testNoteItem: INoteContent = {
  NoteId: 0,
  NoteContent: "testNote",
  EbookId: undefined,
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

describe("NoteLinking", () => {
  beforeAll(initializeDatabase);
  afterAll(clearDatabase);
  it("should have 1 note linked", async () => {
    const EbookId: number = testEbookItem.EbookId ? testEbookItem.EbookId : -1;
    const NoteId: number = testNoteItem.NoteId ? testNoteItem.NoteId : -1;
    dbClass.linkEbookToNote(EbookId, NoteId);
    const ebookObject = await dbClass.getDbInstance().ebooksTable.get(EbookId);
    const noteList = ebookObject ? ebookObject.NoteList : [];
    expect(noteList).toBe(NoteId);
  });
});
