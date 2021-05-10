const addListInit = {
    addList: [],
    checkList: [],
    isLoading: false,
};

const AddListAction = {
    UPDATE_STATE: "UPDATE_INPUT",
};

const addListRudcer = (state, action) => {
    switch (action.type) {
        case AddListAction.UPDATE_STATE:
            return {
                ...state,
                ...action.data,
            };
        default:
            throw new Error("undefined addListReducer action");
    }
};

export {
    addListInit, AddListAction, addListRudcer
};