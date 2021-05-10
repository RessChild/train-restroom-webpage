import { Box, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";

import {addListInit, AddListAction, addListRudcer } from "./reducer/AddListReducer";

import "../DefaultView.css";
import "./AddListView.css";

const tableColumn = [
    {
        key: "stinNm",
        name: "역 이름"
    },
    {
        key: "exitNo",
        name: "출구 번호"
    }, 
    { 
        key: "gateInotDvNm",
        name: "출구 안/밖"
    }
];

// 추가요청 정리 리스트
const AddListView = () => {

    const source = axios.CancelToken.source();

    const [ state, dispatch ]  = useReducer(addListRudcer, addListInit); 
    const { addList, checkList, isLoading } = state;

    // axios 요청
    const axiosRequest = async () => {
        dispatch({ type: AddListAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await axios.post('/back-office/add-list', {}, { cancelToken: source.token });
            // console.log(data);
            dispatch({ type: AddListAction.UPDATE_STATE, data: { addList: data, isLoading: false } });
        } catch (e) {
            // console.log("addListView error:", e);
            alert("axios request error!");
            dispatch({ type: AddListAction.UPDATE_STATE, data: { isLoading: false }});
        }
    }

    // 초기에 리스트 로딩
    useEffect(() => {
        axiosRequest();
        return () => { // axios 요청 취소
            source.cancel();
        }
    }, []);

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

    // 고민해야할 부분
    // 1. 로딩중인 경우
    // 2. 요청 리스트가 없는 경우
    return <>
        { isLoading && <LoadingFilter /> }
        <Box className="view-frame">
            <Box className="opt-bar">
                <Box>뭔가 검색관련</Box>
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
                            addList.map( add => <TableRow className="table-body-row" key={`row-${add._id}`}>
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