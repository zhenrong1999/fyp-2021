import { Button } from "@fluentui/react-northstar";
import React from "react";
import { EbookBlobManagement } from "../EbookManagementComponents/EbookBlobManagement";
import { Interface } from "../MindMapComponents";
import { dbClass } from "../Global/constant";
interface SaveMindMapProps {
  ebookBlobList: EbookBlobManagement;
  graph: Interface.MindData;
}

export const SaveMindMap: React.FC<SaveMindMapProps> = (props) => {
  async function saveMindMap() {
    const filePath = await window.api.files.saveMindMapFileDialog();
    const Graph: Interface.MindData = props.graph;
    const EbookList = props.ebookBlobList.exportEbookBlobList();
    const EbookTable = await dbClass.getEbooksArray();
    const Node2NoteTable = await dbClass.getNode2NotesArray();
    const NoteTable = await dbClass.getNotesArray();
    const savedFileContent: string = JSON.stringify({
      Graph,
      EbookList,
      EbookTable,
      Node2NoteTable,
      NoteTable,
    });
    await window.api.files.writeFile(filePath, savedFileContent);
  }

  return (
    <div>
      <Button content="Save Mind Map" onClick={saveMindMap} />
    </div>
  );
};
