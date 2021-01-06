import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,ActivityIndicator,Image,StatusBar } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = (props) => {
    const [animating,setAnimating] = useState(true)
    return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#6E45E1" />
          <LinearGradient
        colors={["#6E45E1", "#66a6ff"]}
        
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
      <Image
        source={require('../assets/splash.png')}
        style={{ width: '100%', resizeMode: 'contain', margin: 30 }}
      />
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#307ecc',
      },
      activityIndicator: {
        alignItems: 'center',
        height: 80,
      },
})
