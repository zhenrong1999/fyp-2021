import React from "react";
import { ProviderProps } from "@fluentui/react-northstar";
import {
  MindMapEditorContextProps,
  EbookBlobManagementEditableProps,
  IEbooksContent,
} from "../Global/interface";
import { getNodesToEbook } from "./PaperRelationAlgo";
import G6, { EdgeConfig, Graph, GraphData, NodeConfig } from "@antv/g6";
import ReactDOM from "react-dom";
import { dbClass, useLiveQuery } from "../Global/constant";
import { guid } from "../MindMapComponents/common/utils";
import { result } from "lodash";

interface PaperRelationProps
  extends ProviderProps,
    MindMapEditorContextProps,
    EbookBlobManagementEditableProps {}

export const PaperRelation: React.FC<PaperRelationProps> = (
  props: PaperRelationProps
) => {
  // const nodes2Ebooks = useLiveQuery(() => getNodesToEbook(), []);

  // const graphData = props.graphClass.save();

  const ref = React.useRef<HTMLDivElement>();
  const [graph, setGraph] = React.useState<Graph>();
  const [graphData, setGraphData] = React.useState<GraphData>();

  // getNodesToEbook().then((nodesToEbook) => {
  //   console.log("graphData", nodesToEbook);
  //   setGraphData(nodesToEbook);
  // });

  React.useEffect(() => {
    if (!graph) {
      const newGraph: Graph = new G6.Graph({
        container: ref.current,
        // width: 1200,
        // height: 800,
        fitView: true,
        modes: {
          default: ["drag-canvas", "zoom-canvas"],
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
        },
      });
      setGraph(newGraph);
    }
  }, []);

  React.useEffect(() => {
    if (graph) {
      console.log("nodes2Ebooks", graphData);
      const result: { nodes: NodeConfig[]; edges: EdgeConfig[] } = {
        nodes: props.graphClass.getNodes().map((node) => {
          const nodeModel = node.getModel();
          const nodeConfig: NodeConfig = {
            id: nodeModel.id,
            label: nodeModel.label,
          };
          return nodeConfig;
        }),
        edges: props.graphClass.getEdges().map((edge) => {
          const edgeModel = edge.getModel();

          const edgeConfig: EdgeConfig = {
            id: edgeModel.id,
            source: edgeModel.source as string,
            target: edgeModel.target as string,
          };
          return edgeConfig;
        }),
      };
      getNodesToEbook().then((nodesToEbook) => {
        console.log("graphData", nodesToEbook);
        // setGraphData(nodesToEbook);
        if (nodesToEbook) {
          for (let index = 0; index < nodesToEbook.nodes.length; index++) {
            const node = nodesToEbook.nodes[index];
            const nodeConfig: NodeConfig = {
              id: node.id,
              label: node.label,
            };
            result.nodes.push(nodeConfig);
            // result.nodes.push(node);
          }

          for (let index = 0; index < nodesToEbook.edges.length; index++) {
            const edge = nodesToEbook.edges[index];
            const edgeConfig: EdgeConfig = {
              id: edge.id,
              source: edge.source as string,
              target: edge.target as string,
            };
            result.edges.push(edgeConfig);
            console.log("result edge in graphData", result);
          }
        }
        console.log("result nodes", result.nodes);
        console.log("result edges", result.edges);

        graph.data(result);
        graph.render();
      });
    }
  }, [graph, graphData]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        // overflow: "scroll",
      }}
      ref={ref}
    ></div>
  );
};
