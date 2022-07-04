/* eslint-disable no-unexpected-multiline */
import React, { useEffect } from "react";
import {
  Alert,
  List,
  Toolbar,
  Popup,
  Button,
  Form,
  Input,
  ProviderProps,
  FormInput,
  FormButton,
  Flex,
} from "@fluentui/react-northstar";
import { TextLayerItemInternal } from "react-pdf";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./TextLayer.css";
import { EbookViewerRequiredProps, ebookSelected } from "../Global/interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, IconProp } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { EbookContext } from "../Global/context";

interface EbookViewerProps
  extends ProviderProps,
    EbookViewerRequiredProps,
    ebookSelected {
  style?: React.CSSProperties;
}

library.add(fas);
function checkInViewport(
  myElement: HTMLElement,
  document: globalThis.Document
) {
  const bounding = myElement.getBoundingClientRect();
  const myElementHeight = myElement.offsetHeight;
  const myElementWidth = myElement.offsetWidth;
  return (
    bounding.top >= -myElementHeight &&
    bounding.left >= -myElementWidth &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth) +
        myElementWidth &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) +
        myElementHeight
  );
}

function highlightPattern(text: string, pattern: string) {
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

export const EbookViewer: React.FunctionComponent<EbookViewerProps> = (
  props
) => {
  // const ebookContextTest = React.useContext(EbookContext);
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [currentSearchItem, setCurrentSearchItem] = React.useState(0);
  const [scale, setScale] = React.useState(1);
  const [searchText, setSearchText] = React.useState("");
  function onDocumentLoadSuccess(pdf: pdfjs.PDFDocumentProxy) {
    const numPages = pdf.numPages;
    setNumPages(numPages);
  }
  useEffect(() => {
    console.log("EbookViewer", props.ebookSelected);
  }, [props.ebookSelected]);

  const textRenderer = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (textItem: { str: any }) => {
      return highlightPattern(textItem.str, searchText);
    },
    [searchText]
  );

  if (props.ebookSelected && props.ebookSelected.EbookId > -1) {
    const divRef = React.createRef<HTMLDivElement>();
    const searchInput = React.createRef<HTMLInputElement>();

    return (
      <div className={props.className}>
        <Toolbar
          aria-label="Default"
          styles={{
            marginLeft: "auto",
            marginRight: "auto",
            top: "0px",
            position: "sticky",
            zIndex: 100,
          }}
          items={[
            {
              icon: (
                <FontAwesomeIcon icon={"magnifying-glass-minus" as IconProp} />
              ),
              key: "zoomOut",
              kind: "toggle",
              title: "Zoom Out",
              onClick: () => setScale(scale - 0.1),
            },
            {
              icon: <FontAwesomeIcon icon={"arrows-rotate" as IconProp} />,
              key: "resetZoom",
              kind: "toggle",
              title: "Reset Zoom",
              onClick: () => setScale(1),
            },
            {
              icon: (
                <FontAwesomeIcon icon={"magnifying-glass-plus" as IconProp} />
              ),
              key: "zoomIn",
              kind: "toggle",
              title: "Zoom In",
              onClick: () => setScale(scale + 0.1),
            },
            {
              key: "divider-1",
              kind: "divider",
            },
            {
              icon: <FontAwesomeIcon icon={"angle-left" as IconProp} />,
              key: "previousPage",
              kind: "toggle",
              title: "Previous Page",
              onClick: () => {
                const height = divRef.current.offsetHeight;
                divRef.current.scrollBy(0, -height);
                // window.dispatchEvent(
                //   new KeyboardEvent("keypress", {
                //     key: "PageUp",
                //   })
                // );
              },
            },
            {
              icon: <FontAwesomeIcon icon={"angle-right" as IconProp} />,
              key: "nextPage",
              kind: "toggle",
              title: "Next Page",
              onClick: () => {
                const height = divRef.current.offsetHeight;
                divRef.current.scrollBy(0, height);
                //   window.dispatchEvent(
                //   new KeyboardEvent("keypress", {
                //     key: "PageDown",
                //   })
                // );
              },
            },
            {
              key: "divider-2",
              kind: "divider",
            },
            {
              key: "search",
              kind: "custom",
              content: (
                <Popup
                  position={"below"}
                  align={"end"}
                  content={
                    <Flex column gap="gap.small">
                      {" "}
                      <Form
                        onSubmit={(event: React.SyntheticEvent) => {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore-next-line
                          setSearchText(event.target["searchText"].value);
                          setCurrentSearchItem(0);
                        }}
                      >
                        <FormInput
                          label="Search Text"
                          name="searchText"
                          id="searchText"
                          key="searchText"
                          required={true}
                          inline={true}
                          ref={searchInput}
                        />
                        <FormButton content="Find" key="submit" />
                      </Form>
                      <Flex>
                        <Button
                          icon={
                            <FontAwesomeIcon
                              icon={"arrows-rotate" as IconProp}
                            />
                          }
                          key="resetSearch"
                          title={"Search Previous"}
                          onClick={() => setSearchText("")}
                        />
                        <Button
                          icon={
                            <FontAwesomeIcon icon={"angle-left" as IconProp} />
                          }
                          key="findPrevious"
                          title={"Search Previous"}
                          onClick={() => {
                            if (
                              document.getElementsByTagName("mark").length > 0
                            ) {
                              const currentSearchItemElement =
                                document.getElementsByTagName("mark")[
                                  currentSearchItem
                                ];
                              if (
                                !checkInViewport(
                                  currentSearchItemElement,
                                  document
                                )
                              ) {
                                currentSearchItemElement.scrollIntoView({
                                  block: "nearest",
                                  behavior: "smooth",
                                });
                                currentSearchItemElement.setAttribute(
                                  "style",
                                  "background-color: #ffc0cb;"
                                );
                              } else {
                                if (currentSearchItem - 1 >= 0) {
                                  currentSearchItemElement.setAttribute(
                                    "style",
                                    "background-color: yellow;"
                                  );
                                  document
                                    .getElementsByTagName("mark")
                                    [currentSearchItem - 1].scrollIntoView({
                                      block: "nearest",
                                      behavior: "smooth",
                                    });
                                  document
                                    .getElementsByTagName("mark")
                                    [currentSearchItem - 1].setAttribute(
                                      "style",
                                      "background-color: #ffc0cb;"
                                    );
                                  setCurrentSearchItem(currentSearchItem - 1);
                                }
                              }
                            }
                          }}
                        />
                        <Button
                          icon={
                            <FontAwesomeIcon icon={"angle-Right" as IconProp} />
                          }
                          key="findNext"
                          title={"Search Next"}
                          onClick={() => {
                            if (
                              document.getElementsByTagName("mark").length > 0
                            ) {
                              const currentSearchItemElement =
                                document.getElementsByTagName("mark")[
                                  currentSearchItem
                                ];
                              if (
                                !checkInViewport(
                                  currentSearchItemElement,
                                  document
                                )
                              ) {
                                currentSearchItemElement.scrollIntoView({
                                  block: "nearest",
                                  behavior: "smooth",
                                });
                                currentSearchItemElement.setAttribute(
                                  "style",
                                  "background-color: #ffc0cb;"
                                );
                              } else {
                                if (
                                  currentSearchItem + 1 <
                                  document.getElementsByTagName("mark").length -
                                    1
                                ) {
                                  currentSearchItemElement.setAttribute(
                                    "style",
                                    "background-color: yellow;"
                                  );
                                  document
                                    .getElementsByTagName("mark")
                                    [currentSearchItem + 1].scrollIntoView({
                                      block: "nearest",
                                      behavior: "smooth",
                                    });
                                  document
                                    .getElementsByTagName("mark")
                                    [currentSearchItem + 1].setAttribute(
                                      "style",
                                      "background-color: #ffc0cb;"
                                    );
                                  setCurrentSearchItem(currentSearchItem + 1);
                                }
                              }
                            }
                          }}
                        />
                      </Flex>
                    </Flex>
                  }
                  pointing
                  trigger={
                    <Button
                      icon={
                        <FontAwesomeIcon
                          icon={"magnifying-glass" as IconProp}
                        />
                      }
                      // styles={{
                      //   padding: props.padding,
                      //   height: '64px',
                      //   minWidth: '64px',
                      // }}
                      title="Search Text"
                    />
                  }
                />
              ),
            },
          ]}
        />
        <Document
          inputRef={divRef}
          className="DocumentRendered"
          file={`data:application/pdf;base64,${props.fileBlob}`}
          onLoadSuccess={onDocumentLoadSuccess}
          renderMode="canvas"
          options={{
            cMapUrl: "/pdfjs-dist/cmaps/",
            cMapPacked: true,
          }}
        >
          {Array.from(new Array(numPages), (_el, index) => (
            <div id={`page_${index + 1}`} key={`page_${index + 1}`}>
              <Page
                pageNumber={index + 1}
                scale={scale}
                customTextRenderer={(layer: TextLayerItemInternal) =>
                  textRenderer(layer)
                }
              />
            </div>
          ))}
        </Document>
      </div>
    );
  } else return <Alert info content="No ebook selected" style={props.style} />;
};
