import { NotePanel } from "../NoteComponents";
import React from "react";
import {
  Card,
  Flex,
  ProviderProps,
  Form,
  FormInput,
} from "@fluentui/react-northstar";
import { ebookSelected, MindMapEditorContextProps } from "../Global/interface";

import { NodePath } from "../MindMapComponents";
import Graph from "../MindMapComponents/ComponentParts/Graph";
export interface IEbookManagementRightPanel
  extends ProviderProps,
    ebookSelected,
    MindMapEditorContextProps {
  style?: any;
  className?: string;
}

export const EbookManagementRightPanel: React.FC<IEbookManagementRightPanel> = (
  props: IEbookManagementRightPanel
) => {
  return (
    <Card style={props.style} className={props.className}>
      <Flex fill>
        <Flex.Item>
          <NotePanel EbookId={props.ebookSelected.EbookId} {...props} />
        </Flex.Item>
      </Flex>
    </Card>
  );
};
