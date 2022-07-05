export interface IEbooksContent {
  EbookId?: number;
  title: string;
  fileName: string;
  fileHash: string;
  NoteList: number[];
}

export interface INode2Note {
  MindMapNodeId: string;
  NoteList?: number[];
}

export interface INoteContent {
  NoteId?: number;
  NoteContent: string;
  EbookId?: number;
}
