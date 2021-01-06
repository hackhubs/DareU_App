import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';

import {GoogleSocialButton} from 'react-native-social-buttons';
import LinearGradient from 'react-native-linear-gradient';
import {_getData, _saveData, _clearData} from '../SavetoLocal';
import auth from '@react-native-firebase/auth';
import MainContext from '../MainContext/MainContext';
import firestore from '@react-native-firebase/firestore';

const Signin = (props) => {
  const mainContext = useContext(MainContext);
  const {setUserDetails, setUserBlocked} = mainContext;
  const userRef = firestore().collection('users');

  const getUserData = async () => {
    try {
      let value = await _getData('userDetails');

      if (value != null) {
        autoGoogleSignIn();
      }
    } catch (error) {
      console.log('getUserdata Error');
    }
  };

  React.useEffect(() => {
    try {
      GoogleSignin.configure({
        scopes: [
          // 'https://www.googleapis.com/auth/drive.readonly',
          'https://www.googleapis.com/auth/youtube',
          'https://www.googleapis.com/auth/youtube.upload',
          'https://www.googleapis.com/auth/plus.login',
        ],
        webClientId:
          '574168900168-jsada9pdbpf3bqdkr6mrv34na54bjn72.apps.googleusercontent.com',
        forceConsentPrompt: true,
        // if you want to show the authorization prompt at each login
        //ZjvNbJapxZyvNMCIVvs9EUIF
      });

      getUserData();
    } catch (error) {
      console.log('useEffect Sigin error', error);
    }
  }, []);

  const googleSignInHandler = async () => {
    GoogleSignin.hasPlayServices()
      .then((res) => {
        GoogleSignin.signIn()
          .then(async (res) => {
            const sign = await GoogleSignin.getTokens();

            //Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(
              sign['idToken'],
            );

            //Sign-in the user with the credential
            const result = await auth().signInWithCredential(googleCredential);

            console.log(result);
            const {user} = result;
            let userState = {
              username: user.displayName,
              email: user.email,
              pic_url: user.photoURL,
              accessToken: sign['accessToken'],
              user_id: user.uid,
            };
            setUserDetails(userState);
            _saveData('userDetails', JSON.stringify(userState));

            console.log(userState);
            try {
              const isBlocked = (await userRef.doc(user.uid).get()).data()
                .isBlocked;
              if (isBlocked) {
                setUserBlocked();
                _clearData();
                props.navigation.navigate('BlockedScreen');
              } else {
                props.navigation.navigate('HomeScreen');
              }
            } catch (error) {
              userRef.doc(user.uid).set({
                user_id: user.uid,
                isBlocked: false,
                username: user.displayName,
                email: user.email,
                pic_url: user.photoURL,
              });
              console.log('login');
              props.navigation.navigate('HomeScreen');
            }
          })
          .catch((error) => {
            console.log('Error COde', error.code);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const autoGoogleSignIn = async () => {
    GoogleSignin.hasPlayServices().then((resp) => {
      GoogleSignin.signIn()
        .then(async (res) => {
          const sign = await GoogleSignin.getTokens();

          // Create a Google credential with the token
          const googleCredential = auth.GoogleAuthProvider.credential(
            sign['idToken'],
          );

          // Sign-in the user with the credential
          const result = await auth().signInWithCredential(googleCredential);

          const {user} = result;
          let userState = {
            username: user.displayName,
            email: user.email,
            pic_url: user.photoURL,
            accessToken: sign['accessToken'],
            user_id: user.uid,
          };
          setUserDetails(userState);
          console.log('autologin');

          const isBlocked = (await userRef.doc(user.uid).get()).data()
            .isBlocked;
          console.log(isBlocked);
          if (isBlocked) {
            setUserBlocked();
            _clearData();
            props.navigation.navigate('BlockedScreen');
          } else {
            props.navigation.navigate('HomeScreen');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6E45E1" />
      <LinearGradient
        // Background Linear Gradient

        colors={['#6E45E1', '#66a6ff']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: Dimensions.get('screen').height,
        }}
      />
      <View style={styles.headerLogo}>
        <View style={styles.logo}>
          <Image
            source={require('../../assets/splash.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.btnView}>
          {/* <GoogleSigninButton
                    style={{ width: 48, height: 48 }}
                    size={GoogleSigninButton.Size.Icon}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={googleSignInHandler}
                    
                /> */}
          <GoogleSocialButton
            buttonViewStyle={styles.btnStyle}
            logoStyle={styles.logoStyle}
            textStyle={styles.signinTxt}
            onPress={googleSignInHandler}
          />
        </View>
      </View>
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerLogo: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    marginVertical: 28,
    width: Dimensions.get('screen').width - 150,
    height: 230,
  },
  btnView: {
    marginVertical: 30,
  },
  btnStyle: {
    height: 50,
    width: 270,
    shadowColor: '#000',
    shadowOffset: {height: 0, width: 1},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  signinTxt: {
    fontSize: 20,
    color: 'black',
  },
  logoStyle: {
    height: 30,
    width: 30,
  },
  footer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 25,
  },
  emailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    fontSize: 18,
    paddingLeft: 8,
    color: 'gray',
  },
  registerView: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  registerText1: {
    color: 'gray',
  },
  registerInlineText: {
    color: '#4286f4',
  },
});
