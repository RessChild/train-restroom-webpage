import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { Box, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

import { GoChecklist, GoCheck } from "react-icons/go";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";

import { reportListInit, reportListRudcer, ReportListAction } from "./reducer/ReportListReducer";
import { tableColumn } from "./data/ReportListData";

import "../DefaultView.css";
import "./ReportListView.css";

const ReportListView = ({ history }) => {

    const source = axios.CancelToken.source();

    const [ state, dispatch ] = useReducer(reportListRudcer, reportListInit);
    const { filter, totalPage, reportList, checkList, isLoading } = state;

    // axios 요청
    const axiosRequest = async () => {
        dispatch({ type: ReportListAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await axios.post('/back-office/report-list', { ...filter, jwt: sessionStorage.getItem('jwt') }, { cancelToken: source.token });
            console.log(data);
            if( !data ) {
                alert('획득한 정보가 없어요.');
                return dispatch({ type: ReportListAction.UPDATE_STATE, data: { isLoading: false }});
            }

            // token 갱신
            if( data.new_token ) sessionStorage.setItem('jwt', data.new_token);

            // 고를 수 있는 페이지 최대치를 넘어가면 최대 페이지 갱신, 그 외엔 입력값 처리
            if ( data.totalPage < filter.page ) dispatch({ type: ReportListAction.UPDATE_FILTER, data: { "page": Math.min(filter.page, data.totalPage) }});
            else dispatch({ type: ReportListAction.UPDATE_STATE, data: { ...data, checkList: {}, isLoading: false } });

            // dispatch({ type: ReportListAction.UPDATE_STATE, data: { reportList: data, isLoading: false } });
        } catch (e) {
            if( axios.isCancel(e) ) return;

            const { response } = e;
            if( response && response.data && response.data.error && response.data.error.name === "TokenExpiredError" ) {
                sessionStorage.removeItem('jwt');
                alert('권한 기한이 만료되었습니다.');
                return history.push('/identify'); // 인증페이지로 이동
            }

            alert("axios request error!");
            dispatch({ type: ReportListAction.UPDATE_STATE, data: { isLoading: false }});
        }
    }

    // 초기 리스트 로딩
    useEffect(() => {
        axiosRequest();
        return () => { source.cancel(); }
    }, [filter]);

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

    // 필터용 토글 버튼
    const onClickToggleBtn = ({ currentTarget: { id }}) => {
        const [ target, value ] = id.split('-');
        dispatch({ type: ReportListAction.UPDATE_FILTER, data: { [value]: !filter[value] } });
    };
    // 페이지 이동 버튼
    const onClickPageBtnLeft = () => {
        const PAGE = Math.max(0, filter.page - 1);
        dispatch({ type: ReportListAction.UPDATE_FILTER, data: { "page": PAGE }});
    }
    const onClickPageBtnRight = () => {
        const PAGE = Math.min(totalPage, filter.page + 1);
        dispatch({ type: ReportListAction.UPDATE_FILTER, data: { "page": PAGE }});
    }

    return <>
        { isLoading && <LoadingFilter /> }
        <Box className="view-frame">
            <Box className="opt-bar">
                <Box>
                    <IconButton className="toggle-btn" id="filter-isRead" onClick={onClickToggleBtn}>
                        <GoChecklist color={filter.isRead ? "369F36" /*"FF9100"*/ : "969696"} size="2rem"/>
                    </IconButton>
                </Box>
                <Box>
                    <IconButton disabled={filter.page <= 0} onClick={onClickPageBtnLeft}>
                        <MdKeyboardArrowLeft />
                    </IconButton>
                    { `page ${filter.page + 1} / ${totalPage + 1}` }
                    <IconButton disabled={filter.page >= totalPage} onClick={onClickPageBtnRight}>
                        <MdKeyboardArrowRight />
                    </IconButton>
                </Box>
            </Box>
            <Box className="select-bar">
                <Box>
                    { reportList.reduce((acc, add) => acc + (checkList[add._id] ? 1 : 0), 0) } 개 선택
                </Box>
                <Box>
                    {/* <IconButton className="select-bar-btn" disabled={ !(addList.reduce((acc, add) => acc | checkList[add._id], false)) } onClick={onClickActionRead}>
                        <GoCheck color="#FF9100"/>
                    </IconButton>
                    <IconButton className="select-bar-btn" disabled={ !(addList.reduce((acc, add) => acc | checkList[add._id], false)) } onClick={onClickActionRemove}>
                        <GoTrashcan color="red"/>
                    </IconButton> */}
                </Box>
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