import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Box } from "@material-ui/core";

import "./BasicFrame.css";
import { defaultBasicFramePath, basicFrameRouter } from "./basicFrameRouter";

const BasicFrame = () => {

    const createMenu = () => {
        return <Box>
            {
                basicFrameRouter.map( basicRoute => 
                    <Box className="menu-item">
                        <basicRoute.icon size="2.2rem" />
                        <p>{ basicRoute.title }</p>
                    </Box>
                )
            }
        </Box>
    }

    const createRoute = () => {
        return <Switch>
            {
                basicFrameRouter.map( basicRoute => 
                    <Route {...basicRoute} />
                )
            }
            <Redirect to={defaultBasicFramePath} />
        </Switch>
    };

    return (
        <Box className="frame">
            <Box className="left-side">
            { createMenu() }
            </Box>
            <Box className="right-side">
            { createRoute() }
            </Box>
        </Box>
    )
}

export default BasicFrame;