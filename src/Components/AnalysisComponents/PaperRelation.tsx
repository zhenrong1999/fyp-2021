import React from "react";
import {
  ProviderProps,
  Flex,
  Card,
  Input,
  Checkbox,
} from "@fluentui/react-northstar";
import {
  MindMapEditorContextProps,
  EbookBlobManagementEditableProps,
  IEbooksContent,
} from "../Global/interface";
import { getNodesToEbook } from "./PaperRelationAlgo";
import G6, {
  EdgeConfig,
  Graph,
  GraphData,
  NodeConfig,
  LayoutConfig,
} from "@antv/g6";

interface PaperRelationProps
  extends ProviderProps,
    MindMapEditorContextProps,
    EbookBlobManagementEditableProps {}

export const PaperRelation: React.FC<PaperRelationProps> = (
  props: PaperRelationProps
) => {
  const initGraphLayout: LayoutConfig = {
    type: "radial",
    linkDistance: 210,
    nodeSize: 100,
    nodeSpacing: 100,
    preventOverlap: true,
    strictRadial: true,
  };
  const ref = React.useRef<HTMLDivElement>();
  const [graph, setGraph] = React.useState<Graph>();
  const [graphData, setGraphData] = React.useState<GraphData>();
  const [IsEbookIdShared, setIsEbookIdShared] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!graph) {
      const newGraph: Graph = new G6.Graph({
        container: ref.current,
        fitView: true,
        modes: {
          default: ["drag-canvas", "zoom-canvas"],
        },
        layout: initGraphLayout,
        defaultNode: {
          type: "ellipse",
          labelCfg: {
            style: {
              fill: "#000000A6",
              fontSize: 10,
            },
          },
          style: {
            stroke: "#72CC4A",
          },
        },
        defaultEdge: {
          type: "line",
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
      getNodesToEbook(IsEbookIdShared).then((nodesToEbook) => {
        console.log("graphData", nodesToEbook);
        if (nodesToEbook) {
          for (let index = 0; index < nodesToEbook.nodes.length; index++) {
            const node = nodesToEbook.nodes[index];
            const nodeConfig: NodeConfig = {
              id: node.id,
              label: node.label,
              type: "diamond",
            };
            result.nodes.push(nodeConfig);
          }

          for (let index = 0; index < nodesToEbook.edges.length; index++) {
            const edge = nodesToEbook.edges[index];
            const edgeConfig: EdgeConfig = {
              id: edge.id,
              source: edge.source as string,
              target: edge.target as string,
              style: {
                lineDash: [5, 5],
              },
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
  }, [IsEbookIdShared, graph, graphData, props.graphClass]);

  return (
    <Flex fill>
      <div
        style={{
          width: "75%",
          height: "100%",
        }}
        ref={ref}
      ></div>
      <Card
        style={{
          width: "25%",
          height: "100%",
          overflow: "scroll",
          float: "right",
        }}
      >
        <Flex fill column>
          <Checkbox
            label="Ebook Node is Distinct"
            toggle
            checked={IsEbookIdShared}
            onChange={(e: any) => {
              setIsEbookIdShared(!IsEbookIdShared);
            }}
          />
          <Input
            fluid
            labelPosition="inline"
            label="Radius Length"
            type="number"
            defaultValue={String(initGraphLayout.linkDistance)}
            onChange={(event: React.SyntheticEvent) => {
              graph.updateLayout({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore-line
                linkDistance: parseInt(event.target.value),
              });
            }}
          />
        </Flex>
      </Card>
    </Flex>
  );
};
