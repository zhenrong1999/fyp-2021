import { Interface } from "../MindMapComponents";
import {
  EbookBlobManagementProps,
  EbookBlobManagementEditableProps,
} from "../EbookManagementComponents/EbookBlobManagement";
import {
  INoteContentAccess,
  INoteEditable,
  INode2NoteEditable,
} from "../NoteComponents/NoteInterface";

import { IEbooksContent, INode2Note, INoteContent } from "../../Database";

export { EbookBlobManagementProps, EbookBlobManagementEditableProps };
export { INoteContentAccess, INoteEditable, INode2NoteEditable };
export { IEbooksContent, INode2Note, INoteContent };

export interface EbookViewerRequiredProps {
  fileBlob: string;
}
export interface EbookViewerSettingProps {
  setFileBlob: (fileBlob: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface globalData {
  selectedEbookListIndex: number;
  setSelectedEbookListIndex: (selectedEbookListIndex: number) => void;
}

export interface MindMapGraphProps {
  graph: Interface.FlowData | Interface.MindData;
  setGraph: (graph: Interface.FlowData | Interface.MindData) => void;
}
export { Interface as MindMapInterface };
