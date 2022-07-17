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
