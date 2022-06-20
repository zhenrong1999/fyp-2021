import Dexie, { Table } from "dexie";
import { IEbooksContent, INode2Note, INoteContent } from "./interface";

export class MindFlowBaseDb extends Dexie {
  ebooksTable!: Table<IEbooksContent, number>;
  node2NoteTable!: Table<INode2Note, number>;
  notesTable!: Table<INoteContent, number>;

  constructor() {
    super("MindFlowDb", { autoOpen: true, allowEmptyDB: true });
    this.version(1).stores({
      ebooksTable: "EbookId++, title, fileHash, NoteList",
      node2NoteTable: "MindMapNodeId++, NoteList",
      notesTable: "NoteId++, NoteContent, EbookId",
    });
  }

  linkNote(MindMapNodeId: number, noteId: number) {
    return this.transaction(
      "rw",
      this.node2NoteTable,
      this.notesTable,
      async () => {
        // if ((await this.notesTable.get(noteId)) !== undefined && !(await this.node2NoteTable.get(MindMapNodeId)).noteList.includes(noteId)) {
        const noteList = (await this.node2NoteTable.get(MindMapNodeId))
          .NoteList;
        this.node2NoteTable.update(MindMapNodeId, {
          NoteList: [...noteList, noteId],
        });
        // }
      }
    );
  }

  async haveSameEbookContent(fileHash: string) {
    return this.ebooksTable
      .where("fileHash")
      .equals(fileHash)
      .count()
      .then((count) => {
        return count > 0;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }

  deleteNote(noteId: number) {
    return this.transaction("rw", this.node2NoteTable, this.notesTable, () => {
      this.node2NoteTable.each((node) => {
        if (node.NoteList.includes(noteId)) {
          this.node2NoteTable.update(node, {
            NoteList: node.NoteList.filter((id) => id !== noteId),
          });
        }
      });
      this.notesTable.where("NoteId").equals(noteId).delete();
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
