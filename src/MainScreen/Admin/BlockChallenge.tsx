import React,{useEffect, useState} from 'react'
import {  FlatList, StyleSheet, View } from 'react-native'
import AdminContainer from './components/AdminContainer'
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {Button,Avatar,Text} from 'react-native-elements'

const DareItem = ({item,editDare}) =>{
    return(
        <View style={styles.userCard}>
                        <View style={styles.cardLeft}>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>{item.title}</Text>
                        </View>

                        <View style={styles.cardRight}>
                        <Button
                        title={item.isBlocked?"Unblock":"Block"}
                        buttonStyle={[styles.btnStyle,{backgroundColor:item.isBlocked?"#2F80ED":"red"}]}
                        titleStyle={styles.btnText}

                        onPress={() =>{
                            if(item.isBlocked){
                                editDare(item.videoId,false)
                            }else{
                                editDare(item.videoId,true)
                            }
                        }}
                        />
                        </View>
        </View>
    )
}



const BlockChallenge = () => {
    const dareRef = firestore().collection('dares');
    const [dareList,setDareList] = useState()

    useEffect(() =>{
        const unsubricbeListener = dareRef.onSnapshot(querySnapshot => {
            let dlist=[]
            querySnapshot.forEach(doc => {
              dlist.push(doc.data())
            });

            setDareList(dlist);
  
            
          });

          return () => unsubricbeListener()
    },[])

    const editDare = (video_id,block) =>{
        const res = dareRef
        .where("videoId", "==", video_id)
        .get()
        .then(querySnapshot => {
            
            const docId = querySnapshot.docs[0].id
            dareRef.doc(docId).update({
                isBlocked:block
            })
        })
        
    }
    return (
        <AdminContainer>
            <View style={{flex:1,padding:10}}>

            <FlatList 
                data={dareList}
                renderItem={({item,index}) => <DareItem item={item} i={index} editDare={editDare} />}
                keyExtractor={(item) => item.videoId}
                />

            </View>
                
        </AdminContainer>
    )
}

export default BlockChallenge

const styles = StyleSheet.create({
    userCard:{
        flex:1,
        flexDirection:'row',
        backgroundColor:'white',
        marginVertical:10,
        padding:15,
        borderRadius:25
    },
    cardLeft:{
        flex:1,
        justifyContent:'center'
    },
    cardRight:{
        flex:1/2,
        marginLeft:20
    },
    actionView:{
        paddingTop:10,
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    btnStyle:{
        marginRight:15,
        width:90
    },
    btnText:{
        fontSize:18
    },
 

})
