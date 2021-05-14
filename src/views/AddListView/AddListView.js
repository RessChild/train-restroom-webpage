import { Box, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";

import { GoMailRead, GoMail, GoCheck } from "react-icons/go"

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";

import { addListInit, AddListAction, addListRudcer } from "./reducer/AddListReducer";
import { tableColumn } from "./data/AddListData";

import "../DefaultView.css";
import "./AddListView.css";

// 추가요청 정리 리스트
const AddListView = () => {

    const source = axios.CancelToken.source();

    const [ state, dispatch ]  = useReducer(addListRudcer, addListInit); 
    const { filter, addList, checkList, isLoading } = state;

    // axios 요청
    const axiosRequest = async () => {
        dispatch({ type: AddListAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await axios.post('/back-office/add-list', filter, { cancelToken: source.token });
            console.log(data);
            dispatch({ type: AddListAction.UPDATE_STATE, data: { addList: data, isLoading: false } });
        } catch (e) {
            // console.log("addListView error:", e);
            if( axios.isCancel(e) ) return;
            alert("axios request error!");
            dispatch({ type: AddListAction.UPDATE_STATE, data: { isLoading: false }});
        }
    }

    // 초기에 리스트 로딩
    useEffect(() => {
        axiosRequest();
        return () => { source.cancel(); }
    }, [filter]);

    // 체크박스 관련
    const onChangeCheckboxAll = ({ currentTarget: { checked }}) => {
        // console.log(checked);
        const new_list = addList.reduce((acc, { _id }) => ({ ...acc, [_id]: checked }), {});
        dispatch({ type: AddListAction.UPDATE_STATE, data: { checkList: new_list } });
    }
    const onChangeCheckbox = ({ currentTarget: { id, checked } }) => {
        const [ doc, target ] = id.split('-');
        // console.log(target);
        const new_list = { ...checkList, [target]: checked };
        dispatch({ type: AddListAction.UPDATE_STATE, data: { checkList: new_list } });
    }

    // 필터용 토글 버튼
    const onClickToggleBtn = ({ currentTarget: { id }}) => {
        const [ target, value ] = id.split('-');
        dispatch({ type: AddListAction.UPDATE_FILTER, target: target, data: { [value]: !filter[value] } });
    };

    // 고민해야할 부분
    // 1. 로딩중인 경우
    // 2. 요청 리스트가 없는 경우
    return <>
        { isLoading && <LoadingFilter /> }
        <Box className="view-frame">
            <Box className="opt-bar">
                <Box>
                    <IconButton className="toggle-btn" id="filter-isRead" onClick={onClickToggleBtn}>
                        <GoMail color={filter.isRead ? "369F36" : "969696"} size="2rem"/>
                    </IconButton>
                    <IconButton className="toggle-btn" id="filter-isClear" onClick={onClickToggleBtn}>
                        <GoCheck color={filter.isClear ? "FF9100" : "969696"} size="2rem"/>
                    </IconButton>
                </Box>
                <Box>툴이 들어갈 공간</Box>
            </Box>
            <TableContainer>
                <Table size="small">
                    <TableHead className="table-header">
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox onChange={onChangeCheckboxAll} checked={ addList.reduce((acc, add) => acc && !!checkList[add._id], true) } />
                            </TableCell>
                            { tableColumn.map( column => <TableCell className="table-header-cell" key={`head-${column.key}`} align="center">{ column.name }</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">
                        {
                            addList.map( add => <TableRow className={`table-body-row ${add.isClear && "isClear-row"} ${add.isRead && "isRead-row"}`} key={`row-${add._id}`}>
                                <TableCell padding="checkbox">
                                    <Checkbox id={`checkbox-${add._id}`} key={`checkbox-${add._id}`} checked={!!checkList[add._id]} onChange={onChangeCheckbox}/>
                                </TableCell>
                                { tableColumn.map( column => <TableCell key={`row-${add._id}-${column.key}`}>{ add[column.key] }</TableCell>) }
                            </TableRow> )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>;
};

export default AddListView;