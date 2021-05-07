import React from "react";
import { Box } from "@material-ui/core";
import { Spinner } from "react-spinners-css";

import "./LoadingFilter.css";

// 로딩 시, 화면을 가로막는 반투명한 컴포넌트 (클릭 방지)
const LoadingFilter = () => {
    return <Box className="loading-filter">
            {/* <Spinner color="skyblue" /> */}
            <Spinner color="#ffffff" />
        </Box>;
};

export default LoadingFilter;