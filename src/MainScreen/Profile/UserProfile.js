import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ToggleButton,Avatar } from 'react-native-paper';
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements'
import MainContext from '../../MainContext/MainContext';
const UserProfile = () => {
    const mainContext = useContext(MainContext)
    const {username,email,pic_url,user_id} = mainContext
    const [value, setValue] = React.useState('left');
    const dareRef = firestore().collection('dares')
    const [running,setRunning] = useState(0)
    const [participated,setParticipated] = useState(0)
    useEffect(() =>{
        dareRef
        .get()
        .then(querySnapshot => {
            let parlist=[]
            let runlist = []
           
            querySnapshot.forEach(doc => {
                
                const {participants,created_by} = doc.data()
                
                let end = doc.data().end_date.split('/')
                let current = new Date()
                let cur_dat = current.toLocaleDateString().split('/')
                if(participants){
                    participants.forEach(p =>{
                        if(p.participant_id === user_id){
                             parlist.push(p)
                        }
                    })
                }
                if(created_by.trim() === user_id.trim()){
                    runlist.push(doc.data())
                }
                // if(Number(cur_dat[1]) >Number(end[1])){
                //         clist.push(doc.data())
                // }else{
                //         dlist.push(doc.data())
                // }

               
                
            
            

            });
            
            console.log(runlist)
            setRunning(runlist.length)
            setParticipated(parlist.length)
               

              
                
            
            
            
          });

           
          
    },[])
    return (
        
        <View style={styles.container}>
           
            <View style={styles.header}>
                <View style={{marginTop:20,marginBottom:10}}>
                <Avatar.Image source={{uri:pic_url}} size={130}/>
                </View>

    <Text style={{fontSize:20,fontWeight:'bold',color:'black'}}>{username}</Text>
                
                <View style={{flexDirection:'row',alignItems:'center',padding:20}}>
                        <View style={{paddingRight:30}}>
                            <Text style={{textAlign:'center',fontSize:23,fontWeight:'bold',color:'black'}}>{participated}</Text>
                            <Text style={{fontSize:18}}>Participated {"  "}
                                            <Icon type="font-awesome-5"
                                                name='trophy'
                                                color='#fcb045'
                                                size={20}
                                                />
                            </Text>
                        </View>
                        <View >
                            <Text style={{textAlign:'center',fontSize:23,fontWeight:'bold',color:'black'}}>{running}</Text>
                            <Text style={{fontSize:18}}>Running {"  "}
                            <Icon type="font-awesome"
                                                name='flag'
                                        
                                                color='#fcb045'
                                                size={22}
                                                />
                            </Text>
                        </View>
                    
                </View>

            </View>
            <View style={{flex:1}}>
            {/* <ToggleButton.Row onValueChange={value => setValue(value)} value={value} style={styles.btnGrp}>
                <ToggleButton icon={() => <MaterialIcons type="material" name="video-library" />} value="left" />
                <ToggleButton icon="heart" value="center" />
                <ToggleButton icon="bookmark" value="right" />
            </ToggleButton.Row> */}
             <View style={{flex:1,flexDirection:'row',backgroundColor:'white'}}>
                      
            </View>         
            </View>
             
        </View>
    )
}

export default UserProfile

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    header:{
        flex:1,
        flexDirection:'column',
       
        alignItems:'center'
    },
    btnGrp:{
        justifyContent:'space-around',
        backgroundColor:'white',
        padding:10,
        elevation: 1,
        shadowColor : '#000',
        shadowOpacity: 0.9,
        shadowOffset: {
          height: 0,
          width:2
        },
        shadowRadius: 5,
    }
})
