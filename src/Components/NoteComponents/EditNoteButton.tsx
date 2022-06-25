import React from "react";
import {
  ProviderProps,
  Button,
  Dialog,
  Header,
} from "@fluentui/react-northstar";
import { NoteField } from "./NoteField";
import { dbClass } from "../Global/constant";
import {
  INoteContent,
  IEbooksContent,
  MindMapEditorContextProps,
} from "../Global/interface";
import { INode2NoteEditable } from "./NoteInterface";
import { useLiveQuery } from "dexie-react-hooks";

interface EditNoteButtonProps
  extends ProviderProps,
    MindMapEditorContextProps,
    INode2NoteEditable {
  noteId: number;
  EbookId?: number;
  disableNodeLabelRename?: boolean;
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
  const [onChangeMindMapNodeId, setOnChangeMindMapNodeId] =
    React.useState<number>(-1);

  const [nodeLabel, setNodeLabel] = React.useState("");

  React.useEffect(() => {
    if (props.EbookId) {
      dbClass.getEbook(props.EbookId).then((ebook) => {
        setOnChangeEbook(ebook);
      });
    }
  }, [props.EbookId]);

  React.useEffect(() => {
    if (props.MindMapNodeId !== undefined) {
      setOnChangeMindMapNodeId(props.MindMapNodeId);
    }
  }, [props.MindMapNodeId]);

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
          setOnChangeMindMapNodeId={setOnChangeMindMapNodeId}
          nodeLabel={nodeLabel}
          setNodeLabel={setNodeLabel}
          {...props}
        />
      }
      header="Edit Note"
      trigger={<Button content="Edit Note" />}
      onConfirm={() => {
        // props.setNote(onChangeNote);
        dbClass.updateNoteContentAndEbookId(
          props.noteId,
          onChangeNoteContent,
          onChangeEbook.EbookId
        );
        if (onChangeMindMapNodeId) {
          dbClass.updateNoteToNode2Note(onChangeMindMapNodeId, props.noteId);
        }
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
          setNodeLabel("");
        });
      }}
    />
  );
};
