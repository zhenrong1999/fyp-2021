import { guid } from './utils';
import { NodeModel } from './interfaces';

class Global {
  /** 剪贴板 */
  clipboard: {
    point: {
      x: number;
      y: number;
    };
    models: NodeModel[];
  } = {
    point: {
      x: 0,
      y: 0,
    },
    models: [],
  };

  /** 组件数据 */
  component: {
    itemPanel: {
      model: Partial<NodeModel>;
      delegateShapeClassName: string;
    };
  } = {
    itemPanel: {
      model: null,
      delegateShapeClassName: `delegateShape_${guid()}`,
    },
  };

  /** 插件数据 */
  plugin: {
    itemPopover: {
      state: 'show' | 'hide';
    };
    contextMenu: {
      state: 'show' | 'hide';
    };
    editableLabel: {
      state: 'show' | 'hide';
    };
  } = {
    itemPopover: {
      state: 'hide',
    },
    contextMenu: {
      state: 'hide',
    },
    editableLabel: {
      state: 'hide',
    },
  };
}

export default new Global();
