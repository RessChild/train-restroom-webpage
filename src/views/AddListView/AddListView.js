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
const AddListView = ({ history }) => {

    const source = axios.CancelToken.source();

    const [ state, dispatch ] = useReducer(addListRudcer, addListInit); 
    const { totalPage, filter, addList, checkList, isLoading } = state;

    // axios 요청
    const axiosRequest = async () => {
        dispatch({ type: AddListAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await axios.post('/back-office/add-list', { ...filter, jwt: sessionStorage.getItem('jwt') }, { cancelToken: source.token });
            if( !data ) {
                alert('획득한 정보가 없어요.');
                return dispatch({ type: AddListAction.UPDATE_STATE, data: { isLoading: false }});
            }

            // token 갱신
            if( data.new_token ) sessionStorage.setItem('jwt', data.new_token);

            // 고를 수 있는 페이지 최대치를 넘어가면 최대 페이지 갱신, 그 외엔 입력값 처리
            if ( data.totalPage < filter.page ) dispatch({ type: AddListAction.UPDATE_FILTER, data: { "page": Math.min(filter.page, data.totalPage) }});
            else dispatch({ type: AddListAction.UPDATE_STATE, data: { ...data, checkList: {}, isLoading: false } });
        } catch (e) {
            // cancel 로 인한 경우
            if( axios.isCancel(e) ) return;

            // 권한 만료 확인
            const { response } = e;
            if( response && response.data && response.data.error && response.data.error.name === "TokenExpiredError" ) {
                sessionStorage.removeItem('jwt');
                alert('권한 기한이 만료되었습니다.');
                return history.push('/identify'); // 인증페이지로 이동
            }

            // 기타 문제
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
            const { data } = await axios.post('/back-office/add-read', { list, jwt: sessionStorage.getItem('jwt') }, { cancelToken: source.token });

            // token 갱신
            if( data.new_token ) sessionStorage.setItem('jwt', data.new_token);

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