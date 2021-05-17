const addListInit = {
    filter: {
        isRead: true,
        page: 0,
    },
    totalPage: 0,
    addList: [],
    checkList: {},
    isLoading: false,
};

const AddListAction = {

    UPDATE_STATE: "UPDATE_INPUT",
    UPDATE_FILTER: "UPDATE_FILTER",
};

const addListRudcer = (state, action) => {
    switch (action.type) {
        case AddListAction.UPDATE_STATE:
            return {
                ...state,
                ...action.data,
            };
        case AddListAction.UPDATE_FILTER:
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
    addListInit, AddListAction, addListRudcer
};