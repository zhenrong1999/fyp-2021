import * as React from "react";
import ReactDOM from "react-dom";
import {
  IStyleSet,
  Label,
  ILabelStyles,
  Pivot,
  PivotItem,
} from "@fluentui/react";
import G6 from "@antv/g6";
import { Point } from "@antv/g-base";
// import classNames from "classnames/bind";
// import * as styles from "./MindMap.css";
import "./MindMap.css";
// let cx = classNames.bind(styles);

export const MainMindMap: React.FunctionComponent = () => {
  const ref = React.useRef(null);
  const toolBarRef = React.useRef(null);
  const data = {
    // The array of nodes
    nodes: [
      {
        id: "node1", // String, unique and required
        x: 100, // Number, the x coordinate
        y: 200, // Number, the y coordinate
      },
      {
        id: "node2", // String, unique and required
        x: 300, // Number, the x coordinate
        y: 200, // Number, the y coordinate
      },
    ],
    // The array of edges
    edges: [
      {
        source: "node1", // String, required, the id of the source node
        target: "node2", // String, required, the id of the target node
      },
    ],
  };

  const minimap = new G6.Minimap({
    size: [100, 100],
    className: "minimap",
    type: "delegate",
  });
  const grid = new G6.Grid();
  const menu = new G6.Menu();
  React.useEffect(() => {
    const toolbar = new G6.ToolBar({
      container: ReactDOM.findDOMNode(toolBarRef.current) as HTMLDivElement,
      // position: { x: 100, y: 100 } as Point,
    });

    const graph = new G6.Graph({
      container: ReactDOM.findDOMNode(ref.current) as HTMLDivElement,
      width: 1200,
      height: 800,
      modes: {
        default: [
          {
            type: "drag-canvas",
          },
          { type: "zoom-canvas" },
          {
            type: "tooltip",
            formatText(model) {
              // The content of tooltip
              const text =
                "label: " + model.label + "<br/> class: " + model.class;
              return text;
            },
          },
          {
            type: "edge-tooltip", // Edge tooltip
            formatText(model) {
              // The content of the edge tooltip
              const text =
                "source: " +
                model.source +
                "<br/> target: " +
                model.target +
                "<br/> weight: " +
                model.weight;
              return text;
            },
          },
        ],
      },
      layout: {
        type: "dagre",
        direction: "LR",
      },
      defaultNode: {
        type: "node",
        labelCfg: {
          style: {
            fill: "#000000A6",
            fontSize: 10,
          },
        },
        style: {
          stroke: "#72CC4A",
          width: 150,
        },
      },
      defaultEdge: {
        type: "polyline",
        style: { lineWidth: 10 },
      },
      plugins: [minimap, grid, toolbar, menu],
    });

    graph.data(data);
    graph.render();
  }, []);

  return (
    <div>
      <Label>Mind Map</Label>
      <div ref={toolBarRef}></div>
      <div ref={ref}></div>
    </div>
  );
};

export default function () {}
