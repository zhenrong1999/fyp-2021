import React from "react";
import {
  Flex,
  Menu,
  MenuItemProps,
  ProviderProps,
} from "@fluentui/react-northstar";
import {
  MindMapEditorContextProps,
  EbookBlobManagementEditableProps,
} from "../Global/interface";
import { AllNoteGrid } from "./AllNoteGrid";
import { PaperRelation } from "./PaperRelation";
import { SearchAllText } from "./SearchAllText";

interface AnalysisComponentsProps
  extends ProviderProps,
    MindMapEditorContextProps,
    EbookBlobManagementEditableProps {}

export const AnalysisComponents: React.FC<AnalysisComponentsProps> = (
  props: AnalysisComponentsProps
) => {
  const [activeTab, setActiveTab] = React.useState(0);

  function changePageFunction(
    ev: React.SyntheticEvent,
    data: MenuItemProps
  ): void {
    // eslint-disable-next-line react/prop-types
    setActiveTab(data.index);
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Flex column fill style={{ height: "100%" }}>
        <Flex.Item styles={{ top: 0, position: "sticky", "z-index": 9 }}>
          <Menu
            defaultActiveIndex={0}
            items={[
              {
                key: "AllNoteGrid",
                content: "All Notes",
                onClick: changePageFunction,
              },
              {
                key: "PaperRelation",
                content: "Paper Relation with Mind Map",
                onClick: changePageFunction,
              },
              {
                key: "SearchAllText",
                content: "Search Text From Ebook",
                onClick: changePageFunction,
              },
            ]}
            secondary
          />
        </Flex.Item>
        <Flex.Item styles={{ flex: 1, height: "100%", overflow: "hidden" }}>
          <>
            {activeTab === 0 && <AllNoteGrid {...props} />}
            {activeTab === 1 && <PaperRelation {...props} />}
            {activeTab === 2 && <SearchAllText {...props} />}
          </>
        </Flex.Item>
      </Flex>
    </div>
  );
};
