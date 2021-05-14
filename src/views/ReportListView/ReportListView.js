import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { Box, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";

import { reportListInit, reportListRudcer, ReportListAction } from "./reducer/ReportListReducer";
import { tableColumn } from "./data/ReportListData";

import "../DefaultView.css";
import "./ReportListView.css";

const ReportListView = () => {

    const source = axios.CancelToken.source();

    const [ state, dispatch ] = useReducer(reportListRudcer, reportListInit);
    const { reportList, checkList, isLoading } = state;

    // axios 요청
    const axiosRequest = async () => {
        dispatch({ type: ReportListAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await axios.post('/back-office/report-list', {}, { cancelToken: source.token });
            console.log(data);
            dispatch({ type: ReportListAction.UPDATE_STATE, data: { reportList: data, isLoading: false } });
        } catch (e) {
            // console.log("addListView error:", e);
            if( axios.isCancel(e) ) return;
            alert("axios request error!");
            dispatch({ type: ReportListAction.UPDATE_STATE, data: { isLoading: false }});
        }
    }

    // 초기 리스트 로딩
    useEffect(() => {
        axiosRequest();
        return () => { source.cancel(); }
    }, []);

    // 체크박스 관련
    const onChangeCheckboxAll = ({ currentTarget: { checked }}) => {
        // console.log(checked);
        const new_list = reportList.reduce((acc, { _id }) => ({ ...acc, [_id]: checked }), {});
        dispatch({ type: ReportListAction.UPDATE_STATE, data: { checkList: new_list } });
    }
    const onChangeCheckbox = ({ currentTarget: { id, checked } }) => {
        const [ doc, target ] = id.split('-');
        // console.log(target);
        const new_list = { ...checkList, [target]: checked };
        dispatch({ type: ReportListAction.UPDATE_STATE, data: { checkList: new_list } });
    }

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
                                <Checkbox onChange={onChangeCheckboxAll} checked={ reportList.reduce((acc, report) => acc && !!checkList[report._id], true) } />
                            </TableCell>
                            { tableColumn.map( column => <TableCell className="table-header-cell" key={`head-${column.key}`} align="center">{ column.name }</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">
                        {
                            reportList.map( report => <TableRow className="table-body-row" key={`row-${report._id}`}>
                                <TableCell padding="checkbox">
                                    <Checkbox id={`checkbox-${report._id}`} key={`checkbox-${report._id}`} checked={!!checkList[report._id]} onChange={onChangeCheckbox}/>
                                </TableCell>
                                { 
                                    tableColumn.map( ({ key, filter }) => 
                                        <TableCell key={`row-${report._id}-${key}`}>
                                            { filter ? filter[report[key]] : report[key] }
                                        </TableCell>) 
                                }
                            </TableRow> )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>;
};

export default ReportListView;