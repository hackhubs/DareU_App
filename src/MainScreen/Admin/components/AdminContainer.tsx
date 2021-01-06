import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
const AdminContainer = (props) => {
    return (

            <LinearGradient
            colors={['#FDC830','orange']}
            style={styles.gradientContainer}
            >

                {props.children}
                
            </LinearGradient>

    )
}

export default AdminContainer

const styles = StyleSheet.create({
    gradientContainer:{
        flex:1,
        flexDirection:'column',
        
    },
})
