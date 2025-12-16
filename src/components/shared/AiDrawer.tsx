import React from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import Sidebar from "../Sidebar/Sidebar";
import Main from "../Main/Main";
import ContextProvider from "@/context/ContextApi";
// import "../../index.css";

export function AiDrawer() {
  const [openRight, setOpenRight] = React.useState(false);

  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);
  const drawerStyle = {
    width: "75vw", // Set the width to 75% of the viewport width
  };

  return (
    <ContextProvider>
      <React.Fragment>
        <div>
          {/* @ts-ignore */}
          <Button
            style={{
              backgroundColor: "black",
              marginTop: "-50px",
              marginLeft: "20px",
              marginBottom: "0px",
            }}
            onClick={openDrawerRight}
          >
            Snapgram AI
          </Button>
        </div>
        {/* @ts-ignore */}
        <Drawer
          placement="right"
          open={openRight}
          onClose={closeDrawerRight}
          className="w-full"
          size={1250}
          style={drawerStyle} // Apply the custom style here
        >
          <div className="mb-6 flex items-center justify-between">
            <Sidebar />
            <Main />
          </div>
        </Drawer>
      </React.Fragment>
    </ContextProvider>
  );
}
