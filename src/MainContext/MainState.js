import React from 'react'
import MainContext from './MainContext'
import MainReducer from './MainReducer'


const MainState = (props) =>{

    const initialState = {
        token:'',
        username:'',
        email:'',
        pic_url:'',
        isRegisterd:false,
        userBlocked:false,
        user_id:'',
        videoUri:''

    }

    const [state,dispatch] = React.useReducer(MainReducer,initialState)


    const setUserDetails = (detail) =>{
        console.log(detail)
        dispatch({type:'SET_USER_DETAILS',payload:detail})

    }

    const setVideoUri = (uri) =>{
        dispatch({type:'SET_VIDEO_URI',payload:uri})
    }

    const setUserBlocked = () =>{
        dispatch({type:'USER_BLOCKED'})
    }

    return(
        <MainContext.Provider value={{
            token:state.token,
            username:state.username,
            isRegistered:state.isRegistered,
            pic_url:state.pic_url,
            email:state.email,
            user_id:state.user_id,
            videoUri:state.videoUri,
            userBlocked:state.userBlocked,



            setUserDetails,
            setVideoUri,
            setUserBlocked

        }}>
            {props.children}
        </MainContext.Provider>
    )

}


export default MainState;