import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Box } from "@material-ui/core";

import "./BasicFrame.css";
import { defaultBasicFramePath, basicFrameRoute } from "./basicFrameRouter";

const BasicFrame = ({ history, location, match }) => {

    /*
    useEffect(() => {
        console.log(history, location, match);
        // console.log('BasicFrame useEffect');
    }, [history, location, match]);
    */

    // 선택된 메뉴
    const [ select, setSelect ] = useState(null);

    // url에 따라 선택된 버튼 변경
    useEffect(() => {
        // 현재 url을 기준으로 일치하는 라우터 정보를 찾음
        const route = basicFrameRoute.find( route => route.path === location.pathname);
        setSelect(route);
    }, [location]);

    // 메뉴 버튼 클릭 이벤트
    const onClickMenuItem = ({ currentTarget: { id }}) => {
        // 동일한 id 값을 찾아서 해당 주소로 push
        const route = basicFrameRoute.find( route => route.key === id );
        history.push(route.path);
    };
    
    // 메뉴 아이템 생성
    const createMenu = () => {
        return <Box>
            {
                basicFrameRoute.map( basicRoute => 
                    <Box className={`menu-item ${ basicRoute === select ? "selected-item" : "" }`} key={`menu-item-${basicRoute.key}`} id={basicRoute.key} onClick={onClickMenuItem} >
                        <basicRoute.icon size="2.2rem" />
                        <p>{ basicRoute.title }</p>
                    </Box>
                )
            }
        </Box>
    }

    // 라우터 생성 (우측 페이지)
    const createRouter = () => {
        return <Switch>
            {
                basicFrameRoute.map( basicRoute => 
                    <Route key={`router-${basicRoute.key}`} {...basicRoute} />
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
            { select &&
                <Box className="view-title">
                    <Box className="view-title-icon">
                        { <select.icon size="2.5rem" /> }
                    </Box>
                    <Box className="view-title-content">
                        { select.title }
                    </Box>
                </Box>
            }
            { createRouter() }
            </Box>
        </Box>
    )
}

export default BasicFrame;