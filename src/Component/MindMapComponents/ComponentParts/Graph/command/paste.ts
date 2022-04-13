import global from '../../../common/global';
import { guid,executeBatch } from "../../../common/utils";
import { ItemType } from '../../../common/constants';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NodeModel, EdgeModel } from '../../../common/interfaces';
import { BaseCommand, baseCommand } from './base';

export interface PasteCommandParams {
  models: NodeModel[];
}

const pasteCommand: BaseCommand<PasteCommandParams> = {
  ...baseCommand,

  params: {
    models: [],
  },

  canExecute() {
    return !!global.clipboard.models.length;
  },

  init() {
    const { models } = global.clipboard;

    const offsetX = 10;
    const offsetY = 10;

    this.params = {
      models: models.map(model => {
        const { x, y } = model;

        return {
          ...model,
          id: guid(),
          x: x + offsetX,
          y: y + offsetY,
        };
      }),
    };
  },

  execute(graph) {
    const { models } = this.params;

    executeBatch(graph, () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      models.forEach(model => {
        graph.addItem(ItemType.Node, model);
      });
    });

    this.setSelectedItems(
      graph,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      models.map(model => model.id),
    );
  },

  undo(graph) {
    const { models } = this.params;

    executeBatch(graph, () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      models.forEach(model => {
        graph.removeItem(model.id);
      });
    });
  },

  shortcuts: [
    ['metaKey', 'v'],
    ['ctrlKey', 'v'],
  ],
};

export default pasteCommand;
