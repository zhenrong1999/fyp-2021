import React from "react";
import {
  Box,
  List,
  ShorthandCollection,
  ListItemProps,
  Text,
  Layout,
  ProviderProps,
  Flex,
  Header,
  dialogBehavior,
} from "@fluentui/react-northstar";
import { AddEbook, AddEbookProps } from "./AddEbook";
import { DeleteEbookButton } from "./DeleteEbook";
import { setSelectedItems } from "../MindMapComponents/common/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { dbClass } from "../Global/constant";
import { toString } from "lodash";
import {
  EbookBlobManagementEditableProps,
  EbookViewerSettingProps,
  globalData,
} from "../Global/interface";

interface EbookListProps
  extends ProviderProps,
    EbookBlobManagementEditableProps,
    EbookViewerSettingProps,
    globalData {
  className?: string;
}

export const EbookList: React.FunctionComponent<EbookListProps> = (props) => {
  const [itemArray, setItemArray] = React.useState<
    ShorthandCollection<ListItemProps>
  >([]);
  // const db = window.api.browserWindow.getDb();
  const ebookSize = useLiveQuery(async () => {
    return dbClass.getEbookCounts();
  });

  const ebookBlobArray = useLiveQuery(async () => {
    return await dbClass.getEbooksArray();
  });

  const ebookListItemView: ShorthandCollection<ListItemProps> = ebookBlobArray
    ? ebookBlobArray.map((item) => ({
        key: toString(item.EbookId),
        content: (
          <Flex gap="gap.small" vAlign="center">
            <Flex.Item grow>
              <Header as="h3" content={item.title} />
            </Flex.Item>
            <DeleteEbookButton ebookId={item.EbookId} {...props} />
          </Flex>
        ),
      }))
    : [];

  function setEbookBlob(selectedIndex: number) {
    const ebookId = ebookBlobArray[selectedIndex].EbookId;
    props.setFileBlob(props.ebookBlobClassObject.getEbookBlobById(ebookId));
    props.setSelectedEbookListIndex(selectedIndex);
  }

  return (
    <Box
      styles={({ theme: { siteVariables } }) => ({
        backgroundColor: siteVariables.colorScheme.default.background4,
      })}
      className={props.className}
    >
      <Layout
        vertical
        start={<AddEbook {...props} />}
        main={
          <List
            selectable
            style={{
              overflowX: "auto",
              overflowY: "auto",
            }}
            selectedIndex={props.selectedEbookListIndex}
            onSelectedIndexChange={(
              e: React.SyntheticEvent<HTMLElement>,
              changeObject: { selectedIndex: number }
            ) => {
              if (changeObject.selectedIndex >= 0) {
                setEbookBlob(changeObject.selectedIndex);
              }
            }}
            items={ebookListItemView}
          />
        }
        end={<Text content={`Total Ebooks: ${ebookSize}`} />}
      />
    </Box>
  );
};
