import React from "react";
import {
  Toolbar,
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
  Mind,
  Interface,
} from "./MindMapComponents";
import { MindData } from "./MindMapComponents/common/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, IconProp } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import {
  NodePanel,
  EdgePanel,
  MultiPanel,
  CanvasPanel,
} from "./MindMapComponents/ComponentParts/RightPanel";
import { MindMapGraphProps } from "./Global/interface";

library.add(fas);

interface MainMindMapProps extends ProviderProps, MindMapGraphProps {}

export const MainMindMap: React.FunctionComponent<MainMindMapProps> = (
  props
) => {
  const { EditorCommand } = constants;
  const testData: Interface.FlowData | Interface.MindData = props.graph
    ? props.graph
    : {
        id: "0",
        label: "Central Topic",
        children: [
          {
            id: "1",
            side: "right",
            label: "Main Topic 1",
          },
          {
            id: "2",
            side: "right",
            label: "Main Topic 2",
          },
          {
            id: "3",
            side: "right",
            label: "Main Topic 3",
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

  const MIND_COMMAND_LIST = [
    EditorCommand.Undo,
    EditorCommand.Redo,
    "|",
    EditorCommand.Copy,
    EditorCommand.Paste,
    EditorCommand.Remove,
    "|",
    EditorCommand.Topic,
    EditorCommand.Subtopic,
    "|",
    EditorCommand.Fold,
    EditorCommand.Unfold,
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

      <MainEditor setGraph={props.setGraph}>
        <Toolbar
          className="mindmap"
          aria-label="Mind Map Toolbar"
          items={MIND_COMMAND_LIST.map((name, index) => {
            let title: string;
            if (name === "|") {
              return { key: name + index.toString(), kind: "divider" };
            }
            title = upperFirst(name);
            let iconName: string = name;
            if (name === EditorCommand.Topic) {
              iconName = "t";
            }
            if (name === EditorCommand.Subtopic) {
              iconName = "indent";
            }
            if (name === EditorCommand.Fold) {
              iconName = "square-minus";
            }
            if (name === EditorCommand.Unfold) {
              iconName = "square-plus";
            }

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
          <Mind
            className="mindmap"
            style={{
              width: "75%",
              height: "800px",
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
