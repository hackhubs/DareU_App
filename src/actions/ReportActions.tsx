import { SET_REPORTS } from "./types"


export const setReports = (comlist,runlist) =>{
   return(
    {
        type:SET_REPORTS,
        payload:{
            clist:comlist,
            rlist:runlist
        }

}
   )
}