import React,{useContext, useEffect, useState} from 'react'
import {  FlatList, StyleSheet, View } from 'react-native'
import AdminContainer from './components/AdminContainer'
import firestore from '@react-native-firebase/firestore';
import {Button,Avatar,Text} from 'react-native-elements'
import MainContext from '../../MainContext/MainContext';

const UserItem = ({item,editUser,navigation}) =>{
 
    return(
        <View style={styles.userCard}>
                <View style={styles.cardLeft}>
                {
                    item.pic_url ?
                    <Avatar
                    rounded
                    size="medium"
                    source={{uri : item.pic_url}}
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                    containerStyle={{backgroundColor:'grey'}}
                    />
                    :
                    <Avatar
                    rounded
                    size="medium"
                    icon={{name:'user',type:'font-awesome'}}
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                    containerStyle={{backgroundColor:'grey'}}
                    />
                }
                </View>
                <View style={styles.cardRight}>
                        <View>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>{item.username}</Text>
                        </View>

                        <View style={styles.actionView}>
                        <Button
                        title="Block"
                        buttonStyle={[styles.btnStyle,{backgroundColor:'red'}]}
                        titleStyle={styles.btnText}
                        disabled={item.isBlocked}
                        onPress={() =>{editUser(item.user_id,true)}}
                        />

                        <Button
                        title="Reactive"
                        buttonStyle={[styles.btnStyle,{backgroundColor:'#2F80ED'}]}
                        titleStyle={styles.btnText}
                        disabled={!item.isBlocked}
                        onPress={() =>{editUser(item.user_id,false)}}
                        />
                         <Button
                        title="Dares"
                        buttonStyle={[styles.btnStyle,{backgroundColor:'#c471ed'}]}
                        titleStyle={styles.btnText}
                        onPress={() =>{navigation.navigate('User Dares',{user_id:item.user_id})}}
                        />

                        </View>
                        

                </View>
        </View>
    )
}



const ManagerUser = (props) => {
    const userRef = firestore().collection('users');
    const [userList,setUserList] = useState()
    const mainContext = useContext(MainContext);
    const {user_id} = mainContext
    
    useEffect(() => {
        const subscriber = userRef
          .onSnapshot(documentSnapshot => {
            let ulist=[]
            documentSnapshot.forEach(doc => {
                if(user_id != doc.data().user_id){
                    ulist.push(doc.data())
                }
               
            });

             setUserList(ulist);
          });
    
        // Stop listening for updates when no longer required
        return () => subscriber();
      }, []);
   

    const editUser = (user_id,block) =>{
        userRef
        .where("user_id", "==", user_id)
        .get()
        .then(querySnapshot => {
            
            const docId = querySnapshot.docs[0].id
            userRef.doc(docId).update({
                isBlocked:block
            })
        })
        
    }
    return (
        <AdminContainer>
            <View style={{flex:1,padding:10}}>
            <FlatList 
                data={userList}
                renderItem={({item,index}) => <UserItem item={item}  editUser={editUser} navigation={props.navigation}/>}
                keyExtractor={(item) => item.user_id}
                />
            </View>
                
        </AdminContainer>
    )
}

export default ManagerUser

const styles = StyleSheet.create({
    userCard:{
        flex:1,
        flexDirection:'row',
        backgroundColor:'white',
        marginVertical:10,
        padding:15,
        borderRadius:20
    },
    cardLeft:{
        flex:1/4,
        justifyContent:'center'
    },
    cardRight:{
        flex:1,
        marginLeft:2
    },
    actionView:{
        paddingTop:10,
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    btnStyle:{
        marginRight:10,
        width:85,
      
    },
    btnText:{
        fontSize:17
    },
 

})
