import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

import Doctors from "./Doctors";
import Nurses from "./Nurses";
import Receptionists from "./Receptionists";
import Pharmacists from "./Pharmacists";

const roles = ["Doctors", "Nurses", "Receptionists", "Pharmacists"];

const StaffManagement = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (e, newIndex) => setTabIndex(newIndex);

  return (
    <Box sx={{ width: "100%" }}>
      

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        {roles.map((role, index) => (
          <Tab key={role} label={role} />
        ))}
      </Tabs>

      {tabIndex === 0 && <Doctors />}
      {tabIndex === 1 && <Nurses />}
      {tabIndex === 2 && <Receptionists />}
      {tabIndex === 3 && <Pharmacists />}
    </Box>
  );
};

export default StaffManagement;
