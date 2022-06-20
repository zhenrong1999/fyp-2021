import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { ProviderProps } from "@fluentui/react-northstar";

interface NotePreviewProps extends ProviderProps {
  note: string;
}

export const NotePreview: React.FunctionComponent<NotePreviewProps> = (
  props
) => {
  return (
    <div className="NotePreview" data-color-mode="light">
      <MDEditor.Markdown source={props.note} />
    </div>
  );
};
