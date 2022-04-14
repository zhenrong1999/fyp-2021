import * as React from "react";
import {
  Toolbar,
  Provider,
  teamsTheme,
  Header,
  Flex,
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

library.add(fas);

export const MainMindMap: React.FunctionComponent = () => {
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
    <Provider theme={teamsTheme}>
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
            <ItemPanel className="itemPanel">
              <Item
                className="item"
                model={{
                  type: "circle",
                  size: 50,
                  label: "circle",
                  linkPoints: {
                    top: true,
                    bottom: true,
                    left: true,
                    right: true,
                    fill: "#fff",
                    size: 5,
                  },
                }}
              >
                <img
                  src="https://gw.alicdn.com/tfs/TB1IRuSnRr0gK0jSZFnXXbRRXXa-110-112.png"
                  width="55"
                  height="56"
                  draggable={false}
                />
              </Item>
              <Item
                className="item"
                model={{
                  type: "rect",
                  size: [80, 24],
                  label: "rect",
                }}
              >
                <img
                  src="https://gw.alicdn.com/tfs/TB1reKOnUT1gK0jSZFrXXcNCXXa-178-76.png"
                  width="89"
                  height="38"
                  draggable={false}
                />
              </Item>
              <Item
                className="item"
                model={{
                  type: "ellipse",
                  size: [100, 50],
                  label: "ellipse",
                }}
              >
                <img
                  src="https://gw.alicdn.com/tfs/TB1AvmVnUH1gK0jSZSyXXXtlpXa-216-126.png"
                  width="108"
                  height="63"
                  draggable={false}
                />
              </Item>
              <Item
                className="item"
                model={{
                  type: "diamond",
                  size: [80, 80],
                  label: "diamond",
                }}
              >
                <img
                  src="https://gw.alicdn.com/tfs/TB1EB9VnNz1gK0jSZSgXXavwpXa-178-184.png"
                  width="89"
                  height="92"
                  draggable={false}
                />
              </Item>
              <Item
                className="item"
                model={{
                  type: "triangle",
                  size: [30, 30],
                  label: "triangle",
                }}
              >
                <img
                  src="https://gw.alicdn.com/tfs/TB12sC2nKH2gK0jSZJnXXaT1FXa-126-156.png"
                  width="63"
                  height="78"
                  draggable={false}
                />
              </Item>
            </ItemPanel>
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
    </Provider>
  );
};
