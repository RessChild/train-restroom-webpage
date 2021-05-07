import React from "react";
import { Box } from "@material-ui/core";

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";

import "../DefaultView.css";

const ReportListView = () => {
    return <>
        { true && <LoadingFilter /> }
        <Box className="view-frame">Report List View</Box>
    </>;
};

export default ReportListView;