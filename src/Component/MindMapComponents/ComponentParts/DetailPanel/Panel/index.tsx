import React from "react";
import upperFirst from "lodash/upperFirst";
import {
  Card,
  FormInput,
  Form,
  Header,
  ProviderProps,
} from "@fluentui/react-northstar";
import { DetailPanel } from "../../../index";
import { EditorContextProps } from "../../EditorContext";
import { DetailPanelComponentProps } from "../../DetailPanel";
import { NodeConfig, EdgeConfig, ComboConfig } from "@antv/g6";
import { getVariableName } from "../../../common/utils";

interface PanelProps
  extends EditorContextProps,
    DetailPanelComponentProps,
    ProviderProps {}
//
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PanelState {
  TargetModel: NodeConfig | EdgeConfig | ComboConfig;
  changedValue: string;
}

class Panel extends React.Component<PanelProps, PanelState> {
  constructor(props: any) {
    super(props);
    this.state = { changedValue: "", TargetModel: null };
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
    console.log("Saved");
  };

  onChangeHandler = (event: any) => {
    const target = event.target;
    const value = target.type === "FormInput" ? target.checked : target.value;
    // const name = target.name;

    this.setState({ changedValue: value });
    // this.setState({
    //   [name]: value,
    // });
  };

  mapPropsToFields = () => {
    const { panelType } = this.props;
    if (this.state.TargetModel) {
      const { label } = this.state.TargetModel;
      return (
        <FormInput
          name={getVariableName(() => label) as string}
          label={panelType}
          value={this.state.changedValue as string}
          onChange={this.onChangeHandler}
          onBlur={this.handleSubmit}
        />
      );
    }
  };
  renderNodeDetail = (): any => {
    const { panelType } = this.props;

    return (
      <>
        {this.mapPropsToFields()}
        {/* <FormInput
        // label="width"
        // value={width}
        // onChange={this.onChangeHandler}
        // onBlur={this.handleSubmit}
        /> */}
        {/* <FormInput
          label="height"
          value={height}
          onChange={this.onChangeHandler}
          onBlur={this.handleSubmit}
        /> */}
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
      <Card>
        <Header as="h2" content={upperFirst(type)} />
        <Form>
          {type === "node" && this.renderNodeDetail()}
          {type === "edge" && this.renderEdgeDetail()}
          {type === "multi" && this.renderMultiDetail()}
          {type === "canvas" && this.renderCanvasDetail()}
        </Form>
      </Card>
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
