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
};
const testNode2NoteItem: INode2Note = { MindMapNodeId: 0, NoteList: [0] };
const testNoteItem: INoteContent = {
  NoteId: 0,
  NoteContent: "testNote",
  EbookId: 0,
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

describe("NoteAdding", () => {
  beforeAll(clearDatabase);
  afterAll(clearDatabase);
  it("should have 1 note added", async () => {
    dbClass.addNewNote(testNoteItem.NoteContent, testNoteItem.EbookId);
    expect(await dbClass.getDbInstance().notesTable.count()).toBe(1);
    expect(
      await dbClass
        .getDbInstance()
        .notesTable.where("NoteContent")
        .equals(testNoteItem.NoteContent)
        .count()
    ).toBe(1);
  });
});
