import React from "react";
import { Button } from "@mui/material";

// Define the props interface
interface CardClassProps {
  nameclass: string;
  openModal: () => void;
  checkId: any;
  setCheckId: (id: any) => void;
  total: number | null;
}

export function CardClass({
  nameclass,
  openModal,
  checkId,
  setCheckId,
  total = 0, // Default total to 0 if not provided
}: CardClassProps) {
  // Handle the button click
  const handleOnClick = () => {
    console.log("THIS MODAL CLICK!!!!");
    openModal();
    setCheckId(checkId);
  };

  return (
    <div className="mx-9 my-3 h-20 w-28 animate-fade-down">
      <Button
        onClick={handleOnClick}
        variant="contained"
        className="h-20 w-28"
        style={{
          backgroundColor: "#e9fce8",
          borderRadius: "20%",
          color: "black",
          zIndex: 0,
        }}
        sx={{
          position: "relative",
          top: 0,
          right: 0,
          fontWeight: "bold",
        }}
      >
        <div className="flex flex-col">
          <p className="text-2xl">{nameclass}</p>
          <p className="font-normal lowercase">Siso: {total}</p>
        </div>
      </Button>
      {/* You can uncomment and use the following code if you need an icon button */}
      {/* <IconButton
        sx={{
          position: "relative",
        }}
        style={{
          zIndex: "1",
          backgroundColor: "#DC8888",
        }}
        color="white"
      >
        <RemoveIcon style={{ color: "white", height: "14px", width: "14px" }} />
      </IconButton> */}
    </div>
  );
}
