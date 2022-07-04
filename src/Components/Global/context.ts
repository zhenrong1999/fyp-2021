import React from "react";
import { IEbooksContent } from "./interface";

export const EbookContext = React.createContext({
  ebookSelected: {} as IEbooksContent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setEbookSelected: (ebookSelected: any) => {
    return;
  },
});
