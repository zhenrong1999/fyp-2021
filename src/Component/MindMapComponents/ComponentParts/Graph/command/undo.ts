import { Command } from '../../../common/interfaces';
import CommandManager from '../../../common/commandManager';

const undoCommand: Command = {
  name: 'undo',

  params: {},

  canExecute(graph) {
    const commandManager: CommandManager = graph.get('commandManager');
    const { commandIndex } = commandManager;

    return commandIndex > 0;
  },

  shouldExecute() {
    return true;
  },

  canUndo() {
    return false;
  },

  init() {return},

  execute(graph) {
    const commandManager: CommandManager = graph.get('commandManager');
    const { commandQueue, commandIndex } = commandManager;

    commandQueue[commandIndex - 1].undo(graph);

    commandManager.commandIndex -= 1;
  },

  undo() {return},

  shortcuts: [
    ['metaKey', 'z'],
    ['ctrlKey', 'z'],
  ],
};

export default undoCommand;
