import React from "react";
import {
  ProviderProps,
  Card,
  Flex,
  Header,
  Grid,
  Alert,
} from "@fluentui/react-northstar";
import {
  MindMapEditorContextProps,
  EbookBlobManagementEditableProps,
} from "../Global/interface";
import {
  NotePreview,
  EditNoteButton,
  DeleteNoteButton,
  AddNoteButton,
} from "../NoteComponents";
import { dbClass, useLiveQuery } from "../Global/constant";
import { LoadingPage } from "../Utils/LoadingPage";

interface ALlNoteGridProps
  extends ProviderProps,
    MindMapEditorContextProps,
    EbookBlobManagementEditableProps {}

export const AllNoteGrid: React.FC<ALlNoteGridProps> = (
  props: ALlNoteGridProps
) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [editting, setEditting] = React.useState<boolean>(false);
  const [noteContentList, setNoteContentList] = React.useState<JSX.Element[]>([
    <Alert
      key="alert"
      content="No notes found"
      variables={{
        oof: true,
      }}
    />,
    <AddNoteButton key="add" setEditing={setEditting} {...props} />,
  ]);

  useLiveQuery(async () => {
    console.log("useLiveQuery in Analysis ");
    await dbClass.getNotesArray().then(async (noteObjectList) => {
      if (noteObjectList.length > 0) {
        const content = [];
        for (let i = 0; i < noteObjectList.length; i++) {
          const NodeId = await dbClass.getNodeIdByNoteId(
            noteObjectList[i].NoteId
          );
          content.push(
            <Card aria-roledescription="Note Content" key={i}>
              <Flex gap="gap.small" vAlign="center">
                <Flex.Item grow>
                  <Card.Body>
                    <Flex column>
                      <NotePreview note={noteObjectList[i].NoteContent} />
                      <EditNoteButton
                        noteId={noteObjectList[i].NoteId}
                        EbookId={noteObjectList[i].EbookId}
                        MindMapNodeId={NodeId}
                        {...props}
                      />
                    </Flex>
                  </Card.Body>
                </Flex.Item>
                <Card.Footer>
                  <DeleteNoteButton noteId={noteObjectList[i].NoteId} />
                </Card.Footer>
              </Flex>
            </Card>
          );
        }
        console.log("noteObjectList in Analysis ", content);

        setNoteContentList([
          ...content,
          <AddNoteButton key="add" setEditing={setEditting} {...props} />,
        ]);
      } else {
        setNoteContentList([
          <Alert
            key="alert"
            content="No notes found"
            variables={{
              oof: true,
            }}
          />,
          <AddNoteButton key="add" setEditing={setEditting} {...props} />,
        ]);
      }

      setLoading(false);
    });
  }, [editting]);

  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <Flex column fill styles={{ overflowY: "scroll" }}>
        <Flex.Item>
          <Header as="h2" content="All Note Listed:" />
        </Flex.Item>
        <Flex.Item>
          <Grid styles={{ margin: "5px" }} content={noteContentList} />
        </Flex.Item>
      </Flex>
    );
  }
};
