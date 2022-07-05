import { INode2Note } from "./interface";
import { ADbFunctions } from "./BaseDb";

export class NodeFunctions extends ADbFunctions {
  async getNode2Note(MindMapNodeId: string) {
    return NodeFunctions.db.transaction(
      "r",
      NodeFunctions.db.node2NoteTable,
      () => {
        return NodeFunctions.db.node2NoteTable
          .where("MindMapNodeId")
          .equals(MindMapNodeId)
          .first();
      }
    );
  }

  async getNode2NotesArray() {
    return NodeFunctions.db.transaction(
      "r",
      NodeFunctions.db.node2NoteTable,
      () => {
        return NodeFunctions.db.node2NoteTable.toArray();
      }
    );
  }

  async updateNode2Note(MindMapNodeId: string, node2Note: INode2Note) {
    return NodeFunctions.db.transaction(
      "rw",
      NodeFunctions.db.node2NoteTable,
      async () => {
        return NodeFunctions.db.node2NoteTable.update(
          await this.getNode2Note(MindMapNodeId),
          node2Note
        );
      }
    );
  }
  async _addNode2Note(node2Note: INode2Note) {
    return NodeFunctions.db.transaction(
      "rw",
      NodeFunctions.db.node2NoteTable,
      () => {
        return NodeFunctions.db.node2NoteTable.add(node2Note);
      }
    );
  }
  async deleteNode2Note(MindMapNodeId: string) {
    return NodeFunctions.db.transaction(
      "rw",
      NodeFunctions.db.node2NoteTable,
      () => {
        return NodeFunctions.db.node2NoteTable
          .where("MindMapNodeId")
          .equals(MindMapNodeId)
          .delete();
      }
    );
  }

  async addNewNoteToNode2Note(MindMapNodeId: string, noteId: number) {
    const node2Note = await this.getNode2Note(MindMapNodeId);
    if (node2Note) {
      node2Note.NoteList.push(noteId);
      await this.updateNode2Note(MindMapNodeId, node2Note);
    } else {
      const newNode2Note: INode2Note = {
        MindMapNodeId,
        NoteList: [noteId],
      };
      await this._addNode2Note(newNode2Note);
    }
  }

  async getNodeIdByNoteId(noteId: number) {
    const node2Notes = await this.getNode2NotesArray();
    const nodeIds = node2Notes.filter((node2Note) =>
      node2Note.NoteList.includes(noteId)
    );
    if (nodeIds.length > 0) {
      return nodeIds.map((node2Note) => node2Note.MindMapNodeId)[0];
    } else return null;
  }

  async deleteNoteIdFromNode2Note(MindMapNodeId: string, noteId: number) {
    return NodeFunctions.db.transaction(
      "rw",
      NodeFunctions.db.node2NoteTable,
      () => {
        return this.getNode2Note(MindMapNodeId).then((node) => {
          if (node.NoteList.includes(noteId)) {
            return NodeFunctions.db.node2NoteTable.update(node, {
              NoteList: node.NoteList.filter((id) => id !== noteId),
            });
          }
          return Promise.reject("NoteId not found");
        });
      }
    );
  }

  async updateNoteToNode2Note(MindMapNodeId: string, noteId: number) {
    const oldMindMapNodeId = await this.getNodeIdByNoteId(noteId);
    if (MindMapNodeId !== oldMindMapNodeId) {
      this.deleteNoteIdFromNode2Note(oldMindMapNodeId, noteId);
      return this.addNewNoteToNode2Note(MindMapNodeId, noteId);
    }
  }
}
