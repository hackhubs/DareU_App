import React, {useContext, useState} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {Drawer, Text} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Avatar} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';
import MainContext from '../MainContext/MainContext';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
export default function DrawerContent(props) {
  const mainContext = useContext(MainContext);
  const {username, email, pic_url} = mainContext;
  const [active, setActive] = useState('1');
  const [loggedIn, setloggedIn] = useState(false);
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => alert('Your are signed out!'));
      setloggedIn(false);
      // setuserInfo([]);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('User Profile');
                setActive('2');
              }}>
              <Avatar.Image
                source={{uri: pic_url}}
                size={80}
                style={{backgroundColor: '#cecece'}}
              />
            </TouchableOpacity>
            <Text style={{paddingTop: 9, fontSize: 19}}>{username}</Text>
            <Text style={{paddingTop: 1, fontSize: 16}}>{email}</Text>
          </View>
          <View>
            <Drawer.Section>
              <Drawer.Item
                active={active == '1'}
                icon={() => (
                  <Icon
                    type="material-community"
                    name="home"
                    size={35}
                    color="#8e2de2"
                  />
                )}
                label="Home"
                onPress={() => {
                  props.navigation.navigate('Challenge History');
                  setActive('1');
                }}
              />

              <Drawer.Item
                active={active == '2'}
                icon={() => (
                  <Icon
                    type="entypo"
                    name="user"
                    size={30}
                    color="#8e2de2"
                    style={{paddingLeft: 8, paddingRight: 10}}
                  />
                )}
                label="Profile"
                onPress={() => {
                  props.navigation.navigate('User Profile');
                  setActive('2');
                }}
              />
              <Drawer.Item
                active={active == '3'}
                icon={() => (
                  <Icon
                    type="font-awesome-5"
                    name="user-cog"
                    size={30}
                    color="#8e2de2"
                    style={{paddingLeft: 5, paddingRight: 8}}
                  />
                )}
                label="Admin Dare"
                onPress={() => {
                  props.navigation.navigate('Admin Dare');
                  setActive('3');
                }}
              />
            </Drawer.Section>
          </View>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={() => (
            <Icon
              type="material-community"
              name="exit-to-app"
              color="red"
              size={28}
            />
          )}
          label="Exit App"
          onPress={() => BackHandler.exitApp()}
        />
        <DrawerItem
          icon={() => (
            <Icon
              type="material-community"
              name="exit-to-app"
              color="red"
              size={28}
            />
          )}
          label="Sign Out"
          onPress={signOut}
        />
      </Drawer.Section>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 150,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cecece',
    marginBottom: 10,
  },
  headerText: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#fafafa',
  },
  drawerItem: {
    color: 'black',
    fontSize: 20,
  },

  bottomDrawerSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgb(226, 226, 226)',
  },
});
