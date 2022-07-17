import { TreeGraph, MindData } from "../../../common/interfaces";
import { BaseCommand } from "../../Graph/command/base";
import topicCommand from "./topic";

export interface SubtopicCommandParams {
  id: string;
  model: MindData;
}

const subtopicCommand: BaseCommand<SubtopicCommandParams, TreeGraph> = {
  ...topicCommand,

  canExecute(graph) {
    return this.getSelectedNodes(graph)[0] ? true : false;
  },

  execute(graph) {
    const { id, model } = this.params;

    // Add Node
    graph.addChild(model, id);

    // Select Node
    this.setSelectedItems(graph, [model.id]);

    // Edit Node
    this.editSelectedNode(graph);
  },

  shortcuts: ["Tab"],
};

export default subtopicCommand;
