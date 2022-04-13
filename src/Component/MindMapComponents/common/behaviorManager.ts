import G6 from '@antv/g6';
import { isMind } from './utils';
import { GraphType } from './constants';
import { Graph, Behavior } from './interfaces';

class BehaviorManager {
  behaviors: {
    [propName: string]: Behavior;
  };

  constructor() {
    this.behaviors = {};
  }

  getRegisteredBehaviors(type: GraphType) {
    const registeredBehaviors = {};

    Object.keys(this.behaviors).forEach(name => {
      const behavior = this.behaviors[name];

      const { graphType } = behavior;

      if (graphType && graphType !== type) {
        return;
      }

      const { graphMode = 'default' } = behavior;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      if (!registeredBehaviors[graphMode]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        registeredBehaviors[graphMode] = {};
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      registeredBehaviors[graphMode][name] = name;
    });

    return registeredBehaviors;
  }

  wrapEventHandler(type: GraphType, behavior: Behavior): Behavior {
    const events = behavior.getEvents();

    Object.keys(events).forEach(event => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const handlerName = events[event];
      const handler = behavior[handlerName];

      behavior[handlerName] = function(...params: any[]) {
        const { graph } = this;

        if (
          (type === GraphType.Flow && isMind(graph as Graph) === false) ||
          (type === GraphType.Mind && isMind(graph as Graph))
        ) {
          handler.apply(this, params);
        }
      };
    });

    return behavior;
  }

  register(name: string, behavior: Behavior) {
    const { graphType } = behavior;

    this.behaviors[name] = behavior;

    switch (graphType) {
      case GraphType.Flow:
        G6.registerBehavior(name, this.wrapEventHandler(GraphType.Flow, behavior));
        break;

      case GraphType.Mind:
        G6.registerBehavior(name, this.wrapEventHandler(GraphType.Mind, behavior));
        break;

      default:
        G6.registerBehavior(name, behavior);
        break;
    }
  }
}

export default new BehaviorManager();
