import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AdminContainer from './MainScreen/Admin/components/AdminContainer'

const BlockedUser = () => {
    return (
        <AdminContainer>
        <View style={styles.container}>
            <Text style={{fontSize:25,fontWeight:'bold',color:'#fff'}}>
                Sorry ! Your account has been blocked by the admin.</Text>
            
                <Text style={{fontSize:18,fontWeight:'bold',color:'black',marginTop:20}}>
                Please try again with a different account.
                </Text>
        </View>
        </AdminContainer>
    )
}

export default BlockedUser

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:15,
    }
})
