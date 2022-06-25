import {
  Interface,
  EditorContextProps,
  CommandManager,
} from "../MindMapComponents";
import {
  EbookBlobInterface,
  EbookBlobManagementProps,
  EbookBlobManagementEditableProps,
} from "../EbookManagementComponents/EbookBlobManagement";
import {
  INoteContentAccess,
  INoteEditable,
  INode2NoteEditable,
} from "../NoteComponents/NoteInterface";

import { IEbooksContent, INode2Note, INoteContent } from "../../Database";
import { Graph } from "@antv/g6";

export {
  EbookBlobInterface,
  EbookBlobManagementProps,
  EbookBlobManagementEditableProps,
};
export { INoteContentAccess, INoteEditable, INode2NoteEditable };
export { IEbooksContent, INode2Note, INoteContent };

export interface EbookViewerRequiredProps {
  fileBlob: string;
}
export interface EbookViewerSettingProps {
  setFileBlob: (fileBlob: string) => void;
}

export interface ebookSelected {
  ebookSelected: IEbooksContent;
  setEbookSelected: (ebookSelected: IEbooksContent) => void;
}

export interface MindMapGraphProps {
  graphData: Interface.FlowData | Interface.MindData;
  setGraphData: (graph: Interface.FlowData | Interface.MindData) => void;
}

export interface MindMapEditorContextProps {
  graphClass: Interface.Graph;
  setGraphClass: (graphClass: Interface.Graph) => void;
  executeCommand: (name: string, params?: object) => void;
  commandManager: CommandManager;
}

export {
  Interface as MindMapInterface,
  // EditorContextProps as MindMapEditorContextProps,
};
