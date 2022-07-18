import React from "react";
import {
  Breadcrumb,
  ProviderProps,
  ChevronEndMediumIcon,
  Button,
  SplitButton,
  MenuItemProps,
  MenuProps,
  ObjectShorthandValue,
  ShorthandCollection,
  Flex,
  Text,
} from "@fluentui/react-northstar";
import { EditorContextProps } from "../EditorContext";
import { NodeConfig, TreeGraphData, GraphData } from "@antv/g6";
import {
  clearSelectedState,
  setSelectedItems,
  getSelectedNodes,
  setHighLightState,
} from "../../common/utils";
import { GraphState, EditorCommand } from "../../common/constants";
interface NodePathProps extends EditorContextProps, ProviderProps {
  CurrentNodeId?: string;
  setSelectedNodeId?: (currentNodeId: string) => void;
  noEmitEvent?: boolean;
}

export const NodePath: React.FC<NodePathProps> = (props: NodePathProps) => {
  let CurrentNodeId = props.CurrentNodeId;

  if (props.CurrentNodeId === undefined && props.graph) {
    CurrentNodeId = props.graph.save().id;
  }

  console.log("Graph in NodePath", props.graph);

  function depthFirstSearch(
    node: TreeGraphData | GraphData,
    targetId: string,
    visited: NodeConfig[]
  ) {
    if (node.id === targetId) {
      visited.push(node as NodeConfig);
      return visited;
    }
    const children = node.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const result = depthFirstSearch(children[i], targetId, [
          ...visited,
          node as NodeConfig,
        ]);
        if (result[result.length - 1].id === targetId) {
          visited = result;
          break;
        }
      }
    }
    console.log("visited", visited);
    return visited;
  }

  function checkIfSetSelectedNode(
    nodeId: string = getSelectedNodes(props.graph)[0].getModel().id
  ) {
    const { setSelectedNodeId } = props;
    if (setSelectedNodeId) {
      setSelectedNodeId(nodeId);
    }

    console.log("Selected node", nodeId);
  }

  function BreadcrumbItemMapping(): React.ReactNode {
    const data = props.graph.save();
    console.log(data);
    console.log("CurrentNodeId in Node Path", CurrentNodeId);

    function onClickNode(nodeId: string) {
      clearSelectedState(props.graph);
      setHighLightState(props.graph, nodeId);
      setSelectedItems(props.graph, [nodeId]);
      if (props.noEmitEvent === undefined || props.noEmitEvent === false) {
        props.graph.emit(GraphState.NodeSelected);
      }
      checkIfSetSelectedNode(nodeId);
    }

    if (CurrentNodeId) {
      const nodePath = depthFirstSearch(data, CurrentNodeId, []);
      const path = nodePath.map(
        (item: NodeConfig, index: number, pathArray) => {
          const dividerKey = index.toString() + "divider";
          const nodeKey = index.toString() + "node";
          const button = (
            <Button
              flat
              size="small"
              title={item.label as string}
              content={item.label as string}
              onClick={() => onClickNode(item.id)}
            />
          );
          const menu:
            | ObjectShorthandValue<MenuProps>
            // eslint-disable-next-line @typescript-eslint/ban-types
            | ShorthandCollection<MenuItemProps, Record<string, {}>>
            | { key: string; content: string }[] = [];
          if (index > 0) {
            if (pathArray[index - 1].children) {
              pathArray[index - 1].children.forEach((child: NodeConfig) => {
                menu.push({
                  key: child.id,
                  content: child.label as string,
                  onClick: () => onClickNode(child.id),
                });
              });
            }
            menu.push({
              key: "addNode",
              content: "Add Topic/Node",
              onClick: () => {
                onClickNode(item.id);
                props.commandManager.execute(props.graph, EditorCommand.Topic);
                checkIfSetSelectedNode();
              },
            });
          }

          return (
            <Breadcrumb.Item key={nodeKey}>
              {index > 0 && (
                <Breadcrumb.Divider key={dividerKey}>
                  <ChevronEndMediumIcon />
                </Breadcrumb.Divider>
              )}
              {menu.length > 0 ? (
                <SplitButton
                  flat
                  size="small"
                  button={button.props}
                  menu={menu}
                />
              ) : (
                button
              )}
            </Breadcrumb.Item>
          );
        }
      );
      const button = (
        <Button
          flat
          size="small"
          title="Add SubTopic/Child Node"
          content="Add SubTopic/Child Node"
          onClick={() => {
            props.commandManager.execute(props.graph, EditorCommand.Subtopic);
            checkIfSetSelectedNode();
          }}
        />
      );

      const menu:
        | ObjectShorthandValue<MenuProps>
        // eslint-disable-next-line @typescript-eslint/ban-types
        | ShorthandCollection<MenuItemProps, Record<string, {}>>
        | { key: string; content: string }[] = [];
      if (nodePath[nodePath.length - 1].children) {
        nodePath[nodePath.length - 1].children.forEach((child: NodeConfig) => {
          menu.push({
            key: child.id,
            content: child.label as string,
            onClick: () => {
              onClickNode(child.id);
            },
          });
        });
      }
      path.push(
        <Breadcrumb.Item key={"lastNode"}>
          <Breadcrumb.Divider key={"lastNodeDivider"}>
            <ChevronEndMediumIcon />
          </Breadcrumb.Divider>
          {menu.length > 0 ? (
            <SplitButton flat size="small" button={button.props} menu={menu} />
          ) : (
            button
          )}
        </Breadcrumb.Item>
      );
      return path;
    }
  }

  return (
    <Flex column>
      <Text as="h3" content="Node Path:" />
      <Breadcrumb>{props.graph && BreadcrumbItemMapping()}</Breadcrumb>
    </Flex>
  );
};
