import React from "react";
import {
  ProviderProps,
  Button,
  Dialog,
  Header,
} from "@fluentui/react-northstar";
import { NoteField } from "./NoteField";
import { dbClass } from "../Global/constant";
import { INoteContent, IEbooksContent } from "../Global/interface";
import { INode2NoteEditable } from "./NoteInterface";

interface AddNoteButtonProps extends ProviderProps, INode2NoteEditable {}

export const AddNoteButton: React.FunctionComponent<AddNoteButtonProps> = (
  props
) => {
  const [onChangeNote, setOnChangeNote] = React.useState<INoteContent>({
    NoteContent: "",
    EbookId: undefined,
  } as INoteContent);
  const [onChangeNoteContent, setOnChangeNoteContent] =
    React.useState<string>("");
  const [onChangeEbook, setOnChangeEbook] = React.useState<IEbooksContent>({
    EbookId: undefined,
    title: "",
  } as IEbooksContent);
  return (
    <Dialog
      cancelButton="Cancel"
      confirmButton="Add Note"
      content={
        <NoteField
          Ebook={onChangeEbook}
          NoteContent={onChangeNoteContent}
          setNoteContent={setOnChangeNoteContent}
          setOnChangeEbook={setOnChangeEbook}
        />
      }
      header="Add Note"
      trigger={<Button content="Add Note" />}
      onConfirm={async () => {
        await dbClass
          .addNewNote(onChangeNoteContent, onChangeEbook.EbookId)
          .catch((err) => {
            alert("Adding Note \n" + err);
          })
          .then((noteId) => {
            if (noteId) {
              dbClass
                .addNewNoteToNode2Note(props.MindMapNodeId, noteId)
                .catch((err) => {
                  alert("Adding Node2Note \n" + err);
                });
            }
          });
      }}
    />
  );
};
