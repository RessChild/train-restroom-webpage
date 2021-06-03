const { initTableColumn, DEFAULT_ID } = require('../data/UpdateDataData');

const updateDataInit = {
    filter: {
        railOprIsttCd: '',
        lnCd: '',
        stinCd: '',
    },
    lineList: [], // 노선 정보
    stationList: [], // 노선별 역 정보
    restroomList: [], // 역별 화장실 정보
    station: {
        name: '', // 현재 선택된 역명 (노선 포함)
        _id: '', // ObjectId
    }, 
    addNew: false, // 새로운 걸 추가하려는 상태인가?
    isLoading: false,
};

const UpdateDataAction = {
    UPDATE_STATE: "UPDATE_STATE",
    UPDATE_FILTER: "UPDATE_FILTER",
    EDIT_RESTROOM: "EDIT_RESTROOM",
    ADD_RESTROOM: "ADD_RESTROOM",
    UPDATE_RESTROOM: "UPDATE_RESTROOM",
    REMOVE_RESTROOM: "REMOVE_RESTROOM",
};

const updateDataRudcer = (state, action) => {
    switch (action.type) {
        case UpdateDataAction.UPDATE_STATE:
            return {
                ...state,
                ...action.data,
            };
        case UpdateDataAction.UPDATE_FILTER:
            return {
                ...state,
                "filter": {
                    ...state["filter"],
                    ...action.data, // 페이지 값이 변한 경우, 덮어씀
                }
            };
        case UpdateDataAction.EDIT_RESTROOM:
            return {
                ...state,
                "restroomList": state.restroomList.map( restroom => 
                        restroom._id !== action.r_id 
                            ? restroom 
                            : { ...restroom, ...action.data, isChanged: true } 
                    ),
            };
        case UpdateDataAction.ADD_RESTROOM:
            return {
                ...state,
                "restroomList": state.restroomList.concat({ ...initTableColumn, station: action.s_id }),
                addNew: true,
            };
        case UpdateDataAction.UPDATE_RESTROOM:
            return {
                ...state,
                ...action.data,
                "restroomList": state.restroomList.map( restroom => // 그 외엔 찾아서 수정
                        // 신규 정보인 경우는 default_id랑 비교, 기존 정보면 saved_id 랑 비교
                        restroom._id !== (action.mode ? DEFAULT_ID : action.saved_id)
                            ? restroom
                            : { ...restroom, _id: action.saved_id, isChanged: false }
                    ),
                // 신규 정보가 저장 안된 경우는 기존 상태를 참고함
                addNew: !action.saved_id && state.addNew,
            };
        case UpdateDataAction.REMOVE_RESTROOM: 
            return {
                ...state,
                ...action.data,
                "restroomList": state.restroomList.filter(({ _id }) => 
                    _id !== action.removed_id ),
                // 신규가 삭제된 경우면 무조건 false 로 바꾸고, 그 외엔 기존값을 따라감
                addNew: action.removed_id !== DEFAULT_ID && state.addNew,
            };
        default:
            throw new Error("undefined addListReducer action");
    }
};

export {
    updateDataInit, UpdateDataAction, updateDataRudcer
};