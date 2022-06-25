import { IEbooksContent } from "./interface";
import { ADbFunctions } from "./BaseDb";

export class EbookFunctions extends ADbFunctions {
  async addEbook(ebook: IEbooksContent) {
    return EbookFunctions.db.transaction(
      "rw",
      EbookFunctions.db.ebooksTable,
      async () => {
        return EbookFunctions.db.ebooksTable.add(ebook);
      }
    );
  }

  async deleteEbook(id: number) {
    return EbookFunctions.db.transaction(
      "rw",
      EbookFunctions.db.ebooksTable,
      async () => {
        EbookFunctions.db.transaction(
          "rw",
          EbookFunctions.db.notesTable,
          async () => {
            EbookFunctions.db.notesTable.each((note) => {
              if (note.EbookId === id) {
                EbookFunctions.db.notesTable.update(note, {
                  EbookId: undefined,
                });
              }
            });
          }
        );
        return EbookFunctions.db.ebooksTable
          .where("EbookId")
          .equals(id)
          .delete();
      }
    );
  }

  async getEbook(id: number) {
    return EbookFunctions.db.transaction(
      "r",
      EbookFunctions.db.ebooksTable,
      async () => {
        return EbookFunctions.db.ebooksTable.get(id);
      }
    );
  }

  async addNewEbook(title: string, fileHash: string) {
    return this.addEbook({
      title: title,
      fileHash: fileHash,
      NoteList: [],
    } as IEbooksContent);
  }

  async getEbookCounts() {
    return EbookFunctions.db.transaction(
      "r",
      EbookFunctions.db.ebooksTable,
      async () => {
        return EbookFunctions.db.ebooksTable.count();
      }
    );
  }

  async getEbooksArray() {
    return EbookFunctions.db.transaction(
      "r",
      EbookFunctions.db.ebooksTable,
      async () => {
        return EbookFunctions.db.ebooksTable.toArray();
      }
    );
  }

  async getEbookIndexFromId(id: number) {
    const EbooksList = await this.getEbooksArray();
    return EbooksList.findIndex((ebook) => ebook.EbookId === id);
  }

  async getEbooksTitleArray() {
    const EbooksList = await this.getEbooksArray();
    return EbooksList.map((ebook) => ebook.title);
  }

  async linkEbookToNote(ebookId: number, noteId: number) {
    return EbookFunctions.db.transaction(
      "rw",
      EbookFunctions.db.ebooksTable,
      async () => {
        return EbookFunctions.db.ebooksTable.update(ebookId, {
          NoteList: [
            ...(await EbookFunctions.db.ebooksTable.get(ebookId)).NoteList,
            noteId,
          ],
        });
      }
    );
  }
  async unLinkEbookFromNote(ebookId: number, noteId: number) {
    return EbookFunctions.db.transaction(
      "rw",
      EbookFunctions.db.ebooksTable,
      async () => {
        return EbookFunctions.db.ebooksTable.update(ebookId, {
          NoteList: (
            await EbookFunctions.db.ebooksTable.get(ebookId)
          ).NoteList.filter((id) => id !== noteId),
        });
      }
    );
  }
}
