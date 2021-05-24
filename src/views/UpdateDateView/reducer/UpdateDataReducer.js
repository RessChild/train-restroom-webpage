const updateDataInit = {
    filter: {
        lnCd: '',
        stinCd: '',
    },
    lineList: [], // 노선 정보
    stationList: [], // 노선별 역 정보
    restroomList: [], // 역별 화장실 정보
    isLoading: false,
};

const UpdateDataAction = {
    UPDATE_STATE: "UPDATE_INPUT",
    UPDATE_FILTER: "UPDATE_FILTER",
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
                    "page": 0, // 필터값이 바뀌면 첫 페이지로 이동
                    ...action.data, // 페이지 값이 변한 경우, 덮어씀
                }
            };
        default:
            throw new Error("undefined addListReducer action");
    }
};

export {
    updateDataInit, UpdateDataAction, updateDataRudcer
};