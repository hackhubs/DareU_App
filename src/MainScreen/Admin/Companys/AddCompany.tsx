import React,{useState} from 'react'
import { StyleSheet, Text, View,TextInput, Dimensions } from 'react-native'
import { Button, Overlay } from 'react-native-elements';
import { add } from 'react-native-reanimated';

const AddCompany = (props) => {
    const [cd,setCd] = useState({
        name:'',
        address:'',
        website:'',
        logo_url:''
    });
    return (
       
            

        <Overlay isVisible={props.visible} onBackdropPress={props.toggleOverlay} >
            
        <View style={styles.addItem}>
                <Text style={[styles.label,{textAlign:'center',fontWeight:'bold',}]}>Add Company</Text>
                <View style={styles.labelView}>
                    <Text style={styles.label}>Name :</Text>
                    <View style={styles.valueView}>  
                        <TextInput 
                        value={cd.name} 
                        onChangeText={txt => setCd({...cd,name:txt})}
                        style={styles.inputStyle}
                        />      
                    </View>
            
                </View>
                <View style={styles.labelView}>
                    <Text style={styles.label}>Address :</Text>
                    <View style={styles.valueView}>
                    <TextInput 
                    value={cd.address} 
                    onChangeText={txt => setCd({...cd,address:txt})}
                    style={styles.inputStyle}
                    />   
                    </View>
            
                </View>
                <View style={styles.labelView}>
                    <Text style={styles.label}>website :</Text>
                    <View style={styles.valueView}>
                        <TextInput 
                        value={cd.website} 
                        onChangeText={txt => setCd({...cd,website:txt})}
                        style={styles.inputStyle}
                        /> 
                    </View>
                </View>    
                <View >

                    <Button title="Save"  onPress={() => {
                        props.saveCompanyDetails(cd.name,cd.address,cd.website)
                        props.toggleOverlay()
                    }} 
                    buttonStyle={{
                        marginTop:20,
                        backgroundColor:'red'
                    }}
                    />
                </View>

            
        </View>
        

        

       

   
    

        
        </Overlay>
    
    )
}

export default AddCompany

const styles = StyleSheet.create({
    addItem:{
       
        height:Dimensions.get('screen').height-250,
        width:Dimensions.get('screen').width-60
    },
    cd:{
        flex:1,
        alignItems:'flex-start'
    },
    logo:{
       
        marginVertical:15,
 
    },
    inputStyle:{
        backgroundColor:'#f6f6f6',
        fontSize:19,
    },
    labelView:{
        marginVertical:15
    },
    label:{
        fontSize:20,
        
      
    },
    value:{
        fontSize:23,
        color:'white',
        
    },
    valueView:{
        borderRadius:10,
        paddingHorizontal:15,
        paddingVertical:5,
        backgroundColor:'rgba(255,255,255,.2)'
    },
})

// {
//     isEdit?
//     <View style={styles.cd}>
    
//     <View style={styles.logo}>
//        {
//            selectedUri?
//            <Avatar
//            rounded
//            size="xlarge"
//            source={{uri:selectedUri}}
//            onPress={() => {
//                selectImage()
//            }}
//            activeOpacity={0.7}
//            containerStyle={{backgroundColor:'grey'}}
//            />
//            :
//            <Avatar
//            rounded
//            size="xlarge"
//            title="Logo"
//            titleStyle={{fontSize:20}}
//            onPress={() => {
//                selectImage()
//            }}
//            activeOpacity={0.7}
//            containerStyle={{backgroundColor:'grey'}}
//            />
//        }
//     </View>

//     <View style={styles.labelView}>
//     <Text style={styles.label}>Name</Text>
//     <View style={styles.valueView}>  
//         <TextInput value={cd.name} onChangeText={txt => setCd({...cd,name:txt})}/>      
//     </View>
      
//     </View>

//     <View style={styles.labelView}>
//     <Text style={styles.label}>Address</Text>
//     <View style={styles.valueView}>
//     <TextInput value={cd.address} onChangeText={txt => setCd({...cd,address:txt})}/>   
//     </View>
   
//     </View>

//     <View style={styles.labelView}>
//     <Text style={styles.label}>website</Text>
//     <View style={styles.valueView}>
//          <TextInput value={cd.website} onChangeText={txt => setCd({...cd,website:txt})}/> 
//     </View>

   
    
//     </View>
//     <View >
//         <Button title="Save"  onPress={() => {
//             setIsEdit(false)
//             saveImageToCloud()
//             saveCompanyDetails()    
//         }}/>
//     </View>
    
// </View>
//     :
//     <View style={styles.cd}>
//     <View style={{position:'absolute',right:15,top:15}}>
//         <Button title="Edit" icon={{name:'edit',type:'material',color:'white'}} buttonStyle={{backgroundColor:'red'}} onPress={() => setIsEdit(true)}/>
//     </View>
//     <View style={styles.logo}>
//     {
//            selectedUri?
//            <Avatar
//            rounded
//            size="xlarge"
//            source={{uri:selectedUri}}
//            activeOpacity={0.7}
//            containerStyle={{backgroundColor:'grey)'}}
//            />
//            :
//            <Avatar
//            rounded
//            source={require('../../../assets/image/wm.jpeg')}
//            size="xlarge"
//            title="Logo"
//            titleStyle={{fontSize:20}}
//            activeOpacity={0.7}
//            containerStyle={{backgroundColor:'grey)'}}
//            />
//        }
//     </View>

//     <View style={styles.labelView}>
//     <Text style={styles.label}>Name</Text>
//     <View style={styles.valueView}>  
//     <Text style={styles.value}>{ cd.name && cd.name}</Text>     
//     </View>
      
//     </View>

//     <View style={styles.labelView}>
//     <Text style={styles.label}>Address</Text>
//     <View style={styles.valueView}>
//     <Text style={styles.value}>{ cd.address && cd.address}</Text>     
//     </View>
   
//     </View>

//     <View style={styles.labelView}>
//     <Text style={styles.label}>website</Text>
//     <View style={styles.valueView}>
//     <Text style={styles.value}>{  cd.address && cd.website}</Text>     
//     </View>
    
//     </View>
    
// </View>
// }