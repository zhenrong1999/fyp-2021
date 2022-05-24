import React from "react";
import {
  Toolbar,
  Provider,
  teamsTheme,
  Header,
  Flex,
  ProviderProps,
} from "@fluentui/react-northstar";
import upperFirst from "lodash/upperFirst";

import "./MindMap.css";
import MainEditor, {
  Flow,
  constants,
  Command,
  Item,
  ItemPanel,
  EditableLabel,
} from "./MindMapComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, IconProp } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import {
  NodePanel,
  EdgePanel,
  MultiPanel,
  CanvasPanel,
} from "./MindMapComponents/ComponentParts/DetailPanel/Panel";
import { globalData } from "./Global/interface";

library.add(fas);

export const MainMindMap: React.FunctionComponent<ProviderProps> = () => {
  const { EditorCommand } = constants;
  const testData = {
    nodes: [
      {
        id: "0",
        label: "Node",
        x: 50,
        y: 50,
      },
      {
        id: "1",
        label: "Node",
        x: 50,
        y: 200,
      },
    ],
    edges: [
      {
        label: "Label",
        source: "0",
        sourceAnchor: 1,
        target: "1",
        targetAnchor: 0,
      },
    ],
  };

  const FLOW_COMMAND_LIST = [
    EditorCommand.Undo,
    EditorCommand.Redo,
    "|",
    EditorCommand.Copy,
    EditorCommand.Paste,
    EditorCommand.Remove,
    "|",
    EditorCommand.ZoomIn,
    EditorCommand.ZoomOut,
  ];

  const divStyle = {
    outline: "2px solid red",
  };

  return (
    <div style={divStyle}>
      <Header as="h2" content="Mind Map" />

      <MainEditor>
        <Toolbar
          className="mindmap"
          aria-label="Mind Map Toolbar"
          items={FLOW_COMMAND_LIST.map((name, index) => {
            let title: string;
            if (name === "|") {
              return { key: name + index.toString(), kind: "divider" };
            }
            title = upperFirst(name);
            let iconName: string = name;
            if (name === EditorCommand.ZoomIn) {
              title = "Zoom In";
              iconName = "magnifying-glass-plus";
            }
            if (name === EditorCommand.ZoomOut) {
              title = "Zoom Out";
              iconName = "magnifying-glass-minus";
            }

            return {
              key: name,
              title: title,
              focusable: true,
              kind: "custom",
              role: "button",
              content: (
                <Command key={name} name={name}>
                  <FontAwesomeIcon icon={iconName as IconProp} />
                </Command>
              ),
            };
          })}
        />
        <Flex gap="gap.small">
          <Flow
            className="mindmap"
            style={{
              width: "75%",
              height: 800,
              outline: "2px solid black",
              position: "relative",
              overflow: "hidden",
            }}
            data={testData}
          />
          <div className="detailPanel">
            <NodePanel />
            <EdgePanel />
            <MultiPanel />
            <CanvasPanel />
          </div>
          <EditableLabel />
        </Flex>
      </MainEditor>
    </div>
  );
};
