import { dbClass } from "../../src/Database/index";
import {
  IEbooksContent,
  INode2Note,
  INoteContent,
} from "../../src/Database/interface";

const testEbookItem: IEbooksContent = {
  id: 0,
  title: "test",
  fileHash: "test",
};
const testNode2NoteItem: INode2Note = { MindMapNodeId: 0, noteList: [0] };
const testNoteItem: INoteContent = {
  noteContent: "test",
  ebookId: 0,
};
const testNoteItem2: INoteContent = {
  noteId: 2,
  noteContent: "test2",
  ebookId: 0,
};
function initializeDatabase() {
  dbClass.getDbInstance().ebooksTable.add(testEbookItem, testEbookItem.id);
  dbClass
    .getDbInstance()
    .node2NoteTable.add(testNode2NoteItem, testNode2NoteItem.MindMapNodeId);
  dbClass.getDbInstance().notesTable.add(testNoteItem);
}

function clearDatabase() {
  dbClass.getDbInstance().ebooksTable.clear();
  dbClass.getDbInstance().node2NoteTable.clear();
  dbClass.getDbInstance().notesTable.clear();
}

describe("Database", () => {
  beforeAll(initializeDatabase);
  afterAll(clearDatabase);
  it("should have 1 item for each table", async () => {
    await dbClass
      .getDbInstance()
      .ebooksTable.count()
      .then((count) => {
        expect(count).toBe(1);
      });
    await dbClass
      .getDbInstance()
      .node2NoteTable.count()
      .then((count) => {
        expect(count).toBe(1);
      });
    await dbClass
      .getDbInstance()
      .notesTable.count()
      .then((count) => {
        expect(count).toBe(1);
      });
  });
  // it("should have same item", async () => {
  //   await dbClass.getDbInstance().ebooksTable.get(0).then((item) => {
  //     expect(item).toEqual(testEbookItem);
  //   });
  //   await dbClass.getDbInstance().node2NoteTable.get(0).then((item) => {
  //     expect(item.MindMapMindMapNodeId).toEqual(testNode2NoteItem.MindMapMindMapNodeId);

  //     expect(item.noteList.sort()).toEqual(testNode2NoteItem.noteList.sort());
  //   });
  //   await dbClass.getDbInstance().notesTable.get(0).then((item) => {
  //     expect(item).toEqual(testNoteItem);
  //   });
  // });
});

// describe("Database deleteNode", () => {
//   beforeAll(async () => {
//     initializeDatabase();
//     dbClass.getDbInstance().deleteNote(0);
//   });
//   afterAll(clearDatabase);
//   it("should have 0 item in notesTable only", async () => {
//     await dbClass.getDbInstance().ebooksTable.count().then((count) => {
//       expect(count).toBe(1);
//     });
//     await dbClass.getDbInstance().node2NoteTable.count().then((count) => {
//       expect(count).toBe(1);
//     });
//     await dbClass.getDbInstance().notesTable.count().then((count) => {
//       expect(count).toBe(0);
//     });
//   });

//   it("changed values", async () => {
//     await dbClass.getDbInstance().ebooksTable.get(0).then((item) => {
//       expect(item).toEqual(testEbookItem);
//     });

//     await dbClass.getDbInstance().node2NoteTable.get(0).then((item) => {
//       expect(item).toEqual({
//         MindMapNodeId: testNode2NoteItem.MindMapNodeId,
//         noteList: testNode2NoteItem.noteList.filter((id) => id !== 0),
//       });
//     });
//   });
// });

// describe("Database linkNote", () => {
//   beforeAll(async () => {
//     initializeDatabase();
//     dbClass.getDbInstance().notesTable.add(testNoteItem2, testNoteItem2.noteId);
//     dbClass.getDbInstance().linkNote(0, 2);
//   });
//   afterAll(clearDatabase);
//   it("should have 2 item in notesTable", async () => {
//     await dbClass.getDbInstance().ebooksTable.count().then((count) => {
//       expect(count).toBe(1);
//     });
//     await dbClass.getDbInstance().node2NoteTable.count().then((count) => {
//       expect(count).toBe(1);
//     });
//     await dbClass.getDbInstance().notesTable.count().then((count) => {
//       expect(count).toBe(2);
//     });
//   });

//   it("changed values", async () => {
//     await dbClass.getDbInstance().ebooksTable.get(0).then((item) => {
//       expect(item).toEqual(testEbookItem);
//     });

//     await dbClass.getDbInstance().node2NoteTable.get(0).then((item) => {
//       expect(item).toEqual({
//         MindMapNodeId: testNode2NoteItem.MindMapNodeId,
//         noteList: [0, 2],
//       });
//     });

//     await dbClass.getDbInstance().notesTable.get(0).then((item) => {
//       expect(item).toEqual(testNoteItem);
//     });

//     await dbClass.getDbInstance().notesTable.get(2).then((item) => {
//       expect(item).toEqual(testNoteItem2);
//     });
//   });
// });

// describe("Database check same ebook content", () => {
//   beforeAll(initializeDatabase);
//   afterAll(clearDatabase);
//   it("should return true", async () => {
//     const result = await dbClass.getDbInstance().haveSameEbookContent(testEbookItem.fileHash);
//     expect(result).toBe(true);
//   });
//   it("should return false", async () => {
//     const result = await dbClass.getDbInstance().haveSameEbookContent("test2");
//     expect(result).toBe(false);
//     clearDatabase();
//     const result2 = await dbClass.getDbInstance().haveSameEbookContent(testEbookItem.fileHash);
//     expect(result2).toBe(false);
//   });
// });
