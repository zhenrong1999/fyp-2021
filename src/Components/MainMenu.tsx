import React from "react";
import { MainMindMap } from "./MindMapComponents/MindMap";
import { EbookManagement } from "./EbookManagementComponents/EbookManagement";
import { AnalysisComponents } from "./AnalysisComponents";
import {
  Provider,
  teamsTheme,
  Menu,
  MenuItemProps,
  Button,
  Flex,
  Box,
} from "@fluentui/react-northstar";
import { LoadingPage } from "./Utils/LoadingPage";
import { SaveMindMap } from "./Utils/SaveMindMap";
import { EbookBlobManagement } from "./EbookManagementComponents/EbookBlobManagement";
import { OpenMindMap } from "./Utils/OpenMindMap";
import { CommandManager } from "./MindMapComponents";
import { IEbooksContent, MindMapInterface } from "./Global/interface";
import { Graph } from "./MindMapComponents/common/interfaces";
import { dbClass } from "./Global/constant";

export const MainMenu: React.FunctionComponent = () => {
  // const [MenuIndex, setMenuIndex] = React.useState(0);
  const [ebookBlobList, setEbookBlobList] = React.useState<EbookBlobManagement>(
    new EbookBlobManagement()
  );
  // const [ebookSelected, setEbookSelected] = React.useState<IEbooksContent>({
  //   EbookId: -1,
  //   title: "",
  //   fileHash: "",
  // } as IEbooksContent);
  // const [ebookSelected, setEbookSelected] = React.useState<number>(-1);
  const [graph, setGraph] = React.useState<MindMapInterface.MindData>();
  const [note, setNote] = React.useState("");

  const [graphClass, setGraphClass] = React.useState<Graph>();
  const [executeCommand, setExecuteCommand] =
    React.useState<(name: string, params?: object) => void>();
  const [commandManager, setCommandManager] = React.useState<CommandManager>();
  const [changePage, setChangePage] = React.useState<React.ReactNode>(
    <MainMindMap
      graphData={graph}
      setGraphData={setGraph}
      graphClass={graphClass}
      setGraphClass={setGraphClass}
      commandManager={commandManager}
      setCommandManager={setCommandManager}
      executeCommand={executeCommand}
      setExecuteCommand={setExecuteCommand}
    />
  );
  const [ebookSelected, setEbookSelected] = React.useState<IEbooksContent>({
    EbookId: -1,
    title: "",
    fileHash: "",
    NoteList: [],
  });

  function changePageFunction(
    ev: React.SyntheticEvent,
    props: MenuItemProps
  ): void {
    // eslint-disable-next-line react/prop-types
    console.log(props.index);
    // eslint-disable-next-line react/prop-types
    // setMenuIndex(props.index);
    // eslint-disable-next-line react/prop-types
    const MenuIndex = props.index;
    if (MenuIndex === 0) {
      setChangePage(
        <MainMindMap
          graphData={graph}
          setGraphData={setGraph}
          graphClass={graphClass}
          setGraphClass={setGraphClass}
          commandManager={commandManager}
          setCommandManager={setCommandManager}
          executeCommand={executeCommand}
        />
      );
    } else if (MenuIndex === 1) {
      setChangePage(
        <EbookManagement
          // ebookSelected={ebookSelected}
          // setEbookSelected={setEbookSelected}
          ebookBlobClassObject={ebookBlobList}
          setEbookBlobClassObject={setEbookBlobList}
          graphClass={graphClass}
          setGraphClass={setGraphClass}
          executeCommand={executeCommand}
          commandManager={commandManager}
          ebookSelected={ebookSelected}
          setEbookSelected={setEbookSelected}
        />
      );
    } else if (MenuIndex === 2) {
      setChangePage(
        <AnalysisComponents
          ebookBlobClassObject={ebookBlobList}
          setEbookBlobClassObject={setEbookBlobList}
          graphClass={graphClass}
          setGraphClass={setGraphClass}
          executeCommand={executeCommand}
          commandManager={commandManager}
        />
      );
    } else if (MenuIndex === 3) {
      setChangePage(
        <>
          <OpenMindMap
            setGraph={setGraph}
            ebookBlobClassObject={ebookBlobList}
            setEbookBlobClassObject={setEbookBlobList}
          />
          <SaveMindMap ebookBlobList={ebookBlobList} graph={graph} />
        </>
      );
    }
  }
  window.api.LoadSave.LoadMindMap(async () => {
    const savedFileContent = await window.api.files.openMindMapFileDialog();
    if (savedFileContent) {
      const json = JSON.parse(savedFileContent);
      const Graph: MindMapInterface.MindData = json.Graph;
      setGraph(Graph);

      const EbookList = json.EbookList;
      ebookBlobList.importFromArray(EbookList);
      setEbookBlobList(ebookBlobList);

      const EbookTable = json.EbookTable;
      const Node2NoteTable = json.Node2NoteTable;
      const NoteTable = json.NoteTable;

      await dbClass.getDbInstance().clear();
      await dbClass
        .getDbInstance()
        .importFromJson(EbookTable, Node2NoteTable, NoteTable);
      alert("Mind Map loaded successfully!");
    }
  });

  window.api.LoadSave.SaveMindMap(async () => {
    const filePath = await window.api.files.saveMindMapFileDialog();
    const Graph: MindMapInterface.MindData = graph;
    const EbookList = ebookBlobList.exportEbookBlobList();
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
  });

  return (
    <Provider theme={teamsTheme} style={{ height: "100vh" }}>
      <Flex column fill style={{ height: "100vh" }}>
        <Flex.Item styles={{ top: 0, position: "sticky", "z-index": 9 }}>
          <Menu
            defaultActiveIndex={0}
            items={[
              {
                key: "MindMapCanvas",
                content: "Mind Map Canvas",
                onClick: changePageFunction,
              },
              {
                key: "Ebook",
                content: "Ebook",
                onClick: changePageFunction,
              },
              {
                key: "Analysis Used of Reference",
                content: "Analysis Used of Reference",
                onClick: changePageFunction,
              },
              {
                key: "Resources",
                content: "Resources",
                onClick: changePageFunction,
              },
            ]}
            primary
          />
        </Flex.Item>
        <Flex.Item styles={{ flex: 1, height: "100%", overflow: "hidden" }}>
          <Box content={changePage} />
        </Flex.Item>
      </Flex>
    </Provider>
  );
};
