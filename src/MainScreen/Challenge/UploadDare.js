import React, {useContext, useState, useMemo, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker';
import {MediaUploader} from '../../../utils/MediaUploader';
import MainContext from '../../MainContext/MainContext';
import {ProgressBar, Colors, Button} from 'react-native-paper';
import RNVideoEditor from 'react-native-video-editor';
import {
  Asset,
  Constants,
  FileSystem,
  Permissions,
} from 'react-native-unimodules';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TextInput} from 'react-native-gesture-handler';
import {Picker} from '@react-native-community/picker';

const UploadDare = ({route, navigation}) => {
  const {docId} = route.params;
  console.log(docId);
  //Date
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  //Context

  const mainContext = useContext(MainContext);
  const {token, username, user_id} = mainContext;

  //Video States
  const [videoName, setVideoName] = useState('');
  const [selectedUri, setSelectedUri] = useState('');

  //Upload Field States

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [endDate, setEndDate] = useState('');

  //Upload Progress States

  const [showProgress, setShowProgress] = useState(false);
  const [total, setTotal] = useState();

  //Response State
  let videoArr = [];

  //FireStore
  const dareRef = firestore().collection('dares');
  const companyRef = firestore().collection('companydetails');

  //Company State
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('dsda');

  useEffect(() => {
    const subscriber = companyRef.onSnapshot((querySnapShot) => {
      let clist = [];
      querySnapShot.forEach((doc) => {
        clist.push(doc.data());
      });
      setCompanyList(clist);
    });

    return () => subscriber();
  }, []);

  const showToast = (res) => {
    ToastAndroid.showWithGravityAndOffset(
      res,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const uploadDoucment = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });

      console.log(res.uri);
      setVideoName(res.name);
      setSelectedUri(res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('canceled');
      } else {
        console.log(err);
      }
    }
  };

  const uploadVideoToYoutube = async () => {
    setShowProgress(true);
    const file = await fetch(selectedUri);
    const file_blob = await file.blob();
    console.log(file_blob);
    setShowProgress(true);

    try {
      var metadata = {
        snippet: {
          title: 'DareU' + title,
          description: 'Company Name -' + selectedCompany + '' + description,
          categoryId: 24,
        },
        status: {
          privacyStatus: 'public',
          embeddable: true,
          license: 'youtube',
        },
      };
      var uploader = new MediaUploader({
        baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
        file: file_blob,
        token: token,
        metadata: metadata,
        id: 0,
        params: {
          part: Object.keys(metadata).join(','),
        },

        onError: function (data) {
          console.log('error', data);
          showToast('Error Uploading Video');
          setShowProgress(false);
          // onError code
        }.bind(this),
        onProgress: function (data) {
          let average = parseInt(data.loaded) / parseInt(data.total);
          setTotal(average);
          console.log('Progress', data);
          // onProgress code
        }.bind(this),
        onComplete: function (data) {
          setShowProgress(false);
          showToast('Your Video Has Been Successfully Uploaded To Youtube');

          // onComplete code
          let responseJson = JSON.parse(data);
          uploadVideoIdToDB(
            responseJson.id,
            responseJson.etag,
            responseJson.snippet.title,
            responseJson.snippet.description,
          );
        }.bind(this),
      });
      uploader.upload();
    } catch (error) {
      console.log(error);
    }
  };

  //  const addNewParticipant = async (videoId,name) =>{
  //      try {

  //      } catch (error) {
  //         console.log(error)
  //      }
  // }

  const uploadVideoIdToDB = async (id, etag, title, desc) => {
    try {
      if (docId != 'new') {
        await dareRef.doc(docId).update({
          participants: firestore.FieldValue.arrayUnion({
            videoId: id,
            etag: etag,
            title: title,
            desc: desc,
            start_date: start_date,
            end_date: getFormattedDate(date),
            participant_name: username,
            participant_id: user_id,
            likes: [],
            isBlocked: false,
          }),
        });
      } else {
        await dareRef.add({
          videoId: id,
          etag: etag,
          title: title,
          desc: desc,
          start_date: start_date,
          end_date: getFormattedDate(date),
          created_by: user_id,
          likes: [],
          isBlocked: false,
        });
      }

      console.log('Added To DB');
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  var tdate = new Date('2010-10-11T00:00:00+05:30');
  let start_date =
    (tdate.getMonth() > 8
      ? tdate.getMonth() + 1
      : '0' + (tdate.getMonth() + 1)) +
    '/' +
    (tdate.getDate() > 9 ? tdate.getDate() : '0' + tdate.getDate()) +
    '/' +
    tdate.getFullYear();

  const getFormattedDate = (dat) => {
    return (
      (dat.getMonth() > 8 ? dat.getMonth() + 1 : '0' + (dat.getMonth() + 1)) +
      '/' +
      (dat.getDate() > 9 ? dat.getDate() : '0' + dat.getDate()) +
      '/' +
      dat.getFullYear()
    );
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  console.log(getFormattedDate(date));
  return (
    <ScrollView>
      <View style={styles.container}>
        <LinearGradient
          colors={['#6E45E1', '#66a6ff']}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
        {showProgress ? (
          <View style={{marginBottom: 20}}>
            <ActivityIndicator size="large" color="#00ff00" animating={true} />
            <Text style={styles.labelStyle}>
              Please wait your video is being uploaded
            </Text>
            <ProgressBar progress={total} color={Colors.greenA400} />
          </View>
        ) : null}

        <View style={styles.uploadView}>
          <TouchableOpacity
            style={[styles.upload, {marginRight: 10}]}
            onPress={() => navigation.navigate('Camera')}>
            <Icon
              type="material-community"
              name="video"
              size={44}
              color="white"
            />
            <Text style={{color: 'white'}}>Record Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.upload}
            onPress={() => uploadDoucment()}>
            <Icon type="material" name="file-upload" size={44} color="white" />
            <Text style={{color: 'white'}}>Select Video</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginBottom: 20, marginTop: 10}}>
            <Text style={[styles.labelStyle, {paddingLeft: 10}]}>
              Selected File :
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
                marginTop: 10,
              }}>
              {videoName ? videoName : 'No File Selected'}
            </Text>
          </View>
          <Input
            label="Title"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            value={title}
            onChangeText={(txt) => setTitle(txt)}
          />

          <Input
            label="Tags"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            value={tag}
            onChangeText={(txt) => setTag(txt)}
          />
          <View>
            <Input
              label="End Date"
              labelStyle={styles.labelStyle}
              inputStyle={styles.inputStyle}
              value={getFormattedDate(date)}
            />
            <TouchableOpacity
              style={{position: 'absolute', bottom: 40, right: 30, zIndex: 10}}
              onPress={showDatepicker}>
              <Icon type="font-awesome-5" name="calendar-alt" size={30} />
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
                minimumDate={new Date()}
              />
            )}
          </View>
          <View>
            <Text style={styles.labelStyle}>Company Name</Text>
            <View style={{marginVertical: 10}}>
              <Picker
                mode="dropdown"
                selectedValue={selectedCompany}
                style={{height: 45, fontSize: 22, color: 'white'}}
                itemStyle={{
                  color: 'white',
                  fontSize: 20,
                }}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedCompany(itemValue)
                }>
                {companyList.map((c, id) => {
                  return (
                    <Picker.Item
                      label={c.company_name}
                      value={c.company_name}
                      key={id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <Input
            label="Description"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            value={description}
            numberOfLines={2}
            onChangeText={(txt) => setDescription(txt)}
          />
        </View>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => {
            if (title && description && tag && videoName) {
              uploadVideoToYoutube();
            } else {
              showToast('Please Fill All the Fields then press upload');
            }
          }}>
          <Text style={{color: 'black', fontSize: 20}}>Upload</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UploadDare;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    padding: 20,
  },
  uploadView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upload: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f64f59',
    width: 100,
    height: 100,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {height: 0, width: 1},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  labelStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputStyle: {
    borderBottomWidth: 2,
    borderColor: 'white',
    color: 'white',
  },
  uploadBtn: {
    backgroundColor: '#40E0D0',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {height: 0, width: 1},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
});
