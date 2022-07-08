import React from "react";
import upperFirst from "lodash/upperFirst";
import {
  FormInput,
  Form,
  Header,
  ProviderProps,
  Flex,
  Status,
  AcceptIcon,
  BanIcon,
} from "@fluentui/react-northstar";
import { DetailPanel } from "../../index";
import { EditorContextProps } from "../EditorContext";
import { DetailPanelComponentProps } from "../DetailPanel";
import { NodeConfig, EdgeConfig, ComboConfig } from "@antv/g6";
import { NotePanel } from "../../../NoteComponents";
import { toNumber } from "lodash";
import { NodePath } from "../NodePath";
import { TreeGraph, Node, Edge } from "../../common/interfaces";
import { ItemState } from "../../common/constants";
import {
  executeBatch,
  getMindRecallEdges,
  setHighLightState,
  clearHighLightState,
} from "../../common/utils";
import { capitalize } from "lodash";

interface PanelProps
  extends EditorContextProps,
    DetailPanelComponentProps,
    ProviderProps {}

interface PanelState {
  TargetModel: NodeConfig | EdgeConfig | ComboConfig;
  changedValue: string;
  labelStatus: { state: string; icon: JSX.Element; title: string };
}

class Panel extends React.Component<PanelProps, PanelState> {
  constructor(props: any) {
    super(props);
    this.state = {
      changedValue: "",
      TargetModel: null,
      labelStatus: {
        state: "success",
        icon: <AcceptIcon />,
        title: "saved",
      },
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }
  componentDidMount() {
    const { panelType, nodes, edges } = this.props;
    // let label = "";
    let targetModel: NodeConfig | EdgeConfig | ComboConfig;
    if (panelType === "node") {
      targetModel = nodes[0].getModel();
    }

    if (panelType === "edge") {
      targetModel = edges[0].getModel();
    }

    this.setState({ TargetModel: targetModel });

    if (targetModel) {
      // const unknownTypeLabel = targetModel.label;
      // if (typeof unknownTypeLabel === "string") {
      //   label = unknownTypeLabel;
      // }

      this.setState({ changedValue: targetModel.label as string });
    }
  }
  shouldComponentUpdate(
    nextProps: Readonly<PanelProps>,
    nextState: Readonly<PanelState>,
    nextContext: any
  ): boolean {
    if (
      nextProps.nodes[0] !== this.props.nodes[0] ||
      nextState.TargetModel !== this.state.TargetModel ||
      nextState.changedValue !== this.state.changedValue ||
      nextState.labelStatus !== this.state.labelStatus
    ) {
      console.log("shouldComponentUpdate", nextProps, nextState);
      return true;
    }
    return false;
  }

  componentDidUpdate(
    prevProps: Readonly<PanelProps>,
    prevState: Readonly<PanelState>,
    snapshot?: any
  ): void {
    if (prevProps.nodes !== this.props.nodes) {
      if (this.props.nodes[0].getModel) {
        const targetModel = this.props.nodes[0].getModel();
        this.setState({ TargetModel: targetModel });
        this.setState({ changedValue: targetModel.label as string });
        setHighLightState(this.props.graph, targetModel.id);
      }
    }
  }

  componentWillUnmount(): void {
    if (this.state.TargetModel) {
      clearHighLightState(this.props.graph);
    }
  }

  checkString(s: any): string {
    if (typeof s === "string") {
      return s;
    }
    return "";
  }
  handleSubmit = (e: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { panelType, nodes, edges, executeCommand } = this.props;
    const { changedValue } = this.state;
    const item = panelType === "node" ? nodes[0] : edges[0];

    if (!item) {
      return;
    }
    // e.currentTarget.value as typeOf Input;
    executeCommand("update", {
      id: item.get("id"),
      updateModel: {
        label: changedValue,
      },
    });
    this.setState({
      labelStatus: {
        state: "success",
        icon: <AcceptIcon />,
        title: "saved",
      },
    });
    console.log("Saved");
  };

  onChangeHandler = (event: any) => {
    const target = event.target;
    const value = target.type === "FormInput" ? target.checked : target.value;
    // const name = target.name;

    this.setState({ changedValue: value });
    this.setState({
      labelStatus: { state: "error", icon: <BanIcon />, title: "unsaved" },
    });
    // this.setState({
    //   [name]: value,
    // });
  };

  mapPropsToFields = () => {
    const { panelType } = this.props;
    if (this.state.TargetModel) {
      const { label } = this.state.TargetModel;
      return (
        <Flex style={{ width: "100%" }}>
          <Flex.Item grow>
            <FormInput
              fluid
              name={"label"}
              label={capitalize(panelType) + " Label"}
              value={this.state.changedValue as string}
              onChange={this.onChangeHandler}
              onBlur={this.handleSubmit}
            />
          </Flex.Item>
          <Status
            state={
              this.state.labelStatus.state === "success" ? "success" : "error"
            }
            icon={this.state.labelStatus.icon}
            title={this.state.labelStatus.title}
          />
        </Flex>
      );
    }
  };
  renderNodeDetail = (): any => {
    const { panelType } = this.props;
    return (
      <>
        {this.mapPropsToFields()}

        {this.state.TargetModel && (
          <Flex column fill gap="gap.medium">
            <NotePanel
              {...this.props}
              MindMapNodeId={this.state.TargetModel.id}
              graphClass={this.props.graph}
              setGraphClass={undefined}
              disableNodeLabelRename={true}
            />
            <NodePath
              {...this.props}
              CurrentNodeId={this.state.TargetModel.id}
            />
          </Flex>
        )}

        <p>a node is selected :) </p>
      </>
    );
  };

