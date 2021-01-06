import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const CamTimer = ({recording}) => {
    const [timer,setTimer] = React.useState(0.00)
    useEffect(() =>{
    let  intrvl = null
       if(recording){
           intrvl = setInterval(() => {
            setTimer(timer =>timer+0.01)
           },1000)
       }else{
           clearInterval(intrvl)
           setTimer(0.00)
       }     
       return() =>{
           clearInterval(intrvl)
       }
    },[recording])
    return (
            <View style={styles.timerStyle}>
                  <Text style={{color:'red',fontSize:25,fontWeight:'bold'}}>{timer.toFixed(2)}</Text>
             </View>

    )
}

export default CamTimer

const styles = StyleSheet.create({
    timerStyle:{
        position:'absolute',
        width: "100%",
        height:35,
        backgroundColor:'transparent',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        bottom:85,
        
      }
})
