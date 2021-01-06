import { SET_USER } from "../actions/types"

const initialState = {
    token:'',
    username:'',
    email:'',
    pic_url:'',
    user_id:'',
}

const UserReducer = (state=initialState,action) =>{
    switch(action.type){
        case SET_USER:
            return{
                ...state,
                token:action.payload['accessToken'],
                username:action.payload.username,
                email:action.payload.email,
                pic_url:action.payload.pic_url,
            }
        default:
            return state
    }
}

export default UserReducer;