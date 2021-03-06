import { Command } from '../../../common/interfaces';
import CommandManager from '../../../common/commandManager';

const redoCommand: Command = {
  name: 'redo',

  params: {},

  canExecute(graph) {
    const commandManager: CommandManager = graph.get('commandManager');
    const { commandQueue, commandIndex } = commandManager;

    return commandIndex < commandQueue.length;
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

    commandQueue[commandIndex].execute(graph);

    commandManager.commandIndex += 1;
  },

  undo() {return},

  shortcuts: [
    ['metaKey', 'shiftKey', 'z'],
    ['ctrlKey', 'shiftKey', 'z'],
  ],
};

export default redoCommand;
