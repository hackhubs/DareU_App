import React, { useContext } from 'react'
import { StyleSheet, Text, View,Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements'
import MainContext from '../MainContext/MainContext';


const DareRules = ({navigation}) => {
    const mainContext = useContext(MainContext)
    const {videoUri} = mainContext;
    console.log(videoUri)
    return (
        <View style={styles.container}>
            <LinearGradient 
            colors={["#6E45E1", "#66a6ff"]} 
            
            style={{
                position:'absolute',
                top:0,
                bottom:0,
                left:0,
                right:0
            }}
            />


            <TouchableOpacity style={[styles.video,{justifyContent:'center',alignItems:'center',padding:10}]} onPress={() => navigation.navigate('Upload Video')}>
                    <Icon type="material" name="video-library" size={54} color="red" />
                    <Text style={{fontSize:20,lineHeight:30,marginTop:10}}>No video is selected.Click here to upload a video</Text>
            </TouchableOpacity>

            <View>
   
           
            
            </View>
  
            <View>
                <Text style={styles.ruleHead}>Dare Rule Description</Text>
            </View>
        </View>
    )
}

export default DareRules

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:Dimensions.get('screen').width,
        backgroundColor:'white',
        padding:10,
    }, 
    headerView:{
        marginVertical:15,
        justifyContent:'center',
        alignItems:'center'
    },
    headerText:{
        color:'white',
        fontSize:25,
    },
    video:{
        height:250,
        backgroundColor:'white',
        borderRadius:10,
        margin:10,
    
    },
    ruleHead:{
        marginVertical:20,
        color:'white',
        fontSize:20,
        textAlign:'center'

    },
    backgroundVideo: {
        height:400,
        width:300

      },
})
