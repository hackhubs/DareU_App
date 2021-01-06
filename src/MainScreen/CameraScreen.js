import React, { useState, useEffect, useRef,PureComponent } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
  ToastAndroid
} from "react-native";


import {Icon} from 'react-native-elements'
import CamTimer from "./CamTimer";
import MainContext from "../MainContext/MainContext";

import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import Video from 'react-native-video';


function CameraScreen() {
  const mainContext = React.useContext(MainContext);
  const [videoPath,setVideoPath] = useState('')

  const  camera = React.useRef()
  const [type,setType] = useState(RNCamera.Constants.Type.back)
  const [state,setState] = useState({
    recording:false,
    recorded:false,
    save:false
  })


  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      
      return true;
    }
    
    const status = await PermissionsAndroid.request(permission);
    if(status === 'granted'){
      setState({
        ...state,
        recording:false
      })
    
      return status === 'granted';
    }
    
  }

  const takeVideo = async () => {

    if (camera) {
      setState({
        ...state,
        recording:true
      })
        try {
          if (Platform.OS === "android" && !(await hasAndroidPermission())) {
            
            return;
            
          }
       
            const data = await camera.current.recordAsync();

            setVideoPath(data.uri)

            console.log(data)

            CameraRoll.save(data.uri);
            showToast()

        } catch (error) {
            console.log('err'+error);
        }

      }

  }

    //stop the recording by below method
    const stoprec = async () => {
     
         await camera.current.stopRecording();
    }

    const toggleRecord = () =>{
      if(state.recording){
        setState({
          ...state,
          recording:false
        })
        stoprec()
      }else{
        setState({
          ...state,
          recording:true
        })
        takeVideo()
      }

    }

    const showToast = () => {
      ToastAndroid.showWithGravityAndOffset(
        "Video Successfully Saved to Gallery",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    };
  
    return (
      <View style={styles.container}>

        {
          false?

            <Video 
            source={{uri:videoUri}}
            resizeMode="contain"
            repeat={true}
            
            style={styles.preview}
          />
    
          
          :
          <RNCamera
          ref={camera}
          style={styles.preview}
          type={type}
          flashMode={RNCamera.Constants.FlashMode.on}
     
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          // androidRecordAudioPermissionOptions={{
          //   title: 'Permission to use audio recording',
          //   message: 'We need your permission to use your audio',
          //   buttonPositive: 'Ok',
          //   buttonNegative: 'Cancel',
          // }}
       
        />
        }



            <CamTimer recording={state.recording}/>
            <View style={styles.btnView}>
           <View style={styles.inlineBtn}>
           <TouchableOpacity style={styles.icon}>
             <Icon type="material" name="file-upload" size={30} color="white" />
           </TouchableOpacity>

  

            <TouchableOpacity style={styles.icon}>
            <Icon type="material" name="mic-off" size={30} color="white" />
            </TouchableOpacity> 
            <View style={styles.record}>
              {state.recording ? (
                <>
                  <Text style={{ color: "white", fontSize: 20 }}>
                    Stop Recording
                  </Text>
                  <TouchableOpacity onPress={toggleRecord}>
                    <Icon type="material-community"
                      name="record-circle-outline"
                      size={60}
                      color="red"
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={{ color: "white", fontSize: 20 }}>
                    Start Recording
                  </Text>
                  <TouchableOpacity onPress={toggleRecord}>
                  <Icon type="material-community"
                      name="record-circle"
                      size={50}
                      color="white"
                    />
                  </TouchableOpacity>
                </>
              )
              
              }
            </View>

            <TouchableOpacity style={styles.icon}>
              <Icon type="ionicon" name="md-musical-note" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                setType(
                  type === RNCamera.Constants.Type.back
                    ? RNCamera.Constants.Type.front
                    : RNCamera.Constants.Type.back
                );
              }}
            >
              <Icon type="ionicon" name="camera-reverse" size={40} color="white" />
            </TouchableOpacity>

            </View>
          
          </View> 

            
         
      </View>
    );
  }

  



export default CameraScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  btnView: {

    flexDirection:'row',
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  inlineBtn:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

  },
  record: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

  },
  icon: {},
});


