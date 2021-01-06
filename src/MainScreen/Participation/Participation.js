import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,Dimensions,Share
} from "react-native";
import { WebView } from "react-native-webview";
import {Icon} from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { API_KEY } from "../../constants";
import MainContext from "../../MainContext/MainContext";
import Leaderboard from './Leaderboard'
import moment from 'moment'

function ParticipationItem({ item,likeChallenge,user_id,onShare }) {
  let likes = item.likes ? item.likes.length : ''
  let isUserLiked = item.likes ? item.likes.includes(user_id) : false
  let curData = item.start_date ? (item.start_date.split('/')).join("") :'09102020'
  return (
    <View style={styles.participationItem}>
    
       <View style={{width:'50%',height:'100%'}}> 
       <WebView
        style={{
          width: 186,
         
        }}
        javaScriptEnabled={true}
        source={{ uri: "https://www.youtube.com/embed/" + item.videoId}}
      />
      
       
        <View style={{padding:2,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
      
        <TouchableOpacity  delayPressIn={1} style={styles.share} onPress={() => {
              let mes = `New Dare !| Click to Watch https://www.youtube.com/watch?v=${item.videoId}`
              onShare(mes)
              }}>
                <Icon type="entypo" name="share" size={28} color="black" />
                </TouchableOpacity>
                
                <TouchableOpacity  
                style={{flexDirection:'row',alignItems:'center'}} 
                onPress={() => likeChallenge(item.videoId)}>
                  <Text style={{fontSize:18,paddingRight:10}}>{likes ? likes : '0'}</Text>
                {
                  isUserLiked?
                  <Icon type="antdesign" name="heart" size={28} color="red" />:
                  <Icon type="antdesign" name="heart" size={28} color="#cecece" />
                }
                </TouchableOpacity>


  

        </View>
       </View>
       <View style={{width:'100%',paddingLeft:10}}>
            <Text style={styles.challText}>{item.title}</Text>
              <Text>{moment(curData, "MMDDYYYY").fromNow()}</Text>
       </View>
        
    
    </View>
  );
}

const Participation = ({ navigation,route }) => {
  const {challengeID} = route.params;
  const mainContext = useContext(MainContext)
  const {token,user_id} = mainContext
  const [vlist, setVlist] = useState([]);
  const [docId,setDocId] = useState('')
  const ref = firestore().collection('dares')
  const [participantList,setParticipantList] = useState([])


  const onShare = async (message) => {
    try {
      const result = await Share.share({
        message:
          message,
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
  useEffect(() => {

    const subscriber = ref.onSnapshot(querySnapShot =>{
        let dlist = [];
        querySnapShot.forEach(doc =>{
          const {videoId,participants} = doc.data()   //Getting Particpants By the VideoID
          
          if(challengeID === videoId){
            setDocId(doc.id)
            //console.log("p",participants)
         
            if(participants)   //Checking if particiapants exists
            {
              dlist= participants;
              setParticipantList(participants)
            }  
          }
        })
        dlist = dlist.sort(function(a,b) {return  new Date(b.start_date) - new Date(a.start_date)})
         setVlist(dlist)
    })
    
   


   return() => subscriber()
    
   
  
  
  },[]);

  const likeChallenge = async (vidId) =>{
    try {
      ref.doc(docId).get()
    .then(async (querySnap) =>{
        const { participants } = querySnap.data()
        if(participants){
            let temp_participants = participants.map(participant =>{
              if(participant.likes){
                 if(participant.videoId === vidId){
                  if(participant.likes.includes(user_id)){
                    participant.likes = participant.likes.filter(l => l != user_id)
                  }else{
                    participant.likes = [...participant.likes,user_id]
                 
                  }
                  
                  return participant
                 }else{
                   return participant
                 }
              }else{
                participant.likes = [user_id]
                return participant
              }
            })
            
           
            await ref.doc(docId).update({
            "participants":temp_participants
            })
        }
    })
    } catch (error) {
      console.log(error)
    }
  }

 
  return (
    <View style={styles.container}>
     <View style={{flex:1,marginBottom:15}}>
      <Leaderboard plist={participantList}/>
      </View> 
    
    <View style={{flex:3}}>
     {
       vlist.length > 0?
       <FlatList
       data={vlist}
       renderItem={({ item }) => 
       <ParticipationItem item={item}  
       likeChallenge={likeChallenge} 
       user_id={user_id}
       onShare={onShare}
       />}
       keyExtractor={(item) => item.videoId}
      
     />
     :
     <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
     <Text style={{color:'black',fontSize:19,fontWeight:'bold'}}>No Participated videos yet</Text>
     </View>
     }
     </View>

    <View style={styles.createView}>
      <TouchableOpacity
         
         onPress={() => navigation.navigate("Upload Video",{docId:docId})}
         delayPressIn={1}
       >
            <LinearGradient 
            colors={["#6E45E1", "#66a6ff"]} 
         
            style={styles.createDare}
            >
                <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Accept Challenge</Text>
            </LinearGradient>
                
          
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Participation;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    backgroundColor:'white'
  },
  challHead: {
    marginVertical: 20,
  },
  challText: {
    fontSize:18,
    
  },
  participationItem: {
    flex: 1,
    flexDirection: "row",
    marginVertical:5,
    marginHorizontal: 5,
    height: 180,
    backgroundColor: "#fff",
    elevation:5,
    borderRadius:4,
  },
  share: {
    paddingRight:5
  },
  accept: {
    backgroundColor:'white',
    padding:5
  },
  createView: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  createDare: {
    justifyContent: "flex-end",
    alignItems: "center",

    backgroundColor: "#1cefff",
    width: 200,
    padding: 10,
    borderRadius: 20,
  },
});
