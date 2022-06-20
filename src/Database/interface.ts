export interface IEbooksContent {
  EbookId?: number;
  title: string;
  fileHash: string;
  NoteList: number[];
}

export interface INode2Note {
  MindMapNodeId: number;
  NoteList?: number[];
}

export interface INoteContent {
  NoteId?: number;
  NoteContent: string;
  EbookId?: number;
}
