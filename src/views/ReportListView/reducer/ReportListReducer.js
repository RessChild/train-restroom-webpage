const reportListInit = {
    reportList: [],
    checkList: [],
    isLoading: false,
};

const ReportListAction = {
    UPDATE_STATE: "UPDATE_INPUT",
};

const reportListRudcer = (state, action) => {
    switch (action.type) {
        case ReportListAction.UPDATE_STATE:
            return {
                ...state,
                ...action.data,
            };
        default:
            throw new Error("undefined addListReducer action");
    }
};

export {
    reportListInit, ReportListAction, reportListRudcer
};