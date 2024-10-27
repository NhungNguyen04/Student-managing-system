import PropTypes from "prop-types";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import NavbarStudent from "./NavbarStudent";
import NavbarOfficer from "./NavbarOfficer";
import NavbarTeacher from "./NavbarTeacher";
import NavbarDirector from "./NavbarDirector";
import { ReactNode } from "react";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const role = localStorage.getItem("role");
  console.log("ROLE", role);
  return (
    <div className="relative m-0 overflow-auto p-0">
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'auto' }}>
        <CssBaseline />
        <Box
          sx={{
            display: { xs: 'none', sm: 'block' },
            flexBasis: { sm: '33.33%', lg: '16.67%' },
          }}
        >
          {Number(role) === 1 ? (
            <NavbarDirector />
          ) : Number(role) === 4 ? (
            <NavbarStudent />
          ) : Number(role) === 3 ? (
            <NavbarOfficer />
          ) : (
            <NavbarTeacher />
          )}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            background: '#fafafa',
          }}
        >
          {children}
        </Box>
      </Box>
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
}
