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
import { useLiveQuery } from "dexie-react-hooks";

interface EditNoteButtonProps extends ProviderProps {
  noteId: number;
}

export const EditNoteButton: React.FunctionComponent<EditNoteButtonProps> = (
  props
) => {
  const [onChangeNote, setOnChangeNote] = React.useState<INoteContent>({
    NoteContent: "",
    EbookId: undefined,
  } as INoteContent);
  const [onChangeNoteContent, setOnChangeNoteContent] =
    React.useState<string>();
  const [onChangeEbook, setOnChangeEbook] = React.useState<IEbooksContent>({
    EbookId: undefined,
    title: "",
  } as IEbooksContent);

  return (
    <Dialog
      cancelButton="Cancel"
      confirmButton="Save Note"
      content={
        <NoteField
          NoteContent={onChangeNoteContent}
          Ebook={onChangeEbook}
          setNoteContent={setOnChangeNoteContent}
          setOnChangeEbook={setOnChangeEbook}
        />
      }
      header="Edit Note"
      trigger={<Button content="Edit Note" />}
      onConfirm={() => {
        // props.setNote(onChangeNote);
        dbClass.updateNote(props.noteId, {
          NoteContent: onChangeNoteContent,
          EbookId: onChangeEbook.EbookId,
        } as INoteContent);
      }}
      onOpen={() => {
        dbClass.getNote(props.noteId).then((note) => {
          setOnChangeNote(note);
          setOnChangeNoteContent(note.NoteContent);
          if (note.EbookId) {
            dbClass.getEbook(note.EbookId).then((ebook) => {
              setOnChangeEbook(ebook);
            });
          }
        });
      }}
    />
  );
};
