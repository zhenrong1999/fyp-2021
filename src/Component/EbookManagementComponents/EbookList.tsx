import React from "react";
import { Box, List, Button } from "@fluentui/react-northstar";
import { setSelectedItems } from "../MindMapComponents/common/utils";

interface EbookListProps {
  className?: string;
  setFilePath: (filePath: string) => void;
}

export const EbookList: React.FunctionComponent<EbookListProps> = (props) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  // const [filePath, setFilePath] = React.useState(
  //   "F:/Teh%20Zhen%20Rong/Downloads/PPSK_JW_Sem2_2021-2022.pdf"
  // );

  async function openFile() {
    // When the button is clicked, open the native file picker to select a PDF.
    props.setFilePath(await window.api.files.openFile());
  }

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
      content: <Button content="Add Ebook" onClick={openFile} />,
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
