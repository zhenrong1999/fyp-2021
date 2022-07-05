import { ProviderProps } from "@fluentui/react-northstar";
import { EbookBlobManagementEditableProps } from "../Global/interface";
import React from "react";

interface WebViewProps
  extends ProviderProps,
    EbookBlobManagementEditableProps {}

export const WebView: React.FC<WebViewProps> = (props) => {
  const [blob, setBlob] = React.useState<Buffer>();
  React.useEffect(() => {
    window.api.files
      .downloadFile("https://arxiv.org/pdf/astro-ph/0608371v1.pdf")
      .then((data) => {
        console.log(data);
        setBlob(data);
      });
  }, []);
  return (
    <embed
      width="100%"
      height="100%"
      // src={`data:application/pdf;base64,${blob.toString("base64")}`}
    ></embed>
  );
};
