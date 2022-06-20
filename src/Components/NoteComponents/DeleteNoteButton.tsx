import React from "react";
import {
  ProviderProps,
  Button,
  Dialog,
  Header,
  TrashCanIcon,
} from "@fluentui/react-northstar";
import { dbClass } from "../Global/constant";
import { INoteEditable } from "./NoteInterface";

interface DeleteNoteButtonProps extends ProviderProps, INoteEditable {}

export const DeleteNoteButton: React.FunctionComponent<
  DeleteNoteButtonProps
> = (props) => {
  return (
    <Button
      icon={<TrashCanIcon />}
      iconOnly
      title="Delete Note"
      onClick={async () => {
        await dbClass
          .deleteNote(props.noteId)
          .then(() => {
            alert("Note Deleted");
          })
          .catch((err) => {
            alert("Deleting Note \n" + err);
          });
      }}
    />
  );
};
