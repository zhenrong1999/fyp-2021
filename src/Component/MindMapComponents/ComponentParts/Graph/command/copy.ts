import {cloneDeep} from 'lodash';
import Global from '../../../common/global';
import { NodeModel } from '../../../common/interfaces';
import { BaseCommand, baseCommand } from './base';


const copyCommand: BaseCommand = {
  ...baseCommand,

  canExecute(graph) {
    return !!this.getSelectedNodes(graph).length;
  },

  canUndo() {
    return false;
  },

  execute(graph) {
    const selectedNodes = this.getSelectedNodes(graph);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    Global.clipboard.models = cloneDeep(selectedNodes.map(node => node.getModel() as NodeModel));
  },

  shortcuts: [
    ['metaKey', 'c'],
    ['ctrlKey', 'c'],
  ],
};

export default copyCommand;
