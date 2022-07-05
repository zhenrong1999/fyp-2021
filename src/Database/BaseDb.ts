import Dexie, { Table } from "dexie";
import { IEbooksContent, INode2Note, INoteContent } from "./interface";

export class MindFlowBaseDb extends Dexie {
  ebooksTable!: Table<IEbooksContent, number>;
  node2NoteTable!: Table<INode2Note, number>;
  notesTable!: Table<INoteContent, number>;

  constructor() {
    super("MindFlowDb", { autoOpen: true, allowEmptyDB: true });
    this.version(1).stores({
      ebooksTable: "EbookId++, title,fileName, fileHash, NoteList",
      node2NoteTable: "MindMapNodeId++, NoteList",
      notesTable: "NoteId++, NoteContent, EbookId",
    });
  }

  clear() {
    return this.transaction(
      "rw",
      this.ebooksTable,
      this.node2NoteTable,
      this.notesTable,
      () => {
        this.ebooksTable.clear();
        this.node2NoteTable.clear();
        this.notesTable.clear();
      }
    );
  }

  importFromJson(EbookTable: any, Node2NoteTable: any, NoteTable: any) {
    return this.transaction(
      "rw",
      this.ebooksTable,
      this.node2NoteTable,
      this.notesTable,
      () => {
        this.ebooksTable.bulkAdd(EbookTable);
        this.node2NoteTable.bulkAdd(Node2NoteTable);
        this.notesTable.bulkAdd(NoteTable);
      }
    );
  }
}

export abstract class ADbFunctions {
  static db: MindFlowBaseDb;
  constructor() {
    if (!ADbFunctions.db) {
      ADbFunctions.db = new MindFlowBaseDb();
      ADbFunctions.db.delete();
      ADbFunctions.db.open();
    }
  }
}
