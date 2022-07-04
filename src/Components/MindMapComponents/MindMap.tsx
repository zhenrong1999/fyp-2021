import React from "react";
import {
  Toolbar,
  Header,
  Flex,
  ProviderProps,
  Button,
} from "@fluentui/react-northstar";
import upperFirst from "lodash/upperFirst";

import "./MindMap.css";
import MainEditor, {
  constants,
  Command,
  EditableLabel,
  Mind,
  Interface,
  CommandManager,
} from ".";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, IconProp } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NodePanel, CanvasPanel } from "./ComponentParts/RightPanel";
import {
  MindMapGraphProps,
  MindMapEditorContextProps,
} from "../Global/interface";

library.add(fas);

interface MainMindMapProps
  extends ProviderProps,
    MindMapGraphProps,
    MindMapEditorContextProps {
  // setGraphClass?: (graph: Interface.Graph) => void;
  setExecuteCommand?: any;
  setCommandManager: (commandManager: CommandManager) => void;
}

export const MainMindMap: React.FunctionComponent<MainMindMapProps> = (
  props
) => {
  const { EditorCommand } = constants;
  const testData: Interface.FlowData | Interface.MindData = props.graphData
    ? props.graphData
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
    flex: 1,
  };

  return (
    <Flex style={divStyle} column fill>
      <Flex.Item grow push styles={divStyle}>
        <MainEditor
          setGraph={props.setGraphData}
          style={divStyle}
          setGraphClass={props.setGraphClass}
          setCommandManager={props.setCommandManager}
          setExecuteCommand={props.setExecuteCommand}
        >
          <Flex column fill styles={divStyle}>
            <Flex.Item>
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
                    iconName = "diagram-next";
                  }
                  if (name === EditorCommand.Subtopic) {
                    iconName = "diagram-successor";
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
                    fitted: true,
                    content: (
                      <Command key={name} name={name}>
                        <Button
                          iconOnly
                          icon={<FontAwesomeIcon icon={iconName as IconProp} />}
                          flat
                          fluid
                          title={title}
                          key={name}
                        />
                      </Command>
                    ),
                  };
                })}
              />
            </Flex.Item>
            <Flex.Item grow push>
              <Flex gap="gap.small" fill>
                <Flex.Item grow>
                  <Mind
                    className="mindmap"
                    style={{
                      width: "75%",
                      // height: "800px",
                      outline: "2px solid black",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    data={testData}
                  />
                </Flex.Item>
                <Flex.Item push grow>
                  <div className="detailPanel">
                    <NodePanel />
                    <CanvasPanel />
                  </div>
                </Flex.Item>
                <EditableLabel />
              </Flex>
            </Flex.Item>
          </Flex>
        </MainEditor>
      </Flex.Item>
    </Flex>
  );
};
