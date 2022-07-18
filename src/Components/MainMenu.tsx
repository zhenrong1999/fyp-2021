import React from "react";
import { MainMindMap } from "./MindMapComponents/MindMap";
import { EbookManagement } from "./EbookManagementComponents/EbookManagement";
import { AnalysisComponents } from "./AnalysisComponents";
import {
  Provider,
  teamsTheme,
  Menu,
  MenuItemProps,
  Flex,
} from "@fluentui/react-northstar";
import { EbookBlobManagement } from "./EbookManagementComponents/EbookBlobManagement";
import { CommandManager } from "./MindMapComponents";
import { IEbooksContent, MindMapInterface } from "./Global/interface";
import { Graph } from "./MindMapComponents/common/interfaces";
import { dbClass } from "./Global/constant";

export const MainMenu: React.FunctionComponent = () => {
  const [MenuIndex, setMenuIndex] = React.useState(0);
  const [ebookBlobList, setEbookBlobList] = React.useState<EbookBlobManagement>(
    new EbookBlobManagement()
  );

  const [graph, setGraph] = React.useState<MindMapInterface.MindData>();
  const [note, setNote] = React.useState("");

  const [graphClass, setGraphClass] = React.useState<Graph>();
  const [executeCommand, setExecuteCommand] =
    React.useState<(name: string, params?: object) => void>();
  const [commandManager, setCommandManager] = React.useState<CommandManager>();
  const [ebookSelected, setEbookSelected] = React.useState<string>(
    JSON.stringify({
      EbookId: -1,
      title: "",
      fileName: "",
      fileHash: "",
      NoteList: [],
    })
  );

  function onChangeEbookSelected(ebook: IEbooksContent) {
    setEbookSelected(JSON.stringify(ebook));
  }

  function changePageFunction(
    ev: React.SyntheticEvent,
    props: MenuItemProps
  ): void {
    // eslint-disable-next-line react/prop-types
    console.log(props.index);
    // eslint-disable-next-line react/prop-types
    setMenuIndex(props.index);
  }

  React.useEffect(() => {
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
        window.api.browserWindow.infoDialog({
          message: "Mind Map loaded successfully!",
          type: "info",
        });
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
    return () => {
      window.api.LoadSave.RemoveEventListener();
    };
  }, [ebookBlobList, graphClass]);
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
            ]}
            primary
          />
        </Flex.Item>
        <Flex.Item styles={{ flex: 1, height: "100%", overflow: "hidden" }}>
          <>
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
              <EbookManagement
                ebookBlobClassObject={ebookBlobList}
                setEbookBlobClassObject={setEbookBlobList}
                graphClass={graphClass}
                setGraphClass={setGraphClass}
                executeCommand={executeCommand}
                commandManager={commandManager}
                ebookSelected={ebookSelected}
                setEbookSelectedMain={onChangeEbookSelected}
              />
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
          </>
        </Flex.Item>
      </Flex>
    </Provider>
  );
};
