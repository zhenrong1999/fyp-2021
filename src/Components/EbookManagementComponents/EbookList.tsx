import React from "react";
import { Box, List, Button } from "@fluentui/react-northstar";
import { AddEbook, AddEbookProps } from "./AddEbook";
import { setSelectedItems } from "../MindMapComponents/common/utils";

interface EbookListProps extends AddEbookProps {
  className?: string;
}

export const EbookList: React.FunctionComponent<EbookListProps> = (props) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const items = [
    {
      key: "pdf1",
      header: "PDF 1",
      content: "Summary Content of PDF 1",
    },
    {
      key: "pdf2",
      header: "PDF 2",
      content: "Summary Content of PDF 2",
    },
    {
      key: "addButtton",
      content: (
        <AddEbook
          setFilePath={props.setFilePath}
          setFileBlob={props.setFileBlob}
        />
      ),
    },
  ];

  return (
    <Box
      styles={({ theme: { siteVariables } }) => ({
        backgroundColor: siteVariables.colorScheme.default.background4,
      })}
      className={props.className}
    >
      <List
        selectable
        selectedIndex={selectedIndex}
        onSelectedIndexChange={(e, newProps) => {
          if (newProps.selectedIndex !== items.length - 1) {
            alert(
              `List is requested to change its selectedIndex state to "${newProps.selectedIndex}"`
            );
            setSelectedIndex(newProps.selectedIndex);
          }
        }}
        items={items}
      />
    </Box>
  );
};
