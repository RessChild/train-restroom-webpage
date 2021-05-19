import { Box, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { useEffect, useReducer } from "react";
import axios from "axios";

import { GoChecklist, GoCheck, GoTrashcan } from "react-icons/go"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";

import { addListInit, AddListAction, addListRudcer } from "./reducer/AddListReducer";
import { tableColumn } from "./data/AddListData";

import "../DefaultView.css";
import "./AddListView.css";

// 추가요청 정리 리스트
const AddListView = () => {

    const source = axios.CancelToken.source();

    const [ state, dispatch ] = useReducer(addListRudcer, addListInit); 
    const { totalPage, filter, addList, checkList, isLoading } = state;

    // axios 요청
    const axiosRequest = async () => {
        dispatch({ type: AddListAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await axios.post('/back-office/add-list', filter, { cancelToken: source.token });
            console.log(data);
            // 고를 수 있는 페이지 최대치를 넘어가면 최대 페이지 갱신
            // 그 외엔 입력값 처리
            if ( data.totalPage < filter.page ) dispatch({ type: AddListAction.UPDATE_FILTER, data: { "page": Math.min(filter.page, data.totalPage) }});
            else dispatch({ type: AddListAction.UPDATE_STATE, data: { ...data, checkList: {}, isLoading: false } });
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
        dispatch({ type: AddListAction.UPDATE_FILTER, data: { [value]: !filter[value] } });
    };
    // 페이지 이동 버튼
    const onClickPageBtnLeft = () => {
        const PAGE = Math.max(0, filter.page - 1);
        dispatch({ type: AddListAction.UPDATE_FILTER, data: { "page": PAGE }});
    }
    const onClickPageBtnRight = () => {
        const PAGE = Math.min(totalPage, filter.page + 1);
        dispatch({ type: AddListAction.UPDATE_FILTER, data: { "page": PAGE }});
    }

    // 체크리스트 액션버튼
    const onClickActionRead = async () => { // 목록 읽음 처리
        const list = addList.filter( add => checkList[add._id] ).map( ({_id}) => _id );
        const yesOrNo = window.confirm(`선택한 ${list.length} 개의 추가 건의를 확인합니다.`);

        if( !yesOrNo ) return; // 거절하면 종료
        try {
            const { data } = await axios.post('/back-office/add-read', { list }, { cancelToken: source.token });
            // console.log(data);
            if ( !data.ok || !data.nModified ) return; // 갱신된 값이 없으면 무시
            axiosRequest();
        } catch (e) {
            if(axios.isCancel(e)) return;
            alert("승인 처리 중, 에러가 발생하였습니다.");
        }
    }
    const onClickActionRemove = async () => { // 목록 삭제
        const list = addList.filter( add => checkList[add._id] ).map( ({_id}) => _id );
        const yesOrNo = window.confirm(`선택한 ${list.length} 개의 추가 건의를 삭제합니다.`);

        if( !yesOrNo ) return; // 거절하면 종료
    }

    // 고민해야할 부분
    // 1. 요청 리스트가 없는 경우
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
                    { addList.reduce((acc, add) => acc + (checkList[add._id] ? 1 : 0), 0) } 개 선택
                </Box>
                <Box>
                    <IconButton className="select-bar-btn" disabled={ !(addList.reduce((acc, add) => acc | checkList[add._id], false)) } onClick={onClickActionRead}>
                        <GoCheck color="#FF9100"/>
                    </IconButton>
                    <IconButton className="select-bar-btn" disabled={ !(addList.reduce((acc, add) => acc | checkList[add._id], false)) } onClick={onClickActionRemove}>
                        <GoTrashcan color="red"/>
                    </IconButton>
                </Box>
            </Box>
            <TableContainer>
                <Table size="small">
                    <TableHead className="table-header">
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox onChange={onChangeCheckboxAll} checked={ addList.reduce((acc, add) => acc && !!checkList[add._id], true) } />
                            </TableCell>
                            { tableColumn.map( column => <TableCell className="table-header-cell" padding={column.padding && column.padding} key={`head-${column.key}`} align="center">{ column.name }</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">
                        {
                            addList.map( add => <TableRow className={`table-body-row`} key={`row-${add._id}`}>
                                <TableCell padding="checkbox">
                                    <Checkbox id={`checkbox-${add._id}`} key={`checkbox-${add._id}`} checked={!!checkList[add._id]} onChange={onChangeCheckbox}/>
                                </TableCell>
                                { tableColumn.map( ({ key, filter, padding }) => <TableCell padding={padding} key={`row-${add._id}-${key}`}>{ filter ? filter[add[key]] : add[key] }</TableCell>) }
                            </TableRow> )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>;
};

export default AddListView;