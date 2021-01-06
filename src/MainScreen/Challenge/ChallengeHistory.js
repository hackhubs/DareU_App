import React, {useEffect, useRef, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Share,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import MainContext from '../../MainContext/MainContext';
import ChallengeHeader from './ChallengeHeader';
import {setChallenge} from '../../actions/ChallengeActions';
import {connect} from 'react-redux';
//import Share from "react-native-share";

function ChallengeItem({item, navigation, onShare, likeChallenge, user_id}) {
  let likes = item.likes ? item.likes.length : '';
  let isUserLiked = item.likes ? item.likes.includes(user_id) : false;
  let curData = item.start_date
    ? item.start_date.split('/').join('')
    : '09102020';

  return (
    <View style={styles.challengeItem}>
      <View style={{width: '100%', height: 315}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={styles.challText}>{item.title}</Text>
          <TouchableOpacity
            delayPressIn={0.5}
            onPress={() => navigation.navigate('Edit', {docId: ' '})}>
            <Icon
              type="entypo"
              name="dots-three-vertical"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <WebView
          javaScriptEnabled={true}
          source={{uri: 'https://www.youtube.com/embed/' + item.videoId}}
        />

        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomLeftRadius: 20,
          }}>
          <View style={{flexDirection: 'row', marginBottom: -15}}>
            <View>
              <TouchableOpacity
                delayPressIn={1}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => likeChallenge(item.videoId)}>
                {isUserLiked ? (
                  <Icon type="antdesign" name="heart" size={28} color="red" />
                ) : (
                  <Icon
                    type="antdesign"
                    name="heart"
                    size={28}
                    color="#cecece"
                  />
                )}
                <Text style={{fontSize: 18, paddingLeft: 5}}>
                  {likes ? likes : '0'}
                </Text>
              </TouchableOpacity>
              <Text>{moment(curData, 'MMDDYYYY').fromNow()}</Text>
            </View>
            <View style={{marginLeft: 155}}>
              <TouchableOpacity
                delayPressIn={1}
                style={styles.share}
                onPress={() => {
                  let mes = `New Dare ! ${item.title} | Click to Watch https://www.youtube.com/watch?v=${item.videoId}`;
                  onShare(mes);
                }}>
                <View style={{flexDirection: 'row', marginLeft: 60}}>
                  <Icon type="entypo" name="share" size={30} color="black" />
                  <Icon
                    type="entypo"
                    name="facebook-with-circle"
                    size={30}
                    color="#4267B2"
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.accept}
                delayPressIn={0.5}
                onPress={() =>
                  navigation.navigate('Accept Challenge', {
                    challengeID: item.videoId,
                  })
                }>
                <Text style={{color: 'white'}}>Dare to Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const ChallengeHistory = ({
  navigation,
  screenProps,
  challenges,
  filtered,
  setChallengeData,
}) => {
  const mainContext = useContext(MainContext);
  const {token, user_id} = mainContext;
  const ref = firestore().collection('dares');
  console.log(filtered.length === 0);

  //Share Function Call
  const onShare = async (message) => {
    try {
      const result = await Share.share({
        message: message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //Like the challenege
  const likeChallenge = async (vidId) => {
    try {
      ref.get().then(async (querySnap) => {
        let current_id = '';
        let dareLikes = [];
        querySnap.forEach((doc) => {
          const {videoId, likes} = doc.data();
          if (videoId === vidId) {
            current_id = doc.id;
            if (likes) {
              if (likes.includes(user_id)) {
                dareLikes = likes.filter((l) => l != user_id);
              } else {
                dareLikes = likes;
                dareLikes.push(user_id);
              }
            } else {
              dareLikes = [user_id];
            }
          }
        });

        await ref.doc(current_id).update({
          likes: dareLikes,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Get Videos List from Firebase
  useEffect(() => {
    const unsubricbeListener = ref.onSnapshot((querySnapshot) => {
      let list = [];
      querySnapshot.forEach((doc) => {
        const {isBlocked} = doc.data();
        if (isBlocked === false) {
          list.push(doc.data());
        }
      });
      list = list.sort(function (a, b) {
        return new Date(b.start_date) - new Date(a.start_date);
      });
      setChallengeData(list);
    }, []);

    return () => unsubricbeListener();
  }, []);

  return (
    <>
      <ChallengeHeader navigation={navigation} title="Challenge History" />
      <View style={styles.container}>
        <FlatList
          data={filtered != '' ? filtered : challenges}
          renderItem={({item}) => (
            <ChallengeItem
              item={item}
              navigation={navigation}
              onShare={onShare}
              likeChallenge={likeChallenge}
              user_id={user_id}
            />
          )}
          keyExtractor={(item) => item.videoId}
        />

        <View style={styles.createView}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Upload Video', {docId: 'new'})}
            delayPressIn={1}>
            <LinearGradient
              colors={['#6E45E1', '#66a6ff']}
              style={styles.createDare}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
                Do Or Dare
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

function mapStateToProps(state) {
  return {
    challenges: state.challengeState.challenges,
    filtered: state.challengeState.filtered,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setChallengeData: (data) => dispatch(setChallenge(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeHistory);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 10,
  },
  challHead: {},
  challText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 8,
  },

  challengeItem: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 5,
    height: 340,
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 5,
  },
  share: {
    paddingRight: 5,
  },
  accept: {
    backgroundColor: '#66a6ff',
    padding: 6,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  createView: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createDare: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1cefff',
    width: 200,
    padding: 10,
    borderRadius: 20,
  },
});
