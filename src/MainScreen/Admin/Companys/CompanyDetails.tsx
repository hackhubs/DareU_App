import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View,TextInput,FlatList,TouchableOpacity } from 'react-native'
import AdminContainer from '../components/AdminContainer'
import storage from '@react-native-firebase/storage';
import {Button,Avatar,Text,Icon} from 'react-native-elements'
import firestore from '@react-native-firebase/firestore';
import MainContext from '../../../MainContext/MainContext';
import DocumentPicker from 'react-native-document-picker';
import { utils } from '@react-native-firebase/app';
import RNFetchBlob from 'rn-fetch-blob'
import AddCompany from './AddCompany';

const CompanyItem = ({item,deleteDare}) =>{
    return(
        <View style={styles.cItem}>
            <View>
            <Avatar
           rounded
           source={require('../../../../assets/image/wm.jpeg')}
           size="large"
           title="Logo"
           titleStyle={{fontSize:20}}
           activeOpacity={0.7}
           containerStyle={{backgroundColor:'grey)'}}
           />
            </View>
            <View style={{paddingHorizontal:10}}>
            <Text style={styles.name}>{item.data.company_name}</Text>
            <Text style={styles.contentText}>{item.data.address}</Text>
            <Text style={styles.contentText}>{item.data.website}</Text>

            </View>
            <View style={{position:'absolute',top:20,right:10}}>
            <Button
            raised
            title="Delete"
            buttonStyle={{
                    borderRadius:10,
                    backgroundColor:'red'
            }}
            onPress={() => {deleteDare(item.id)}}
                />
            </View>

            
        </View>
    )
}





const CompanyDetails = () => {
   const [ImgUri,setImgUri] = useState('');
   const [isEdit,setIsEdit] = useState(false);
   const [selectedUri,setSelectedUri] = useState('');
   const [imagName,setImageName] = useState('')
   const [docId,setDocId] = useState('');
   const [cd,setCd] = useState({
       name:'',
       address:'',
       website:'',
       logo_url:''
   });
   const [visible, setVisible] = useState(false);
   const [companyList,setCompanyList] = useState([])
   const mainContext = useContext(MainContext)
   const {user_id} = mainContext
   const companyRef = firestore().collection('companydetails')
   const reference = storage().ref(`/company_logos/${user_id}.jpeg`)

   const toggleOverlay = () => {
    setVisible(!visible);
  };

   const getSource = async() =>{
    try {
        let res =  await reference.getDownloadURL()
        setSelectedUri(res)
    } catch (error) {
        setSelectedUri('')
    }
    
   }
   
   
   const saveImageToCloud = async() =>{
   
    // uploads file

    const task = reference.putFile(selectedUri);

    task.on('state_changed', taskSnapshot => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    });
    
    task.then(() => {
      getSource()
      console.log('Image uploaded to the bucket!');
    });
   }

    const getCompanyDetails = async () =>{
       try {
        companyRef.get().then(querySnapshot =>{
                setDocId(querySnapshot.docs[0].id)
                setCd({
                    ...cd,
                    name:querySnapshot.docs[0].data().name,
                    address:querySnapshot.docs[0].data().address,
                    website:querySnapshot.docs[0].data().website
                })
            })
       } catch (error) {
           console.log(error)
       }
    }

    const saveCompanyDetails = async (name,address,website) =>{
        companyRef.doc(name).set({
            company_name:name,
            address:address,
            website:website
        })
    }

  
    const selectImage = async () => {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
          });
            console.log(res.uri);
            const path = (await RNFetchBlob.fs.stat(res.uri)).path
            setSelectedUri(path);
            setImageName(res.name)
    
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
            console.log("canceled")
          } else {
            console.log(err)
          }
        }
        
      }
    
    const deleteDare = async(docid) =>{
        (await companyRef.doc(docid)).delete()

    }
    useEffect(() =>{
        const subscriber = companyRef.onSnapshot(querySnapShot =>{
            let clist = []
               querySnapShot.forEach(doc =>{
                    clist.push({
                        data:doc.data(),
                        id:doc.id
                    })
               })
            setCompanyList(clist);
        })


        return() => subscriber()
          
          
    },[])
    
    return (
        <AdminContainer>
            <FlatList
            data={companyList}
            renderItem={({item}) => <CompanyItem item={item} deleteDare={deleteDare}/>}
            keyExtractor={item => item.id || "da"}
            />

            <View style={styles.fab}>
            <Button
            raised
                icon={
                    <Icon
                    name="plus"
                    type="material-community"
                    size={35}
                    color="white"
                    />
                }
                buttonStyle={{
                    borderRadius:30,
                    backgroundColor:'red'
                }}
                onPress={() => setVisible(true)}
                />
            </View>
            {
                visible && <AddCompany 
                toggleOverlay={toggleOverlay} 
                visible={visible}
                saveCompanyDetails={saveCompanyDetails}
                />
            }
            
        </AdminContainer>
    )
}


export default CompanyDetails

const styles = StyleSheet.create({
    cItem:{
        flex:1,
        flexDirection:'row',
        marginHorizontal:10,
        minHeight:70,
        padding:15,
        backgroundColor:'#fff',
        marginVertical:10,
        borderRadius:5,
        alignItems:'center'
    },
    name:{
        fontSize:19,
        fontWeight:'bold',
        marginBottom:10,
    },
    contentText:{
        fontSize:17,
        marginBottom:10,
    },
    cd:{
        flex:1,
        alignItems:'center'
    },
    logo:{
       
        marginVertical:15,
 
    },
    labelView:{
        marginVertical:15
    },
    label:{
        fontSize:26,
        fontWeight:'bold',
        textAlign:'center'
    },
    value:{
        fontSize:23,
        color:'white',
        textAlign:'center'
    },
    valueView:{
        borderRadius:10,
        paddingHorizontal:15,
        paddingVertical:5,
        backgroundColor:'rgba(255,255,255,.2)'
    },
    fab:{
        zIndex:10,
        position:'absolute',
        bottom:20,
        right:20,
        borderRadius:30,
    }
})
