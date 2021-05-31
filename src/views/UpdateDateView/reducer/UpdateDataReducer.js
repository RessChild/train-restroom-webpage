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
                            : { ...restroom, ...action.data } 
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
                "restroomList": !action.saved_id // id 값 수정이 필요없다면
                    ? state.restroomList // 그대로
                    : state.restroomList.map( restroom => // 그 외엔 찾아서 수정
                        restroom._id !== DEFAULT_ID
                            ? restroom
                            : { ...restroom, _id: action.saved_id }
                    ),
                addNew: !action.saved_id && state.addNew,
            }
        default:
            throw new Error("undefined addListReducer action");
    }
};

export {
    updateDataInit, UpdateDataAction, updateDataRudcer
};