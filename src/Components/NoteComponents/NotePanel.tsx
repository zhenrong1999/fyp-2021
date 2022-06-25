import React from "react";
import { Card, Header, Flex, ProviderProps } from "@fluentui/react-northstar";
import { AddNoteButton } from "./AddNoteButton";
import { DeleteNoteButton } from "./DeleteNoteButton";
import { EditNoteButton } from "./EditNoteButton";
import { NotePreview } from "./NotePreview";
import { dbClass } from "../Global/constant";
import { LoadingPage } from "../Utils/LoadingPage";
import { useLiveQuery } from "dexie-react-hooks";
import { INoteContent, MindMapEditorContextProps } from "../Global/interface";

interface INotePanel extends ProviderProps, MindMapEditorContextProps {
  MindMapNodeId?: number;
  EbookId?: number;
  disableNodeLabelRename?: boolean;
}

export const NotePanel: React.FC<INotePanel> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [noteContentList, setNoteContentList] = React.useState<JSX.Element[]>(
    []
  );

  const mappingNoteObject = (NoteList: number[]) => {
    if (NoteList.length > 0) {
      dbClass
        .getNoteArrayByNoteIdArray(NoteList)
        .then(async (noteObjectList) => {
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
                          disableNodeLabelRename={props.disableNodeLabelRename}
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

          setNoteContentList(content);
        });
    } else {
      setNoteContentList([]);
    }
  };
  useLiveQuery(async () => {
    console.log("useLiveQuery in NotePanel ");
    console.log("props.MindMapNodeId", props.MindMapNodeId);
    console.log("props.EbookId", props.EbookId);
    if (props.MindMapNodeId !== undefined) {
      dbClass.getNode2Note(props.MindMapNodeId).then((MindMapNode) => {
        console.log("MindMapNode", MindMapNode);
        if (MindMapNode !== undefined) {
          mappingNoteObject(MindMapNode.NoteList);
        } else {
          setNoteContentList([]);
        }
      });
    } else if (props.EbookId !== undefined) {
      dbClass.getEbook(props.EbookId).then((Ebook) => {
        console.log("Ebook", Ebook);
        if (Ebook !== undefined) {
          mappingNoteObject(Ebook.NoteList);
        } else {
          setNoteContentList([]);
        }
      });
    }
    setLoading(false);
  }, [props.MindMapNodeId, props.EbookId]);

  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <Flex column style={{ overflowY: "scroll" }}>
        <Flex.Item>
          <Header as="h3" content="Note Listed:" />
        </Flex.Item>
        <Flex.Item>
          <Flex column gap="gap.small" style={{ overflowY: "scroll" }}>
            {noteContentList}
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <AddNoteButton
            MindMapNodeId={props.MindMapNodeId}
            EbookId={props.EbookId}
            {...props}
          />
        </Flex.Item>
      </Flex>
    );
  }
};
