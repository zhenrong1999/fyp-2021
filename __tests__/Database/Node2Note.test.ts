import { dbClass } from "../../src/Database/index";
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
const testNode2NoteItem2: INode2Note = { MindMapNodeId: " 2", NoteList: [] };
const testNoteItem: INoteContent = {
  NoteContent: "test",
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

afterAll((done) => {
  clearDatabase();
  dbClass.getDbInstance().close();
  done();
});

describe("Node2Note DB test", () => {
  beforeEach(initializeDatabase);
  afterEach(clearDatabase);
  it("update Node2Note item", async () => {
    dbClass.updateNode2Note(
      testNode2NoteItem.MindMapNodeId,
      testNode2NoteItem2
    );
    const result = await dbClass.getNode2Note(testNode2NoteItem2.MindMapNodeId);
    expect(result).toEqual(testNode2NoteItem2);
  });

  it("delete Node2Note item", async () => {
    dbClass.deleteNode2Note(testNode2NoteItem.MindMapNodeId);
    const result = await dbClass.getNode2Note(testNode2NoteItem.MindMapNodeId);
    expect(result).toEqual(undefined);
  });

  it("add Node2Note item", async () => {
    await dbClass.addNewNoteToNode2Note(testNode2NoteItem.MindMapNodeId, 2);
    const result = await dbClass.getNode2Note(testNode2NoteItem.MindMapNodeId);
    if (testNode2NoteItem.NoteList) {
      expect(result?.NoteList?.length).toEqual(2);
      expect(result?.NoteList).toContain(2);
    }
  });

  it("get Node2Note item by Note id", async () => {
    if (testNode2NoteItem.NoteList) {
      const result = await dbClass.getNodeIdByNoteId(
        testNode2NoteItem.NoteList[0]
      );
      expect(result).toEqual(testNode2NoteItem.MindMapNodeId);
    }
    const result2 = await dbClass.getNodeIdByNoteId(2);
    expect(result2).toEqual(null);
  });

  it("delete NoteId From Node2Note", async () => {
    await dbClass.deleteNoteIdFromNode2Note(testNode2NoteItem.MindMapNodeId, 0);
    const result = await dbClass.getNode2Note(testNode2NoteItem.MindMapNodeId);
    expect(result?.NoteList?.length).toEqual(0);

    await dbClass
      .deleteNoteIdFromNode2Note(testNode2NoteItem.MindMapNodeId, 2)
      .catch((err) => {
        expect(err).toBeDefined();
      });
  });
  it("move Note To new Node2Note", async () => {
    await dbClass.addNewNoteToNode2Note(testNode2NoteItem2.MindMapNodeId, 2);
    await dbClass.moveNoteToNewNode2Note(testNode2NoteItem.MindMapNodeId, 2);
    const result = await dbClass.getNode2Note(testNode2NoteItem.MindMapNodeId);
    expect(result?.NoteList?.length).toEqual(2);
    expect(result?.NoteList).toContain(2);
    const result2 = await dbClass.getNode2Note(
      testNode2NoteItem2.MindMapNodeId
    );
    expect(result2?.NoteList?.length).toEqual(0);
  });
});
