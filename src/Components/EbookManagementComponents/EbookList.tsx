import React from "react";
import {
  Card,
  List,
  ShorthandCollection,
  ListItemProps,
  Text,
  ProviderProps,
  Flex,
  Header,
} from "@fluentui/react-northstar";
import { AddEbook } from "./AddEbook";
import { DeleteEbookButton } from "./DeleteEbook";
import { useLiveQuery } from "dexie-react-hooks";
import { dbClass } from "../Global/constant";
import { toString } from "lodash";
import {
  EbookBlobManagementEditableProps,
  EbookViewerSettingProps,
  ebookSelected,
  IEbooksContent,
} from "../Global/interface";
import { EbookContext } from "../Global/context";

interface EbookListProps
  extends ProviderProps,
    EbookBlobManagementEditableProps,
    EbookViewerSettingProps,
    ebookSelected {
  className?: string;
  setEbookSelected: (ebookSelected: IEbooksContent) => void;
}

export const EbookList: React.FunctionComponent<EbookListProps> = (props) => {
  // const ebookContextTest = React.useContext(EbookContext);
  const ebookObj: IEbooksContent = JSON.parse(props.ebookSelected);
  const ebookSize = useLiveQuery(async () => {
    return dbClass.getEbookCounts();
  });

  const ebookListArray = useLiveQuery(async () => {
    return await dbClass.getEbooksArray();
  });

  const ebookListItemView: ShorthandCollection<ListItemProps> = ebookListArray
    ? ebookListArray.map((item) => ({
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
  let index = -1;

  if (ebookListArray) {
    index = ebookListArray.findIndex(
      (item, index) => item.EbookId === ebookObj.EbookId
    );
  }

  if (ebookObj && ebookObj.EbookId > -1) {
    props.setFileBlob(
      props.ebookBlobClassObject.getEbookBlobById(ebookObj.EbookId)
    );
  }

  function setEbookBlob(selectedIndex: number) {
    props.setEbookSelected(ebookListArray[selectedIndex]);
    // props.setEbookSelected(ebookListArray[selectedIndex]);
    props.setFileBlob(
      props.ebookBlobClassObject.getEbookBlobById(
        ebookListArray[selectedIndex].EbookId
      )
    );
    index = selectedIndex;
    console.log("EbookList id", JSON.stringify(ebookListArray[selectedIndex]));
  }

  return (
    <Card className={props.className}>
      <Flex column fill className={props.className}>
        <Flex.Item>{<AddEbook {...props} />}</Flex.Item>
        <Flex.Item>
          {
            <List
              selectable
              style={{
                overflowX: "auto",
                overflowY: "auto",
              }}
              selectedIndex={index}
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
        </Flex.Item>
        <Flex.Item push>
          <Text content={`Total Ebooks: ${ebookSize}`} />
        </Flex.Item>
      </Flex>
    </Card>
  );
};
