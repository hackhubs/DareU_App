import { CLEAR_SEARCH, SEARCH_CHALLENGE, SET_CHALLENGE } from "../actions/types"

const initialState = {
    challenges:[],
    filtered:'',

}
const ChallengeReducer = (state=initialState,action) =>{
    switch(action.type){
        case SET_CHALLENGE:
            return{
                ...state,
                challenges:action.payload
            };
        case SEARCH_CHALLENGE:
            return{
                ...state,
                filtered:state.challenges.filter(function(obj){
                    return(
                        obj.title.includes(action.payload.toLowerCase())||
                        obj.title.includes(action.payload.toUpperCase()) ||
                        ((obj.title).toLowerCase()).includes(action.payload.toLowerCase())
                    );
                })
            };
        case CLEAR_SEARCH:
            return{
                ...state,
                filtered:''
            };
        default:
            return state;
    }
}

export default ChallengeReducer;