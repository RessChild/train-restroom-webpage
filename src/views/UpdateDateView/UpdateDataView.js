import React, { useEffect, useReducer } from "react";
import { Box, Button, IconButton } from "@material-ui/core";
import axios from "axios";

import { FcSearch } from "react-icons/fc";

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";
import { updateDataInit, updateDataRudcer, UpdateDataAction } from "./reducer/UpdateDataReducer";

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
            dispatch({ type: UpdateDataAction.UPDATE_FILTER, data: { "stinCd": '' }});
            dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { ...others, isLoading: false } });
        } catch (e) {
            if( axios.isCancel(e) ) return;
            
            console.log("EditDataView axios error", e);
            alert('데이터 요청 중, 문제가 발생하였습니다.');
        }
    };

    // 노선별 역 종류 요청
    const axiosRequestLine = async (lnCd) => {
        const jwt = sessionStorage.getItem('jwt');
        dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await axios.post(`/back-office/edit-line/${lnCd}`, { jwt }, { cancelToken: source.token })
            if ( !data ) {
                alert("획득한 역 정보가 없어요.");
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

    // 특정 역의 화장실 요청
    const axiosRequestStation = async () => {
        const jwt = sessionStorage.getItem('jwt');
        dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { isLoading: true }});

        try {
            const { data } = await axios.post(`/back-office/edit-station/${'abd'}`, { jwt }, { cancelToken: source.token })
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
        if(filter.lnCd) axiosRequestLine(filter.lnCd);
    }, [filter.lnCd]);

    useEffect(() => {
        console.log(filter);
    }, [filter]);

    // 액션 관련 함수
    const onChangeSelect = ({ currentTarget: { id, value }}) => {
        const [ _, target ] = id.split('-');
        dispatch({ type: UpdateDataAction.UPDATE_FILTER, data: { [target]: value }});
    };

    return <>
        { isLoading && <LoadingFilter /> }
        <Box className="view-frame">
            <Box className="filter-bar">
                <select id="select-lnCd" className="select-option" defaultValue="" onChange={onChangeSelect}>
                    <option value="" className="default-opt">-------------- 노선 선택 --------------</option>
                    { lineList.map( ({ lnCd, lnNm }) => <option key={`train-${lnCd}`} value={lnCd}>{ lnNm }</option>) }
                </select>
                <select id="select-stinCd" className="select-option" defaultValue="" onChange={onChangeSelect}>
                    <option value="" className="default-opt">-------------- 역명 선택 --------------</option>
                    { stationList.map( ({ stinCd, stinNm }) => <option key={`station-${stinCd}`} value={stinCd}>{ stinNm }</option> ) }
                </select>
                <Button size="small" variant="outlined">
                    <FcSearch size="2rem" />
                </Button>
            </Box>
            <Box></Box>
            <button>추가하기 버튼</button>
        </Box>
    </>
};

export default EditDataView;