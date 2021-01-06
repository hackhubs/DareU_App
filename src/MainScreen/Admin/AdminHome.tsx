import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from 'react-native-elements'

const AdminHome = ({navigation}) => {
    return (
        <View style={{flex:1,}}>
            <LinearGradient
            colors={['#FDC830','orange']}
            style={styles.gradientContainer}
            >
            <StatusBar backgroundColor="#8e2de2" />
            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Manage User")}>
                    <Icon name="users-cog" type="font-awesome-5" size={30}/>
                    <Text style={styles.btnText}>Manage User</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Block Challenge")}>
                    <Icon name="block" type="material" size={30}/>
                    <Text style={styles.btnText}>Block Challenge</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Company Details")}>
                <Icon name="office-building" type="material-community" size={30}/>
                    <Text style={styles.btnText}>Company Details</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Report")}>
                     <Icon name="exception1" type="antdesign" size={30}/>
                    <Text style={styles.btnText}>Report</Text>
                </TouchableOpacity>
            </View>
            </LinearGradient>
        </View>
    )
}

export default AdminHome

const styles = StyleSheet.create({
    gradientContainer:{
        flex:1,
        flexDirection:'column',
        padding:10
    },
    actionContainer:{
        
        alignItems:'center',
       
        padding:50
        
    },
    btn:{
        backgroundColor:'white',
        marginVertical:25,
        padding:10,
        width:280,
        borderRadius:25,
        elevation:5,
        alignItems:'center'
    },
    btnText:{
        fontSize:23,
        fontWeight:'bold',
        color:'black'
    }
})
