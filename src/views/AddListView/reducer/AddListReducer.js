const addListInit = {
    filter: {
        isRead: true,
        isClear: true,
    },
    addList: [],
    checkList: [],
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
                [action.target]: {
                    ...state[action.target],
                    ...action.data,
                }
            };
        default:
            throw new Error("undefined addListReducer action");
    }
};

export {
    addListInit, AddListAction, addListRudcer
};