import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View,ScrollView } from 'react-native'
import {Avatar} from 'react-native-elements'
import {thumbnails} from './dummy'
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

function compare(obj1,obj2){
    const likes1 = obj1.likes.length;
    const likes2 = obj2.likes.length;
    let comparison = 0;
    if(likes1 > likes2){
        comparison =1;
    }else if(likes1 < likes2){
        comparison = -1;
    }
    return comparison * -1;
}

function containsObject(obj, list) {

    return list.some(elem => elem === obj)
}

const Leaderboard = (props) => {
    //console.log("LeaderBoard Props",props.plist)

    let participantList = []
    if(props.plist){  //Rearranged particpant List
        participantList =props.plist.sort(compare) 
    }

    const userRef = firestore().collection('users')
    const [userList,setUserList] = useState([])

    const getUsers = async () =>{
        let users= {}
        await userRef.get()
        .then(snap =>{
            snap.forEach(user =>{
                const {user_id,pic_url} = user.data()
                users[user_id] = pic_url
            })
          
        })
        console.log(users)
        let finalUsers = []
        participantList.map((p,index) =>{
           if(index <10){
           if(p.participant_id){
            if(Object.keys(users).includes(p.participant_id.trim())){
                
                let userObj = {
                    user_id:p.participant_id.trim(),
                    pic_url:users[p.participant_id.trim()]
                }
                let exists
                if(finalUsers.length > 0){
                    exists = (Object.values(finalUsers[finalUsers.length-1]).includes(p.participant_id))
                }
                
               if(!exists){
                finalUsers.push(userObj)
               }
            }
           }
           }
            
        })
        
        console.log(finalUsers)
        setUserList(finalUsers)
        
    }
    useEffect(() =>{
         getUsers()

    },[props.plist.length])
    return (
        <View style={styles.storieView}>
            <View style={styles.storieHeader}>
                    <Text style={styles.title}>Leaderboard</Text>
                   
                 
            </View>
            <View style={styles.storieThumbnails}>
                <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    alignItems:'center',
                    paddingStart:5,
                    paddingEnd:5,
                }}
                >
                    {
                        userList && 
                        userList.map((user,id) =>{
                            return(
                        <View style={{marginHorizontal:5,alignItems:'center',justifyContent:'center'}} key={user.user_id}>
                                <Avatar
                                size="large"
                                key={user.user_id}
                                rounded
                                source={{
                                    uri:user.pic_url
                    
                                }}
                                avatarStyle={{
                                    borderColor:'#FC5C7D',
                                    borderWidth:2,    
                                }}
                            />
                            <Text style={{fontSize:19,fontWeight:'bold'}}>{id+1}</Text>
                            </View> 
                            )
                        })
                    }
                        
                </ScrollView>
            </View>
        </View>
    )
}

export default Leaderboard

const styles = StyleSheet.create({
    storieView:{
        height:140,
        backgroundColor:'orange'
    },
    storieHeader:{
        flex:1,
        paddingHorizontal:7,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    storieThumbnails:{
        flex:3,
    },
    title:{
        fontSize:20,
        fontWeight:'bold',
        color:'white'
    }
})
