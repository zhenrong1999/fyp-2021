import React from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { MindMapEditorContextProps } from "../Global/interface";
import { INode2NoteEditable } from "./NoteInterface";
import {
  ProviderProps,
  Header,
  Dropdown,
  DropdownProps,
  FormInput,
  Status,
  AcceptIcon,
  BanIcon,
  Flex,
} from "@fluentui/react-northstar";
import { dbClass, INoteContent, IEbooksContent } from "../../Database";
import { useLiveQuery } from "dexie-react-hooks";
import { NodePath } from "../MindMapComponents";
interface NoteFieldProps extends ProviderProps, MindMapEditorContextProps {
  className?: string;
  NoteContent: string;
  MindMapNodeId?: number;
  Ebook?: IEbooksContent;
  disableNodeLabelRename?: boolean;
  nodeLabel?: string;
  setNoteContent: (noteContent: string) => void;
  setOnChangeEbook: (ebookId: IEbooksContent) => void;
  setOnChangeMindMapNodeId: (onChangeMindMapNodeId: number) => void;
  setNodeLabel: (nodeLabel: string) => void;
}

export const NoteField: React.FunctionComponent<NoteFieldProps> = (props) => {
  const EbookList = useLiveQuery(async () => {
    return await dbClass.getEbooksArray();
  });

  const [onChangeEbookSelection, setOnChangeEbookSelection] =
    React.useState<string>(props.Ebook ? props.Ebook.title : "");

  const [currentNodeId, setCurrentNodeId] = React.useState<string>(
    props.MindMapNodeId !== undefined
      ? props.MindMapNodeId.toString()
      : undefined
  );

  const [labelStatus, setLabelStatus] = React.useState({
    state: "success",
    icon: <AcceptIcon />,
    title: "saved",
  });
  function handleSubmit() {
    if (currentNodeId !== undefined) {
      props.commandManager.execute(props.graphClass, "update", {
        id: currentNodeId,
        updateModel: {
          label: props.nodeLabel,
        },
      });
      props.setGraphClass(props.graphClass);
      setLabelStatus({
        state: "success",
        icon: <AcceptIcon />,
        title: "saved",
      });
      console.log("Saved");
    }
  }
  function onChangeHandler(event: any) {
    const target = event.target;
    const value = target.type === "FormInput" ? target.checked : target.value;

    props.setNodeLabel(value);
    setLabelStatus({ state: "error", icon: <BanIcon />, title: "unsaved" });
  }

  React.useEffect(() => {
    if (
      currentNodeId !== undefined &&
      (props.MindMapNodeId === undefined ||
        props.MindMapNodeId.toString() !== currentNodeId)
    ) {
      props.setNodeLabel(
        props.graphClass.findById(currentNodeId.toString()).getModel()
          .label as string
      );
      props.setOnChangeMindMapNodeId(Number(currentNodeId));
    }
    console.log("currentNodeId in Note Field", currentNodeId);
  }, [currentNodeId, props.graphClass]);
  // React.useEffect(() => {
  //   if (
  //     props.MindMapNodeId !== undefined &&
  //     props.MindMapNodeId.toString() !== currentNodeId
  //   ) {
  //     setCurrentNodeId(props.MindMapNodeId.toString());
  //     props.setNodeLabel(
  //       props.graphClass.findById(props.MindMapNodeId.toString()).getModel()
  //         .label as string
  //     );
  //   }
  // }, [props, props.MindMapNodeId]);

  return (
    <div className="NoteEditor" data-color-mode="light">
      <Header as="h3" content="Note Content:" />
      <MDEditor
        value={props.NoteContent}
        onChange={props.setNoteContent}
        commandsFilter={(cmd) =>
          cmd && /(image)/.test(cmd.name) ? false : cmd
        }
      />
      <Header as="h3" content="Ebook Refer to:" />
      <Dropdown
        items={
          EbookList
            ? EbookList.map((ebook) => {
                if (ebook) return ebook.title;
              })
            : []
        }
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
            props.setOnChangeEbook(EbookList[ebookId]);
            setOnChangeEbookSelection(EbookList[ebookId].title);
          }
        }}
        value={onChangeEbookSelection}
      />
      <Header as="h3" content="Save to Node:" />
      <NodePath
        graph={props.graphClass}
        noEmitEvent={true}
        CurrentNodeId={currentNodeId}
        setSelectedNodeId={setCurrentNodeId}
        {...props}
      />
      <Flex>
        <FormInput
          name={"NodeLabel"}
          label={"Node Label"}
          value={props.nodeLabel}
          onChange={onChangeHandler}
          onBlur={handleSubmit}
          onEnded={handleSubmit}
          disabled={props.disableNodeLabelRename}
        />
        <Status
          state={labelStatus.state === "success" ? "success" : "error"}
          icon={labelStatus.icon}
          title={labelStatus.title}
        />
      </Flex>
    </div>
  );
};
