import { SET_REPORTS} from "../actions/types"

const initialState = {
 
    clist:[],
    rlist:[],

}
const ReportReducer = (state=initialState,action) =>{
    switch(action.type){
        case SET_REPORTS:
            return{
                ...state,
                clist:action.payload.clist,
                rlist:action.payload.rlist,
            };
        
        default:
            return state;
    }
}

export default ReportReducer;