import React from "react";
import {
  ProviderProps,
  Button,
  Dialog,
  Header,
  Flex,
} from "@fluentui/react-northstar";
import { NoteField } from "./NoteField";
import { dbClass } from "../Global/constant";
import {
  INoteContent,
  IEbooksContent,
  MindMapEditorContextProps,
} from "../Global/interface";
import { INode2NoteEditable } from "./NoteInterface";

interface AddNoteButtonProps
  extends ProviderProps,
    INode2NoteEditable,
    MindMapEditorContextProps {
  EbookId?: number;
  setEditing?: (editting: boolean) => void;
  disableNodeLabelRename?: boolean;
}

export const AddNoteButton: React.FunctionComponent<AddNoteButtonProps> = (
  props
) => {
  const [onChangeNoteContent, setOnChangeNoteContent] =
    React.useState<string>("");
  const [onChangeEbook, setOnChangeEbook] = React.useState<IEbooksContent>({
    EbookId: undefined,
    title: "",
  } as IEbooksContent);
  const [onChangeMindMapNodeId, setOnChangeMindMapNodeId] =
    React.useState<string>("-1");
  const [nodeLabel, setNodeLabel] = React.useState("");
  React.useEffect(() => {
    if (props.EbookId) {
      dbClass.getEbook(props.EbookId).then((ebook) => {
        setOnChangeEbook(ebook);
      });
    }
  }, [props.EbookId]);

  React.useEffect(() => {
    if (props.MindMapNodeId) {
      setOnChangeMindMapNodeId(props.MindMapNodeId);
    } else {
      if (props.graphClass)
        setOnChangeMindMapNodeId(props.graphClass.getNodes()[0].getModel().id);
    }
    console.log("props.MindMapNodeId in add note button", props.MindMapNodeId);
  }, [props.MindMapNodeId, props.graphClass]);

  return (
    <Dialog
      cancelButton="Cancel"
      confirmButton="Add Note"
      content={
        <Flex fill>
          <NoteField
            Ebook={onChangeEbook}
            NoteContent={onChangeNoteContent}
            setNoteContent={setOnChangeNoteContent}
            setOnChangeEbook={setOnChangeEbook}
            MindMapNodeId={onChangeMindMapNodeId}
            setOnChangeMindMapNodeId={(onChangeMindMapNodeId) => {
              setOnChangeMindMapNodeId(onChangeMindMapNodeId);
            }}
            nodeLabel={nodeLabel}
            setNodeLabel={setNodeLabel}
            {...props}
          />
        </Flex>
      }
      onClick={() => {
        if (props.setEditing !== undefined) props.setEditing(true);
      }}
      header="Add Note"
      trigger={<Button content="Add Note" />}
      onConfirm={async () => {
        await dbClass
          .addNewNote(onChangeNoteContent, onChangeEbook.EbookId)
          .catch((err) => {
            window.api.browserWindow.infoDialog({
              message: "Adding Note \n" + err,
              type: "error",
            });
          })
          .then((noteId) => {
            if (noteId) {
              console.log(
                "noteId before add to node2note",
                onChangeMindMapNodeId
              );
              dbClass
                .addNewNoteToNode2Note(onChangeMindMapNodeId, noteId)
                .catch((err) => {
                  window.api.browserWindow.infoDialog({
                    message: "Adding Node2Note \n" + err,
                    type: "error",
                  });
                });
            }
          });
        if (props.setEditing !== undefined) props.setEditing(false);
      }}
      onOpen={() => {
        setOnChangeNoteContent("");
        if (onChangeMindMapNodeId !== undefined) {
          setNodeLabel(
            props.graphClass
              .findById(onChangeMindMapNodeId.toString())
              .getModel().label as string
          );
        } else {
          setNodeLabel("");
        }
      }}
    />
  );
};
