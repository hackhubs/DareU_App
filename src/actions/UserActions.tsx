import { SET_USER } from "./types"



export const setUserDetails = (detail) =>{
    console.log("Set User Action Called",detail)
    return{
        type:SET_USER,
        payload:detail
    }

}