import React, { Fragment, useEffect, useReducer } from "react";
import { Box, Button, IconButton, TextField } from "@material-ui/core";
import axios from "axios";

import { FcSearch } from "react-icons/fc";
import { FiEdit } from "react-icons/fi";

import LoadingFilter from "../../components/LoadingFilter/LoadingFilter";
import { updateDataInit, updateDataRudcer, UpdateDataAction } from "./reducer/UpdateDataReducer";
import { splitedTableColumn, DEFAULT_ID } from "./data/UpdateDataData";
import request from "../../request";

import "../DefaultView.css";
import "./UpdateDataView.css";

const EditDataView = ({ history }) => {
    const source = axios.CancelToken.source();
    
    const [ state, dispatch ] = useReducer(updateDataRudcer, updateDataInit);
    const { filter, isLoading, addNew, station, lineList, stationList, restroomList } = state;

    // 노선 종류 요청
    const axiosRequestTrain = async () => {
        const jwt = sessionStorage.getItem('jwt');
        // dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await request.post('/back-office/edit-train', { jwt }, { cancelToken: source.token });
            if( !data ) {
                alert("획득한 노선 정보가 없어요.")
                return;
            }

            const { new_token, ...others } = data;
            if( new_token ) sessionStorage.setItem('jwt', new_token);
            dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { ...others, isLoading: false } });
        } catch (e) {
            if( axios.isCancel(e) ) return;
            
            // 권한 만료 확인
            const { response } = e;
            if( response && response.data && response.data.error && response.data.error.name === "TokenExpiredError" ) {
                sessionStorage.removeItem('jwt');
                alert('권한 기한이 만료되었습니다.');
                return history.push('/identify'); // 인증페이지로 이동
            }

            console.log("EditDataView axios error", e);
            alert('데이터 요청 중, 문제가 발생하였습니다.');
        }
    };

    // 노선별 역 종류 요청
    const axiosRequestLine = async () => {
        const jwt = sessionStorage.getItem('jwt');
        dispatch({ type: UpdateDataAction.UPDATE_FILTER, data: { "stinCd": "" }});
        // dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await request.post(`/back-office/edit-line`, { jwt, ...filter }, { cancelToken: source.token })
            if ( !data ) {
                alert("획득한 역 정보가 없어요.");
                return;
            }

            const { new_token, ...others } = data;
            if( new_token ) sessionStorage.setItem('jwt', new_token);
            dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { ...others, isLoading: false }});
        } catch (e) {
            if( axios.isCancel(e) ) return;
            
            // 권한 만료 확인
            const { response } = e;
            if( response && response.data && response.data.error && response.data.error.name === "TokenExpiredError" ) {
                sessionStorage.removeItem('jwt');
                alert('권한 기한이 만료되었습니다.');
                return history.push('/identify'); // 인증페이지로 이동
            }

            console.log("EditDataView axios error", e);
            alert('데이터 요청 중, 문제가 발생하였습니다.');
        }
    };

    // 특정 역의 화장실 요청
    const axiosRequestStation = async () => {
        const jwt = sessionStorage.getItem('jwt');
        
        const ln_name = lineList.find( line => line.lnCd === filter.lnCd );
        const stin_name = stationList.find( station => station.stinCd === filter.stinCd );
        const name = `${stin_name.stinNm} ( ${ln_name.lnNm} )`

        dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { isLoading: true, station: { name: '', _id: '' }, restroomList: [] }});

        try {
            const { data } = await request.post(`/back-office/edit-station`, { jwt, ...filter }, { cancelToken: source.token })
            if( !data ) {
                alert('획득한 화장실 정보가 없어요.')
                return;
            }

            const { new_token, station_id, ...others } = data;
            if( new_token ) sessionStorage.setItem('jwt', new_token);
            dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { ...others, station: { name: name, _id: station_id }, isLoading: false }});
        } catch (e) {
            if( axios.isCancel(e) ) return;
            
            // 권한 만료 확인
            const { response } = e;
            if( response && response.data && response.data.error && response.data.error.name === "TokenExpiredError" ) {
                sessionStorage.removeItem('jwt');
                alert('권한 기한이 만료되었습니다.');
                return history.push('/identify'); // 인증페이지로 이동
            }

            console.log("EditDataView axios error", e);
            alert('데이터 요청 중, 문제가 발생하였습니다.');
        }
    };

    // 화장실 정보 수정
    const axiosRequestEdit = async (r_id) => {
        const jwt = sessionStorage.getItem('jwt');
        let { isChanged, ...edit_restroom } = restroomList.find( ({ _id }) => _id === r_id );
        // edit_restroom.station = edit_restroom.station || filter.stinCd;
        // console.log(edit_restroom);
        dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { isLoading: true }});
        try {
            const { data } = await request.post(`/back-office/edit-restroom`, { jwt, edit_restroom }, { cancelToken: source.token })
            if( !data ) {
                alert('화장실 정보 수정 중, 오류가 발생했어요.');
                return;
            }

            const { new_token, ...others } = data;
            if( new_token ) sessionStorage.setItem('jwt', new_token);
            
            const { success, saved_id } = others;
            if ( !success ) return alert("정보 수정에 실패하였습니다."); 

            // 화면정보 갱신
            dispatch({ type: UpdateDataAction.UPDATE_RESTROOM, 
                mode: !!saved_id, saved_id: saved_id || r_id, 
                data: { isLoading: false }});
            alert('화장실 수정에 성공하였습니다.');
        } catch (e) {
            if( axios.isCancel(e) ) return;
            
            // 권한 만료 확인
            const { response } = e;
            if( response && response.data && response.data.error && response.data.error.name === "TokenExpiredError" ) {
                sessionStorage.removeItem('jwt');
                alert('권한 기한이 만료되었습니다.');
                return history.push('/identify'); // 인증페이지로 이동
            }
            
            console.log("EditDataView axios error", e);
            alert('정보 수정에 실패하였습니다.');
        }
    }

    // 화장실 정보 삭제
    const axiosRequestRemove = async (r_id) => {
        // 새로 만든 값이었으면 그냥 빼내면 끝
        if( r_id === DEFAULT_ID ) return dispatch({ type: UpdateDataAction.REMOVE_RESTROOM, removed_id: r_id });

        const jwt = sessionStorage.getItem('jwt');
        dispatch({ type: UpdateDataAction.UPDATE_STATE, data: { isLoading: true }});
        // 로딩상태로 변경
        try {
            const { data } = await request.post('/back-office/remove-restroom', { jwt, remove_restroom: r_id }, { cancelToken: source.token });
            if(!data) return alert("화장실 삭제 중, 문제가 발생했어요.");
            
            // 결과 확인 및 결과값 반영
            const { success } = data;
            if( !success ) return alert("삭제된 화장실이 없어요.");
            
            dispatch({ type: UpdateDataAction.REMOVE_RESTROOM, removed_id: r_id, data: { isLoading: false }});
            alert("화장실 삭제에 성공했습니다.");
        } catch (e) {
            // 취소인 경우
            if( axios.isCancel(e) ) return;
            
            // 권한 만료 확인
            const { response } = e;
            if( response && response.data && response.data.error && response.data.error.name === "TokenExpiredError" ) {
                sessionStorage.removeItem('jwt');
                alert('권한 기한이 만료되었습니다.');
                return history.push('/identify'); // 인증페이지로 이동
            }
            
            console.log("EditDataView axios error", e);
            alert('정보 수정에 실패하였습니다.');
        }
    }

    // 초기 로딩
    useEffect(() => {
        axiosRequestTrain();
    }, []);
    useEffect(() => {
        if( filter.railOprIsttCd && filter.lnCd) axiosRequestLine();
    }, [filter.railOprIsttCd, filter.lnCd]);

    // useEffect(() => {
    //     console.log('restroomList', restroomList);
    // }, [restroomList]);

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
    // Input 필드 변경
    const onChangeInput = ({ currentTarget: { id, value }}) => {
        const [ component, r_id, target ] = id.split('-');
        // console.log(id, target, "변경");
        dispatch({ type: UpdateDataAction.EDIT_RESTROOM, r_id, data: { [target]: value }});
    }
    // 라디오버튼 변경
    const onChangeRadio = ({ currentTarget: { id, value }}) => {
        const [ component, r_id, target ] = id.split('-');
        dispatch({ type: UpdateDataAction.EDIT_RESTROOM, r_id, data: { [target]: value }});
    }
    // 수정버튼
    const onClickEdit = ({ currentTarget: { id }}) => {
        const [ component, r_id ] = id.split('-');
        axiosRequestEdit(r_id);
    }
    // 삭제버튼
    const onClickRemove = ({ currentTarget: { id }}) => {
        const [ component, r_id ] = id.split('-');
        axiosRequestRemove(r_id);
        // console.log(component, r_id);
    };
    // 새 화장실 추가버튼
    const onClickNewRestroom = () => {
        dispatch({ type: UpdateDataAction.ADD_RESTROOM, s_id: station._id });
    }

    return <>
        { isLoading && <LoadingFilter /> }
        <Box className="view-frame">
            <Box className="filter-bar">
                <select id="select-railOprIsttCd-lnCd" className="select-option" defaultValue="" onChange={onChangeSelect}>
                    <option value="" className="default-opt">-------------- 노선 선택 --------------</option>
                    { lineList.map( ({ railOprIsttCd, lnCd, lnNm }) => <option key={`train-${railOprIsttCd}-${lnCd}`} value={`${railOprIsttCd}-${lnCd}`}>{ lnNm }</option>) }
                </select>
                <select id="select-stinCd" className="select-option" defaultValue="" onChange={onChangeSelect} disabled={stationList.length <= 0}>
                    <option value="" className="default-opt">-------------- 역명 선택 --------------</option>
                    { stationList.map( ({ stinCd, stinNm }) => <option key={`station-${stinCd}`} value={stinCd}>{ stinNm }</option> ) }
                </select>
                <Button size="small" color="secondary" variant="outlined" onClick={onClickSearch} disabled={!filter.stinCd}>
                    <FcSearch size="2rem" />
                </Button>
            </Box>
            {
                station._id &&
                <Box>
                    <Box className="selected-station">{ station.name }</Box>
                    <Box className="restroom-list">
                        {
                            restroomList.map( restroom =>
                                <Box key={`restroom-${restroom._id}`} className="restroom-box">
                                    <FiEdit className={ `icon-${ restroom.isChanged ? "" : "un" }edited` } color="red" size="1.2rem" />
                                    {
                                        splitedTableColumn.map( (tableColumn, idx) => 
                                            <Box key={`restroom-${restroom._id}-${idx}`} className="restroom-line">
                                            { 
                                                tableColumn.map( ({ name, key, option }) => 
                                                    <Box key={`column-${restroom._id}-${key}`} className="restroom-column">
                                                        <Box className="restroom-name">{`${name} :`}</Box>
                                                        {
                                                            option 
                                                            ? option.map(({ name, value }) => {
                                                                    const str = `radio-${restroom._id}-${key}`;
                                                                    return <Box className="restroom-input restroom-input-radio" key={`${str}-${name}`}>
                                                                        <input id={str} name={str} type="radio" value={value} checked={value === restroom[key]} onChange={onChangeRadio} />
                                                                        { name }
                                                                    </Box>
                                                                })
                                                            : <input id={`input-${restroom._id}-${key}`} className="restroom-input" value={restroom[key]} onChange={onChangeInput} />
                                                        }
                                                    </Box>
                                                )
                                            }
                                            </Box>
                                        )
                                    }
                                    <Box className="restroom-footer">
                                        <button id={`editBtn-${restroom._id}`} variant="contained" onClick={onClickEdit}>수정하기</button>
                                        <button id={`removeBtn-${restroom._id}`} variant="contained" onClick={onClickRemove}>삭제하기</button>
                                    </Box>
                                </Box>
                            )
                        }
                    </Box>
                    <button disabled={addNew} onClick={onClickNewRestroom}>추가하기</button>
                </Box>
            }
        </Box>
    </>
};

export default EditDataView;