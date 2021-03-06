const reportListInit = {
    filter: {
        isRead: true,
        page: 0,
    },
    totalPage: 0,
    reportList: [],
    checkList: [],
    isLoading: false,
};

const ReportListAction = {
    UPDATE_STATE: "UPDATE_INPUT",
    UPDATE_FILTER: "UPDATE_FILTER",
};

const reportListRudcer = (state, action) => {
    switch (action.type) {
        case ReportListAction.UPDATE_STATE:
            return {
                ...state,
                ...action.data,
            };
        case ReportListAction.UPDATE_FILTER:
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
    reportListInit, ReportListAction, reportListRudcer
};