
const MainReducer = (state,action) =>{
    switch(action.type){
        case 'SET_USER_DETAILS':
            return {
                ...state,
                token:action.payload['accessToken'],
                username:action.payload.username,
                email:action.payload.email,
                pic_url:action.payload.pic_url,
                user_id:action.payload.user_id,
                isRegisterd:true,
            }
        case 'SET_VIDEO_URI':
            return{
                ...state,
                videoUri:action.payload
            }
        case 'USER_BLOCKED':
            return{
                ...state,
                userBlocked:true
            }
        default:
            return state
    }

}

export default MainReducer