import { CLEAR_SEARCH, SEARCH_CHALLENGE, SET_CHALLENGE } from './types'


export const setChallenge = (challenege) =>{
    return{
        type:SET_CHALLENGE,
        payload:challenege
    }

}

export const searchChallenge = (searchText:String) =>{
    return{
        type:SEARCH_CHALLENGE,
        payload:searchText
    }

}

export const clearSearch = () =>{
    return{
        type:CLEAR_SEARCH,
        
    }

}