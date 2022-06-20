import React from "react";
import {
  ProviderProps,
  Button,
  Dialog,
  Header,
  TrashCanIcon,
} from "@fluentui/react-northstar";
import { dbClass } from "../Global/constant";
import {
  EbookBlobManagementEditableProps,
  EbookViewerSettingProps,
} from "../Global/interface";
interface DeleteEbookButtonProps
  extends ProviderProps,
    EbookViewerSettingProps,
    EbookBlobManagementEditableProps {
  ebookId: number;
}

export const DeleteEbookButton: React.FunctionComponent<
  DeleteEbookButtonProps
> = (props) => {
  return (
    <Button
      icon={<TrashCanIcon />}
      iconOnly
      title="Delete Ebook"
      onClick={async () => {
        await dbClass
          .deleteEbook(props.ebookId)
          .then(() => {
            props.setFileBlob("");
            props.ebookBlobClassObject.deleteBook(props.ebookId);
            alert("Ebook Deleted");
          })
          .catch((err) => {
            alert("Deleting Ebook \n" + err);
          });
      }}
    />
  );
};
