import { NotePanel } from "../NoteComponents";
import React from "react";
import {
  Card,
  Flex,
  ProviderProps,
  Form,
  FormInput,
  AcceptIcon,
  Status,
  BanIcon,
  Button,
} from "@fluentui/react-northstar";
import {
  ebookSelected,
  IEbooksContent,
  MindMapEditorContextProps,
} from "../Global/interface";
import { dbClass } from "../Global/constant";

export interface IEbookManagementRightPanel
  extends ProviderProps,
    ebookSelected,
    MindMapEditorContextProps {
  style?: any;
  className?: string;
}

export const EbookManagementRightPanel: React.FC<IEbookManagementRightPanel> = (
  props: IEbookManagementRightPanel
) => {
  const ebookObj = React.useRef<IEbooksContent>(
    JSON.parse(props.ebookSelected)
  );
  const [title, setTitle] = React.useState(ebookObj.current.title);
  const [labelStatus, setLabelStatus] = React.useState({
    state: "success",
    icon: <AcceptIcon />,
    title: "saved",
  });
  function handleSubmit(event: React.SyntheticEvent) {
    setLabelStatus({
      state: "error",
      icon: <BanIcon />,
      title: "unsaved",
    });
    dbClass.updateEbookTitle(ebookObj.current.EbookId, title);
  }
  function onChangeHandler(event: any) {
    const target = event.target;
    const value = target.type === "FormInput" ? target.checked : target.value;

    setTitle(value);
    setLabelStatus({ state: "error", icon: <BanIcon />, title: "unsaved" });
  }
  React.useEffect(() => {
    console.log("ebookSelected update in right panel", props.ebookSelected);
    ebookObj.current = JSON.parse(props.ebookSelected);
    setTitle(ebookObj.current.title);
  }, [props.ebookSelected]);

  return (
    <Card style={props.style} className={props.className}>
      <Flex fill column>
        <Flex.Item>
          <Form style={{ height: "max-content" }}>
            <Flex.Item grow>
              <FormInput
                fluid
                id={"EbookTitle"}
                name={"EbookTitle"}
                label={"Ebook Title"}
                value={title}
                onChange={onChangeHandler}
              />
            </Flex.Item>
            <Flex>
              <Flex.Item grow>
                <Button content="Save" key="submit" />
              </Flex.Item>
              <Status
                state={labelStatus.state === "success" ? "success" : "error"}
                icon={labelStatus.icon}
                title={labelStatus.title}
              />
            </Flex>
          </Form>
        </Flex.Item>
        <Flex.Item>
          <NotePanel EbookId={ebookObj.current.EbookId} {...props} />
        </Flex.Item>
      </Flex>
    </Card>
  );
};
