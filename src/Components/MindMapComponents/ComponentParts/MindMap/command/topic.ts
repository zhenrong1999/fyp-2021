import { guid } from "../../../common/utils";
import { LABEL_DEFAULT_TEXT } from "../../../common/constants";
import { TreeGraph, MindData } from "../../../common/interfaces";
import { BaseCommand, baseCommand } from "../../Graph/command/base";

export interface TopicCommandParams {
  id: string;
  model: MindData;
}

export const topicCommand: BaseCommand<TopicCommandParams, TreeGraph> = {
  ...baseCommand,

  params: {
    id: "",
    model: {
      id: "",
    },
  },

  canExecute(graph) {
    const selectedNodes = this.getSelectedNodes(graph);

    return (
      selectedNodes.length &&
      selectedNodes.length === 1 &&
      selectedNodes[0].get("parent")
    );
  },

  init(graph) {
    if (this.params.id) {
      return;
    }

    const selectedNode = this.getSelectedNodes(graph)[0];

    this.params = {
      id: selectedNode.get("id"),
      model: {
        id: guid(),
        label: LABEL_DEFAULT_TEXT,
      },
    };
  },

  execute(graph) {
    const { id, model } = this.params;

    const parent = graph.findById(id).get("parent");

    // Add Node
    graph.addChild(model, parent);

    // Select Node
    this.setSelectedItems(graph, [model.id]);

    // Edit Node
    this.editSelectedNode(graph);
  },

  undo(graph) {
    const { id, model } = this.params;

    this.setSelectedItems(graph, [id]);

    graph.removeChild(model.id);
  },

  shortcuts: ["Enter"],
};

export default topicCommand;
