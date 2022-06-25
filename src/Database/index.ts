import { ADbFunctions } from "./BaseDb";
import { IEbooksContent, INode2Note, INoteContent } from "./interface";
import { NoteFunctions } from "./NoteDb";
import { NodeFunctions } from "./Node2NoteDb";
import { EbookFunctions } from "./EbookDb";
import { applyMixins } from "./Utils/Mixim";
import { useLiveQuery } from "dexie-react-hooks";

class MindFlowDb extends ADbFunctions {
  public static MindFlowDb() {
    return MindFlowDb.db;
  }
  public getDbInstance() {
    return MindFlowDb.db;
  }
}

interface MindFlowDb extends NoteFunctions, NodeFunctions, EbookFunctions {}
applyMixins(MindFlowDb, [NoteFunctions, NodeFunctions, EbookFunctions]);

export { IEbooksContent, INode2Note, INoteContent };

export const dbClass = new MindFlowDb();
export { useLiveQuery };
export const db = () => {
  return MindFlowDb.db;
};

export default dbClass.getDbInstance();
