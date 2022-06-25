import React from "react";
import { ProviderProps } from "@fluentui/react-northstar";
import {
  MindMapEditorContextProps,
  EbookBlobManagementEditableProps,
} from "../Global/interface";
import { AllNoteGrid } from "./AllNoteGrid";

interface AnalysisComponentsProps
  extends ProviderProps,
    MindMapEditorContextProps,
    EbookBlobManagementEditableProps {}

export const AnalysisComponents: React.FC<AnalysisComponentsProps> = (
  props: AnalysisComponentsProps
) => {
  return <AllNoteGrid {...props} />;
};
