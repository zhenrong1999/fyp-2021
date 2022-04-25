import * as React from "react";
import { Item, ItemPanel, EditorContextProps } from "./index";

interface ProvidedItemPanel extends EditorContextProps {
  style?: React.CSSProperties;
  className?: string;
}

export const ProvidedItemPanel: React.FunctionComponent<
  ProvidedItemPanel
> = () => {
  return (
    <ItemPanel className="itemPanel">
      <Item
        className="item"
        model={{
          type: "circle",
          size: 50,
          label: "circle",
          linkPoints: {
            top: true,
            bottom: true,
            left: true,
            right: true,
            fill: "#fff",
            size: 5,
          },
          getAnchorPoints: () => {
            return [
              [0.5, 0],
              [0.5, 1],
              [0, 0.5],
              [1, 0.5],
            ];
          },
        }}
      >
        <img
          src="https://gw.alicdn.com/tfs/TB1IRuSnRr0gK0jSZFnXXbRRXXa-110-112.png"
          width="55"
          height="56"
          draggable={false}
        />
      </Item>
      <Item
        className="item"
        model={{
          type: "bizFlowNode",
          size: [80, 24],
          label: "rect",
        }}
      >
        <img
          src="https://gw.alicdn.com/tfs/TB1reKOnUT1gK0jSZFrXXcNCXXa-178-76.png"
          width="89"
          height="38"
          draggable={false}
        />
      </Item>
      <Item
        className="item"
        model={{
          type: "ellipse",
          size: [100, 50],
          label: "ellipse",
        }}
      >
        <img
          src="https://gw.alicdn.com/tfs/TB1AvmVnUH1gK0jSZSyXXXtlpXa-216-126.png"
          width="108"
          height="63"
          draggable={false}
        />
      </Item>
      <Item
        className="item"
        model={{
          type: "diamond",
          size: [80, 80],
          label: "diamond",
        }}
      >
        <img
          src="https://gw.alicdn.com/tfs/TB1EB9VnNz1gK0jSZSgXXavwpXa-178-184.png"
          width="89"
          height="92"
          draggable={false}
        />
      </Item>
      <Item
        className="item"
        model={{
          type: "triangle",
          size: [30, 30],
          label: "triangle",
        }}
      >
        <img
          src="https://gw.alicdn.com/tfs/TB12sC2nKH2gK0jSZJnXXaT1FXa-126-156.png"
          width="63"
          height="78"
          draggable={false}
        />
      </Item>
    </ItemPanel>
  );
};
