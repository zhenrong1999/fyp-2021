import global from '../../../common/global';
import { guid } from "../../../common/utils";
import { NodeModel } from '../../../common/interfaces';
import { BaseCommand } from './base';

import pasteCommand from './paste';

export interface PasteHereCommandParams {
  models: NodeModel[];
}

const pasteHereCommand: BaseCommand<PasteHereCommandParams> = {
  ...pasteCommand,

  params: {
    models: [],
  },

  init() {
    const { point, models } = global.clipboard;

    this.params = {
      models: models.map(model => {
        const { x, y } = model;

        const offsetX = point.x - x;
        const offsetY = point.y - y;

        return {
          ...model,
          id: guid(),
          x: x + offsetX,
          y: y + offsetY,
        };
      }),
    };
  },

  shortcuts: [],
};

export default pasteHereCommand;
