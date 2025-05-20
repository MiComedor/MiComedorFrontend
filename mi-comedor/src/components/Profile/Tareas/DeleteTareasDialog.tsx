/*import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import Ration from "../../../types/ration.type";
import RationType from "../../../types/TypeRation";
import BeneficiaryByUserId from "../../../types/BeneficiaryByUserId";
import "./DeleteRacionesDialog.css";

type DeleteRacionesDialogProps = {
  open: boolean;
  onClose: () => void;
  data: Ration;
  onSubmit: (values: Ration) => Promise<void>;
  rationTypes: RationType[];
  beneficiaries: (BeneficiaryByUserId & { firstLetter: string })[];
};

const DeleteRacionesDialog: React.FC<DeleteRacionesDialogProps> = ({
  open,
  onClose,
  data,
  onSubmit,
}) => {
  const handleDelete = () => onSubmit(data);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="dialog-title">
        ¿Deseas eliminar esta ración?
      </DialogTitle>
      
      <DialogContent className="dialog-content">
        <DialogContentText className="dialog-content">
          Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>

      <DialogActions className="dialog-actions">
        <Button onClick={onClose} className="btn-cancel" variant="contained">
          ✖
        </Button>
        <Button
          onClick={handleDelete}
          className="btn-confirm"
          variant="contained"
        >
          ✔
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRacionesDialog;
*/