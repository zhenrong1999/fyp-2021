import React from "react";
import { Button } from "@fluentui/react-northstar";
export interface AddEbookProps {
  className?: string;
  setFilePath: (filePath: string) => void;
  setFileBlob: (filePath: string) => void;
}

export const AddEbook: React.FunctionComponent<AddEbookProps> = (props) => {
  async function openFile() {
    // When the button is clicked, open the native file picker to select a PDF.
    const item = await window.api.files.openFile();
    props.setFilePath(item.filePath);
    props.setFileBlob(item.blob);
  }
  return <Button content="Add Ebook" onClick={openFile} />;
};
