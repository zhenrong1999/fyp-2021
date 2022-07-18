import { dbClass } from "../Global/constant";
import { guid } from "../MindMapComponents/common/utils";
import { EdgeConfig, NodeConfig } from "@antv/g6";

export async function getNodesToEbook(sharedEbookId: boolean) {
  return dbClass.getNotesArray().then((notes) => {
    return dbClass.getEbooksArray().then((ebooks) => {
      return dbClass
        .getNode2NotesArray()
        .then((nodes) => {
          const result: { nodeId: string; ebookList: number[] }[] = [];

          nodes.forEach((node) => {
            if (nodes.length > 0 && notes.length > 0)
              if (node.NoteList.length > 0) {
                let ebookList = node.NoteList.map((noteId) => {
                  const note = notes.find((note_1) => note_1.NoteId === noteId);
                  if (note !== undefined) {
                    return note.EbookId;
                  }
                  return null;
                });
                ebookList = ebookList.filter((ebook) => ebook !== null);
                //ebookList remove duplicates
                ebookList = [...new Set(ebookList)];
                result.push({
                  nodeId: node.MindMapNodeId,
                  ebookList: ebookList,
                });
              }
          });
          return result;
        })
        .then((result) => {
          const result2: { nodes: NodeConfig[]; edges: EdgeConfig[] } = {
            nodes: [],
            edges: [],
          };

          console.log("result", result);
          result.forEach((node) => {
            node.ebookList.forEach(async (ebook_1) => {
              let newEbookId: string;
              if (sharedEbookId !== true) {
                newEbookId = "ebook" + guid();
              } else {
                newEbookId = "ebook" + ebook_1.toString();
              }
              const ebookData = ebooks.find(
                (ebook) => ebook.EbookId === ebook_1
              );
              const nodeConfig: NodeConfig = {
                id: newEbookId,
                label: ebookData.title,
              };
              console.log("ebookNode", nodeConfig);
              result2.nodes.push(nodeConfig);
              const edgeConfig: EdgeConfig = {
                id: node.nodeId + ":" + newEbookId,
                source: node.nodeId,
                target: newEbookId,
              };
              result2.edges.push(edgeConfig);
            });
          });
          return result2;
        });
    });
  });
}
