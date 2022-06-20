import React from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { INoteEditable } from "./NoteInterface";
import {
  ProviderProps,
  Header,
  Dropdown,
  DropdownProps,
} from "@fluentui/react-northstar";
import { dbClass, INoteContent, IEbooksContent } from "../../Database";
import { useLiveQuery } from "dexie-react-hooks";
interface NoteFieldProps extends ProviderProps {
  className?: string;
  NoteContent: string;
  Ebook?: IEbooksContent;
  setNoteContent: (noteContent: string) => void;
  setOnChangeEbook: (ebookId: IEbooksContent) => void;
}

export const NoteField: React.FunctionComponent<NoteFieldProps> = (props) => {
  const EbookList = useLiveQuery(async () => {
    return await dbClass.getEbooksArray();
  });

  const [onChangeEbookSelection, setOnChangeEbookSelection] =
    React.useState<string>(props.Ebook.title);

  return (
    <div className="NoteEditor" data-color-mode="light">
      <Header content="Note Content:" />
      <MDEditor
        value={props.NoteContent}
        onChange={props.setNoteContent}
        commandsFilter={(cmd) =>
          cmd && /(image)/.test(cmd.name) ? false : cmd
        }
      />
      <Header content="Ebook Refer to:" />
      <Dropdown
        items={EbookList ? EbookList.map((ebook) => ebook.title) : []}
        placeholder={
          props.Ebook
            ? props.Ebook.title
            : "Select Ebook or Type Ebook Filename/Title"
        }
        noResultsMessage="We couldn't find any matches."
        search
        checkable
        onChange={(e: React.SyntheticEvent, item: DropdownProps) => {
          if (item) {
            const ebookId = item.items.indexOf(item.value);
            // props.setNote({
            //   ...props.Note,
            //   EbookId: EbookList[ebookId].EbookId,
            // });
            props.setOnChangeEbook(EbookList[ebookId]);
            setOnChangeEbookSelection(EbookList[ebookId].title);
          }
        }}
        value={onChangeEbookSelection}
      />
    </div>
  );
};
