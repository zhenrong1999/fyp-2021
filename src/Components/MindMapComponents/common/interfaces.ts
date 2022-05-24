/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  GraphType,
  GraphState,
  LabelState,
  EditorCommand,
  GraphCommonEvent,
  GraphNodeEvent,
  GraphEdgeEvent,
  GraphCanvasEvent,
  GraphCustomEvent,
} from './constants';
import {
  IGroup as IGGroup,
  IShape as IGShape,
  IPoint,
  Graph as IGraph, TreeGraph as ITreeGraph,
  ShapeStyle as IShapeStyle,
  GraphOptions as IGraphOptions,
  GraphData as IGraphData,
  TreeGraphData as ITreeGraphData,
  NodeConfig as INodeConfig,
  EdgeConfig as IEdgeConfig,
  BehaviorOption as IBehaviorOption,
  IG6GraphEvent as IGraphEvent,
  ShapeOptions as IShapeOptions,
  INode, IEdge
} from '@antv/g6';

export interface GShape extends IGShape {}
export interface GGroup extends IGGroup {}

export interface Graph extends IGraph {}
export interface TreeGraph extends ITreeGraph {}

export interface AnchorPoint extends IPoint {
  index: number;
}

export interface ShapeStyle extends IShapeStyle {}

export interface FlowData extends IGraphData {}
export interface MindData extends ITreeGraphData {}

export interface NodeModel extends INodeConfig {}
export interface EdgeModel extends IEdgeConfig {}
export interface GraphEvent extends IGraphEvent {}

export interface GraphOptions extends IGraphOptions {}
export interface CustomShape extends IShapeOptions {}
export interface CustomNode extends CustomShape {}
export interface CustomEdge extends CustomShape {}

export type Item = Node | Edge;
export interface Node extends INode {}
export interface Edge extends IEdge {}

export interface Behavior extends IBehaviorOption {
  graph?: Graph;
  graphType?: GraphType;
  graphMode?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
}

export interface Command<P = object, G = Graph> {
  /** 命令名称 */
  name: string;
  /** 命令参数 */
  params: P;
  /** 是否可以执行 */
  canExecute(graph: G): boolean;
  /** 是否应该执行 */
  shouldExecute(graph: G): boolean;
  /** 是否可以撤销 */
  canUndo(graph: G): boolean;
  /** 初始命令 */
  init(graph: G): void;
  /** 执行命令 */
  execute(graph: G): void;
  /** 撤销命令 */
  undo(graph: G): void;
  /** 命令快捷键 */
  shortcuts: string[] | string[][];
}

export interface CommandEvent {
  name: EditorCommand;
  params: object;
}

export interface GraphStateEvent {
  graphState: GraphState;
}

export interface LabelStateEvent {
  labelState: LabelState;
}

export type GraphNativeEvent = GraphCommonEvent | GraphNodeEvent | GraphEdgeEvent | GraphCanvasEvent | GraphCustomEvent;

export type GraphReactEvent =
  | keyof typeof GraphCommonEvent
  | keyof typeof GraphNodeEvent
  | keyof typeof GraphEdgeEvent
  | keyof typeof GraphCanvasEvent
  | keyof typeof GraphCustomEvent;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GraphReactEventProps = Record<GraphReactEvent, (e: any) => void>;
