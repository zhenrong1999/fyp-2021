/* eslint-disable @typescript-eslint/no-explicit-any */
// import { PDFDocumentProxy } from "pdfjs-dist";
// import { pdfjs } from "react-pdf";
// import PDFJSWorker from "pdfjs-dist/build/pdf.worker.js";
// import { TypedArray, TextItem } from "pdfjs-dist/types/src/display/api";
// import { TextItem } from "react-pdf";
import React from "react";
import {
  Flex,
  Form,
  Input,
  Text,
  Tree,
  ProviderProps,
  FlexItem,
  ObjectShorthandCollection,
  TreeItemProps,
  FormInput,
  FormButton,
  ObjectShorthandValue,
} from "@fluentui/react-northstar";
import {
  MindMapEditorContextProps,
  EbookBlobManagementEditableProps,
} from "../Global/interface";
import { useLiveQuery, dbClass } from "../Global/constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, IconProp } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
library.add(fas);
// import { Buffer } from "buffer";

// pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.js";

// const getPageText = async (pdf: pdfjs.PDFDocumentProxy, pageNo: number) => {
//   const page = await pdf.getPage(pageNo);
//   const tokenizedText = await page.getTextContent();
//   const pageText = tokenizedText.items
//     .map((token: TextItem) => token.str)
//     .join("");
//   return pageText;
// };

// /* see example of a PDFSource below */
// export const getPDFText = async (source: TypedArray): Promise<string[]> => {
//   const pdf = await pdfjs.getDocument(source).promise;
//   const maxPages = pdf.numPages;
//   const pageTextPromises = [];
//   for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
//     pageTextPromises.push(getPageText(pdf, pageNo));
//   }
//   const pageTexts = await Promise.all(pageTextPromises);
//   return pageTexts;
// };

function highlightPattern(text: string, pattern: string | RegExp) {
  const splitText = text.split(pattern);

  if (splitText.length <= 1) {
    return text;
  }

  const matches = text.match(pattern);

  return splitText.reduce(
    (arr: any, element: any, index) =>
      matches[index]
        ? [
            ...arr,
            element,
            <mark id={"highlighted" + index} key={index}>
              {matches[index]}
            </mark>,
          ]
        : [...arr, element],
    []
  );
}

interface SearchAllTextProps
  extends ProviderProps,
    MindMapEditorContextProps,
    EbookBlobManagementEditableProps {}
export const SearchAllText: React.FC<SearchAllTextProps> = (
  props: SearchAllTextProps
) => {
  const EbookList = useLiveQuery(async () => {
    return await dbClass.getEbooksArray();
  });

  const [treeItems, setTreeItems] = React.useState<
    ObjectShorthandCollection<TreeItemProps>
  >([]);

  props.ebookBlobClassObject.searchEbookInit();

  return (
    <Flex column style={{ height: "100%", overflow: "hidden" }} gap="gap.small">
      <Form
        style={{ padding: "10px", top: 0, height: "max-content" }}
        onSubmit={(event: React.SyntheticEvent) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore-next-line
          const searchText = event.target["searchText"].value;
          const searchRegExp = new RegExp(searchText, "i");
          const result = props.ebookBlobClassObject.searchAllText(searchText);
          const tree = result.map((book) => {
            return {
              id: book.EbookId.toString(),
              title: EbookList.find((ebook) => ebook.EbookId === book.EbookId)
                .title,
              expanded: true,
              selected: true,
              items: book.text
                .map((page: string, pageIndex: number) => {
                  return {
                    id: book.EbookId.toString() + "-" + pageIndex,
                    title: "Page" + (pageIndex + 1),
                    expanded: true,
                    selected: true,
                    items: page
                      .split(/[.|\n]/ as RegExp)
                      .filter(
                        (sentence: string) =>
                          sentence.match(searchRegExp) !== null
                      )
                      .map((sentence: string, index: number) => {
                        return {
                          id:
                            book.EbookId +
                            "-" +
                            pageIndex.toString() +
                            "-" +
                            index.toString(),
                          expanded: true,
                          selected: true,
                          title: {
                            content: (
                              <Text>
                                {highlightPattern(sentence, searchRegExp)}
                              </Text>
                            ),
                          },
                        };
                      }),
                  };
                })
                .filter((page) => {
                  if (page.items !== undefined) {
                    if (page.items.length > 0) return true;
                  }
                  return false;
                }),
            };
          });
          console.log("searchText", searchText);
          console.log("result", result);
          console.log("tree", tree);
          setTreeItems(tree);
        }}
      >
        <Flex gap="gap.small">
          <FlexItem grow>
            <FormInput
              id="searchText"
              key="searchText"
              placeholder="Search..."
              role="search_ebook_text"
              style={{ display: "flex" }}
              styles={{ flex: 1, width: "max-content" }}
              inline={true}
              fluid={true}
            />
          </FlexItem>
          <FormButton
            icon={<FontAwesomeIcon icon={"magnifying-glass" as IconProp} />}
            content="Search"
            key="submit"
            inline
          />
        </Flex>
      </Form>
      <FlexItem grow styles={{ height: "100%", overflow: "scroll", flex: 1 }}>
        <Tree items={treeItems} />
      </FlexItem>
    </Flex>
  );
};
