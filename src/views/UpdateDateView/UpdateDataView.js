import React, { useEffect, useReducer } from "react";
import { Box, Button, IconButton, TextField } from "@material-ui/core";
import axios from "axios";

import { FcSearch } from "react-icons/fc";

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";
import { updateDataInit, updateDataRudcer, UpdateDataAction } from "./reducer/UpdateDataReducer";
import { tableColumn } from "./data/UpdateDataData";

import "../DefaultView.css";
import "./UpdateDataView.css";

const EditDataView = () => {
    const source = axios.CancelToken.source();
    
    const [ state, dispatch ] = useReducer(updateDataRudcer, updateDataInit);
    const { filter, isLoading, lineList, stationList, restroomList } = state;

    // 노선 종류 요청
    const axiosRequestTrain = async () => {
        const jwt = sessionStorage.getItem('jwt');
        dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await axios.post('/back-office/edit-train', { jwt }, { cancelToken: source.token });
            if( !data ) {
                alert("획득한 노선 정보가 없어요.")
                return;
            }

            const { new_token, ...others } = data;
            if( new_token ) sessionStorage.setItem('jwt', new_token);
            dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { ...others, isLoading: false } });
        } catch (e) {
            if( axios.isCancel(e) ) return;
            
            console.log("EditDataView axios error", e);
            alert('데이터 요청 중, 문제가 발생하였습니다.');
        }
    };

    // 노선별 역 종류 요청
    const axiosRequestLine = async () => {
        const jwt = sessionStorage.getItem('jwt');
        dispatch({ type: UpdateDataAction.UPDATE_FILTER, data: { "stinCd": "" }});
        dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await axios.post(`/back-office/edit-line/${filter.railOprIsttCd}/${filter.lnCd}`, { jwt }, { cancelToken: source.token })
            if ( !data ) {
                alert("획득한 역 정보가 없어요.");
                return;
            }

            const { new_token, ...others } = data;
            if( new_token ) sessionStorage.setItem('jwt', new_token);
            dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { ...others, isLoading: false }});
        } catch (e) {
            if( axios.isCancel(e) ) return;
            
            console.log("EditDataView axios error", e);
            alert('데이터 요청 중, 문제가 발생하였습니다.');
        }
    };

    // 특정 역의 화장실 요청
    const axiosRequestStation = async () => {
        const jwt = sessionStorage.getItem('jwt');
        dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { isLoading: true }});

        try {
            const { data } = await axios.post(`/back-office/edit-station/${filter.railOprIsttCd}/${filter.lnCd}/${filter.stinCd}`, { jwt }, { cancelToken: source.token })
            if( !data ) {
                alert('획득한 화장실 정보가 없어요.')
                return;
            }

            const { new_token, ...others } = data;
            if( new_token ) sessionStorage.setItem('jwt', new_token);
            dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { ...others, isLoading: false }});
        } catch (e) {
            if( axios.isCancel(e) ) return;
            
            console.log("EditDataView axios error", e);
            alert('데이터 요청 중, 문제가 발생하였습니다.');
        }
    };

    // 초기 로딩
    useEffect(() => {
        axiosRequestTrain();
    }, []);
    useEffect(() => {
        if( filter.railOprIsttCd && filter.lnCd) axiosRequestLine();
    }, [filter.railOprIsttCd, filter.lnCd]);

    // useEffect(() => {
    //     console.log(filter);
    // }, [filter]);

    /* 액션 관련 함수 */
    // select 변경
    const onChangeSelect = ({ currentTarget: { id, value }}) => {
        const [ _, target_a, target_b ] = id.split('-');
        const [ value_a, value_b ] = value.split('-');

        let data = {};
        if( target_a ) data = { ...data, [target_a]: value_a };
        if( target_b ) data = { ...data, [target_b]: value_b };

        dispatch({ type: UpdateDataAction.UPDATE_FILTER, data });
    };
    // 검색 버튼
    const onClickSearch = () => {
        axiosRequestStation();
    };
    
    return <>
        { isLoading && <LoadingFilter /> }
        <Box className="view-frame">
            <Box className="filter-bar">
                <select id="select-railOprIsttCd-lnCd" className="select-option" defaultValue="" onChange={onChangeSelect}>
                    <option value="" className="default-opt">-------------- 노선 선택 --------------</option>
                    { lineList.map( ({ railOprIsttCd, lnCd, lnNm }) => <option key={`train-${railOprIsttCd}-${lnCd}`} value={`${railOprIsttCd}-${lnCd}`}>{ lnNm }</option>) }
                </select>
                <select id="select-stinCd" className="select-option" defaultValue="" onChange={onChangeSelect}>
                    <option value="" className="default-opt">-------------- 역명 선택 --------------</option>
                    { stationList.map( ({ stinCd, stinNm }) => <option key={`station-${stinCd}`} value={stinCd}>{ stinNm }</option> ) }
                </select>
                <Button size="small" variant="outlined" onClick={onClickSearch}>
                    <FcSearch size="2rem" />
                </Button>
            </Box>
            <Box className="restroom-list">
                { /* 앞쪽에 수정된 데이터가 있는지 표기하기 */}
                { /*명칭 박아버리기 (어느 역, 어느 정거장인지)*/ }
                { restroomList.map( (restroom, idx) => 
                    <Box key={`restroom-${idx}`} className="restroom-data">
                        { tableColumn.map( ({ key }) => <input key={`column-${idx}-${key}`} defaultValue={restroom[key]} /> ) }
                    </Box>
                ) }
            </Box>
            <button>추가하기 버튼</button>
        </Box>
    </>
};

export default EditDataView;