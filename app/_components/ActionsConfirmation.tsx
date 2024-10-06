"use client";
import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ActionsConfirmationProps {
  dialogOpen: boolean;
  handleConfirmAction: () => void;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogAction:
    | ({
        action: string;
        actionDescription: string;
      } & { [key: string]: any })
    | null;
}

export const ActionsConfirmation = ({
  dialogOpen,
  dialogAction,
  setDialogOpen,
  handleConfirmAction,
}: ActionsConfirmationProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            {dialogAction?.actionDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmAction}>{dialogAction?.action}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
