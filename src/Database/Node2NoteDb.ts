import { INode2Note } from "./interface";
import { ADbFunctions } from "./BaseDb";

export class NodeFunctions extends ADbFunctions {
  async getNode2Note(MindMapNodeId: number) {
    return NodeFunctions.db.node2NoteTable.get(MindMapNodeId);
  }

  async getNode2NotesArray() {
    return NodeFunctions.db.node2NoteTable.toArray();
  }

  async updateNode2Note(MindMapNodeId: number, node2Note: INode2Note) {
    return NodeFunctions.db.node2NoteTable.update(MindMapNodeId, node2Note);
  }
  async _addNode2Note(node2Note: INode2Note) {
    return NodeFunctions.db.node2NoteTable.add(
      node2Note,
      node2Note.MindMapNodeId
    );
  }
  async deleteNode2Note(MindMapNodeId: number) {
    return NodeFunctions.db.node2NoteTable.delete(MindMapNodeId);
  }

  async addNewNoteToNode2Note(MindMapNodeId: number, noteId: number) {
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
}
