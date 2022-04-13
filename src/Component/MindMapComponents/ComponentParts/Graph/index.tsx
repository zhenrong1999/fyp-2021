import React from "react";
import pick from "lodash/pick";
import { isMind } from "../../common/utils";
import {
  GraphCommonEvent,
  GraphNodeEvent,
  GraphEdgeEvent,
  GraphCanvasEvent,
  GraphCustomEvent,
} from "../../common/constants";
import {
  Command,
  Graph,
  FlowData,
  MindData,
  GraphNativeEvent,
  GraphReactEvent,
  GraphReactEventProps,
} from "../../common/interfaces";
import {
  EditorPrivateContextProps,
  withEditorPrivateContext,
} from "../EditorContext";
import baseCommands from "./command";
import mindCommands from "../MindMap/command";
import CommandManager from "../../common/commandManager";
import "./behavior";

interface GraphProps
  extends Partial<GraphReactEventProps>,
    EditorPrivateContextProps {
  style?: React.CSSProperties;
  className?: string;
  containerId: string;
  data: FlowData | MindData;
  parseData(data: object): void;
  initGraph(width: number, height: number): Graph;
  setGraph: (graph: Graph) => void;
  commandManager: CommandManager;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GraphState {}

class GraphComponent extends React.Component<GraphProps, GraphState> {
  graph: Graph | null = null;
  commandManager: CommandManager = new CommandManager();
  windowSize: { width: number; height: number };

  componentDidMount() {
    this.initGraph();
    this.bindEvent();
  }

  componentDidUpdate(prevProps: GraphProps) {
    const { data } = this.props;

    if (data !== prevProps.data) {
      this.changeData(data);
    }
  }

  focusRootNode(graph: Graph, data: FlowData | MindData) {
    if (!isMind(graph)) {
      return;
    }

    const { id } = data as MindData;

    graph.focusItem(id);
  }

  initGraph() {
    const { containerId, parseData, initGraph, setGraph, commandManager } =
      this.props;
    const { clientWidth = 0, clientHeight = 0 } =
      document.getElementById(containerId) || {};

    // 解析数据
    const data = { ...this.props.data };

    parseData(data);

    // 初始画布
    this.graph = initGraph(clientWidth, clientHeight);

    this.graph.data(data);
    this.graph.render();
    this.focusRootNode(this.graph, data);
    this.graph.setMode("default");

    this.windowSize = { width: window.innerWidth, height: window.innerHeight };

    if (setGraph && typeof setGraph === "function") {
      setGraph(this.graph);
    }

    // 设置命令管理器
    this.graph.set("commandManager", commandManager);

    // 注册命令
    let commands = baseCommands;

    if (isMind(this.graph)) {
      commands = {
        ...commands,
        ...mindCommands,
      };
    }

    Object.keys(commands).forEach((name) => {
      this.props.commandManager.register(
        name,
        Object.getOwnPropertyDescriptor(commands, name).value as Command<
          object,
          Graph
        >
      );
    });
  }

  bindEvent() {
    const { graph, props } = this;

    if (!graph) {
      return;
    }

    const events: {
      [propName in GraphReactEvent]: GraphNativeEvent;
    } = {
      ...GraphCommonEvent,
      ...GraphNodeEvent,
      ...GraphEdgeEvent,
      ...GraphCanvasEvent,
      ...GraphCustomEvent,
    };

    (Object.keys(events) as GraphReactEvent[]).forEach((event) => {
      if (typeof props[event] === "function") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        graph.on(events[event], props[event]);
      }
    });
  }

  changeData(data: any) {
    const { graph } = this;
    const { parseData } = this.props;

    if (!graph) {
      return;
    }

    parseData(data);

    graph.changeData(data);
    this.focusRootNode(graph, data);
  }

  render() {
    const { containerId, children } = this.props;

    window.onresize = () => {
      const diff = {
        width: window.innerWidth - this.windowSize.width,
        height: window.innerHeight - this.windowSize.height,
      };
      this.graph.changeSize(
        this.graph.getWidth() + diff.width,
        this.graph.getHeight() + diff.height
      );
      this.graph.refresh();
      this.windowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };
    return (
      <div id={containerId} {...pick(this.props, ["className", "style"])}>
        {children}
      </div>
    );
  }
}

export default withEditorPrivateContext(GraphComponent);