  renderEdgeDetail = (): any => {
    const { panelType } = this.props;
    return (
      <>
        {this.mapPropsToFields()} <p>a edge is selected :) </p>
      </>
    );
  };

  renderMultiDetail = (): any => {
    return null;
  };

  renderCanvasDetail = (): any => {
    return <p>Select a node or edge :)</p>;
  };

  render() {
    const type = this.props.panelType.valueOf();
    return (
      <Flex
        fill
        column
        padding="padding.medium"
        style={{ overflowY: "scroll" }}
      >
        <Flex.Item>
          <Header as="h2" content={upperFirst(type)} />
        </Flex.Item>

        <Flex.Item>
          <Form
            style={{
              overflowX: "auto",
              overflowY: "scroll",
            }}
          >
            {type === "node" && this.renderNodeDetail()}
            {type === "edge" && this.renderEdgeDetail()}
            {type === "multi" && this.renderMultiDetail()}
            {type === "canvas" && this.renderCanvasDetail()}
          </Form>
        </Flex.Item>
      </Flex>
    );
  }
}

// const WrappedPanel = Form.create({
//   component: "Form",
// } as ShortHandFactory)(Panel)();

// const WrappedPanel = Form.create(
//   mapPropsToFields(props)
// )(withEditorContext(Panel));

// function mapPropsToFields2(props: any) {
//   const { panelType, nodes, edges } = props;
//   let label = "";
//   if (panelType === "node") {
//     const unknownTypeLabel = nodes[0].getModel().label;
//     if (typeof unknownTypeLabel === "string") {
//       label = unknownTypeLabel;
//     }
//   }

//   if (panelType === "edge") {
//     const unknownTypeLabel = edges[0].getModel().label;
//     if (typeof unknownTypeLabel === "string") {
//       label = unknownTypeLabel;
//     }
//   }
// }

// type WrappedPanelProps = Omit<PanelProps, keyof FormFieldProps>;

export const NodePanel = DetailPanel.create<PanelProps>("node")(Panel);
export const EdgePanel = DetailPanel.create<PanelProps>("edge")(Panel);
export const MultiPanel = DetailPanel.create<PanelProps>("multi")(Panel);
export const CanvasPanel = DetailPanel.create<PanelProps>("canvas")(Panel);
