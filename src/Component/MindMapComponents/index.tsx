import G6 from "@antv/g6";

import "./shape";

import * as Util from "./common/utils";

import MainEditor from "./ComponentParts/MainEditor";
import Mind from "./ComponentParts/MindMap/MindMapEditor";
import Flow from "./ComponentParts/Flow";
import Command from "./ComponentParts/Command";
import * as Interface from "./common/interfaces";
import ItemPanel, { Item } from "./ComponentParts/ItemPanel";
import DetailPanel from "./ComponentParts/DetailPanel";
import {
  RegisterNode,
  RegisterEdge,
  RegisterCommand,
  RegisterBehavior,
} from "./ComponentParts/Register";
import {
  EditorContextProps,
  withEditorContext,
} from "./ComponentParts/EditorContext";
import { baseCommand } from "./ComponentParts/Graph/command/base";

import ItemPopover from "./ComponentParts/ItemPopover";
import ContextMenu from "./ComponentParts/ContextMenu";
import EditableLabel from "./ComponentParts/EditableLabel";

import global from "./common/global";
import * as constants from "./common/constants";
import CommandManager from "./common/commandManager";
import BehaviorManager from "./common/behaviorManager";

import { setAnchorPointsState } from "./shape/common/anchor";

// import {
//   NodePanel,
//   EdgePanel,
//   MultiPanel,
//   CanvasPanel,
// } from "./ComponentParts/Panel";

export {
  G6,
  Util,
  Mind,
  Flow,
  Command,
  Item,
  Interface,
  ItemPanel,
  DetailPanel,
  RegisterNode,
  RegisterEdge,
  RegisterCommand,
  RegisterBehavior,
  EditorContextProps,
  withEditorContext,
  baseCommand,
  ItemPopover,
  ContextMenu,
  EditableLabel,
  global,
  constants,
  CommandManager,
  BehaviorManager,
  setAnchorPointsState,
  // NodePanel,
  // EdgePanel,
  // MultiPanel,
  // CanvasPanel,
};

export default MainEditor;
