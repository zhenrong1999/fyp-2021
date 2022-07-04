import { Button } from "@fluentui/react-northstar";
import React from "react";
import db, { dbClass } from "../../Database/index";
import { EbookBlobManagement } from "../EbookManagementComponents/EbookBlobManagement";
import {
  MindMapInterface,
  EbookBlobManagementEditableProps,
} from "../Global/interface";

interface OpenMindMapProps extends EbookBlobManagementEditableProps {
  ebookBlobClassObject: EbookBlobManagement;
  setGraph: (graph: MindMapInterface.MindData) => void;
  setEbookBlobClassObject: React.Dispatch<
    React.SetStateAction<EbookBlobManagement>
  >;
}

export const OpenMindMap: React.FC<OpenMindMapProps> = (props) => {
  async function openMindMap() {
    const savedFileContent = await window.api.files.openMindMapFileDialog();
    if (savedFileContent) {
      const json = JSON.parse(savedFileContent);
      const Graph: MindMapInterface.MindData = json.Graph;
      props.setGraph(Graph);

      const EbookList = json.EbookList;
      props.ebookBlobClassObject.importFromArray(EbookList);
      props.setEbookBlobClassObject(props.ebookBlobClassObject);

      const EbookTable = json.EbookTable;
      const Node2NoteTable = json.Node2NoteTable;
      const NoteTable = json.NoteTable;

      await dbClass.getDbInstance().clear();
      await dbClass
        .getDbInstance()
        .importFromJson(EbookTable, Node2NoteTable, NoteTable);
      window.api.browserWindow.infoDialog({
        message: `Mind Map loaded successfully!`,
        type: "info",
      });
    }
  }

  return (
    <div>
      <Button content="Open Mind Map" onClick={openMindMap} />
    </div>
  );
};
