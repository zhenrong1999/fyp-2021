// import { EbookList } from "../EbookManagementComponents";
import { dbClass } from "../Global/constant";
import { guid } from "../MindMapComponents/common/utils";
import { EdgeConfig, NodeConfig } from "@antv/g6";

export async function getNodesToEbook() {
  return dbClass.getNotesArray().then((notes) => {
    return dbClass.getEbooksArray().then((ebooks) => {
      return dbClass
        .getNode2NotesArray()
        .then((nodes) => {
          const result: { nodeId: number; ebookList: number[] }[] = [];

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
              const newEbookId = guid();
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
                id: node.nodeId.toString() + ":" + newEbookId,
                source: node.nodeId.toString(),
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

// export async function getNodesToEbook() {
//   const notes = await dbClass.getNotesArray();
//   return dbClass.getNode2NotesArray().then((nodes) => {
//     const result: { nodeId: number; ebookList: number[] }[] = [];
//     const result2: { nodes: NodeConfig[]; edges: EdgeConfig[] } = {
//       nodes: [],
//       edges: [],
//     };

//     nodes.forEach((node) => {
//       if (nodes.length > 0 && notes.length > 0)
//         if (node.NoteList.length > 0) {
//           let ebookList = node.NoteList.map((noteId) => {
//             const note = notes.find((note_1) => note_1.NoteId === noteId);
//             if (note !== undefined) {
//               return note.EbookId;
//             }
//             return null;
//           });
//           ebookList = ebookList.filter((ebook) => ebook !== null);
//           //ebookList remove duplicates
//           ebookList = [...new Set(ebookList)];
//           result.push({
//             nodeId: node.MindMapNodeId,
//             ebookList: ebookList,
//           });
//         }
//     });
//     console.log("result", result);
//     result.forEach((node) => {
//       node.ebookList.forEach(async (ebook_1) => {
//         const newEbookId = guid();
//         await dbClass.getEbook(ebook_1).then((ebookData) => {
//           const nodeConfig: NodeConfig = {
//             id: newEbookId,
//             label: ebookData.title,
//           };
//           console.log("ebookNode", nodeConfig);
//           result2.nodes.push(nodeConfig);
//           const edgeConfig: EdgeConfig = {
//             id: node.nodeId.toString() + ":" + newEbookId,
//             source: node.nodeId.toString(),
//             target: newEbookId,
//           };
//           result2.edges.push(edgeConfig);
//         });
//       });
//     });
//     return Promise.all([result2]);
//   });
// }
