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
import { EbookContext } from "./Global/context";

export const MainMenu: React.FunctionComponent = () => {
  const [MenuIndex, setMenuIndex] = React.useState(0);
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
  // const [changePage, setChangePage] = React.useState<React.ReactNode>(
  //   <MainMindMap
  //     graphData={graph}
  //     setGraphData={setGraph}
  //     graphClass={graphClass}
  //     setGraphClass={setGraphClass}
  //     commandManager={commandManager}
  //     setCommandManager={setCommandManager}
  //     executeCommand={executeCommand}
  //     setExecuteCommand={setExecuteCommand}
  //   />
  // );
  const [ebookSelected, setEbookSelected] = React.useState<IEbooksContent>({
    EbookId: -1,
    title: "",
    fileHash: "",
    NoteList: [],
  });

  function changePageFunction(
    ev: React.SyntheticEvent,
    data: MenuItemProps
  ): void {
    // eslint-disable-next-line react/prop-types
    console.log(data.index);
    // eslint-disable-next-line react/prop-types
    // setMenuIndex(props.index);
    // eslint-disable-next-line react/prop-types
    setMenuIndex(data.index);
  }

  window.api.LoadSave.LoadMindMap(async (event, savedFileContent) => {
    if (savedFileContent !== undefined && savedFileContent !== null) {
      const json = JSON.parse(savedFileContent);
      const Graph: MindMapInterface.MindData = json.Graph;
      setGraph(Graph);
      // graphClass.clear();
      graphClass.changeData(Graph, false);
      graphClass.render();

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

  window.api.LoadSave.SaveMindMap(async (event, filePath) => {
    console.log("SaveMindMapEvent");

    if (filePath !== undefined && filePath !== null) {
      const Graph = graphClass.save();
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
      event.sender.send("saveMindMap-reply", filePath, savedFileContent);
    }
    return;
  });

  return (
    <Provider theme={teamsTheme} style={{ height: "100vh" }}>
      {/* <EbookContext.Provider
        value={{
          ebookSelected: ebookSelected,
          setEbookSelected: setEbookSelected,
        }}
      > */}
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
          <>
            {/* <Box content={changePage} />*/}
            {MenuIndex === 0 && (
              <MainMindMap
                graphData={graph}
                setGraphData={setGraph}
                graphClass={graphClass}
                setGraphClass={setGraphClass}
                commandManager={commandManager}
                setCommandManager={setCommandManager}
                executeCommand={executeCommand}
              />
            )}
            {MenuIndex === 1 && (
              <EbookContext.Provider
                value={{
                  ebookSelected: ebookSelected,
                  setEbookSelected: setEbookSelected,
                }}
              >
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
              </EbookContext.Provider>
            )}
            {MenuIndex === 2 && (
              <AnalysisComponents
                ebookBlobClassObject={ebookBlobList}
                setEbookBlobClassObject={setEbookBlobList}
                graphClass={graphClass}
                setGraphClass={setGraphClass}
                executeCommand={executeCommand}
                commandManager={commandManager}
              />
            )}
            {MenuIndex === 3 && (
              <>
                <OpenMindMap
                  setGraph={setGraph}
                  ebookBlobClassObject={ebookBlobList}
                  setEbookBlobClassObject={setEbookBlobList}
                />
                <SaveMindMap ebookBlobList={ebookBlobList} graph={graph} />
              </>
            )}
          </>
        </Flex.Item>
      </Flex>
      {/* </EbookContext.Provider> */}
    </Provider>
  );
};
