import React from "react";
import { Card, Layout, Flex, ProviderProps } from "@fluentui/react-northstar";
import { AddNoteButton } from "./AddNoteButton";
import { DeleteNoteButton } from "./DeleteNoteButton";
import { EditNoteButton } from "./EditNoteButton";
import { NotePreview } from "./NotePreview";
import { dbClass } from "../Global/constant";
import { LoadingPage } from "../Utils/LoadingPage";
import { useLiveQuery } from "dexie-react-hooks";

interface INotePanel extends ProviderProps {
  MindMapNodeId: number;
}

export const NotePanel: React.FC<INotePanel> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [noteContentList, setNoteContentList] = React.useState<JSX.Element[]>(
    []
  );
  useLiveQuery(async () => {
    dbClass
      .getNode2Note(props.MindMapNodeId)
      .then((MindMapNode) => {
        if (MindMapNode && MindMapNode.NoteList.length > 0) {
          dbClass
            .getNoteArrayByNoteIdArray(MindMapNode.NoteList)
            .then((noteObjectList) => {
              const content = noteObjectList.map((note, index) => {
                return (
                  <Card aria-roledescription="Note Content" key={index}>
                    <Flex gap="gap.small" vAlign="center">
                      <Flex.Item grow>
                        <Card.Body>
                          <Flex column>
                            <NotePreview note={note.NoteContent} />
                            <EditNoteButton noteId={note.NoteId} />
                          </Flex>
                        </Card.Body>
                      </Flex.Item>
                      <Card.Footer>
                        <DeleteNoteButton noteId={note.NoteId} />
                      </Card.Footer>
                    </Flex>
                  </Card>
                );
              });
              setNoteContentList(content);
            });
        } else setNoteContentList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  });
  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <Layout
        vertical
        start="Note Listed:"
        main={noteContentList}
        end={<AddNoteButton MindMapNodeId={props.MindMapNodeId} />}
      />
    );
  }
};
