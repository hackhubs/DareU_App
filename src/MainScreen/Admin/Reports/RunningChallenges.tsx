import React from 'react'
import { StyleSheet, Text, View,FlatList } from 'react-native'
import { connect } from 'react-redux'
import AdminContainer from '../components/AdminContainer'
import { Icon } from 'react-native-elements'
import { reportStyles } from './reportStyles'


const ReportItem = ({item}) => {
    
    return (
        <View style={reportStyles.card}>
            <View style={{flex:1,marginBottom:10}}>
            <Text style={reportStyles.title}>{item.title}</Text>
            </View>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                <Icon name='calendar-times-o' type='font-awesome' size={25} style={{marginBottom:10}}/>
                <Text style={reportStyles.contentText}>{item.end_date}</Text>
                </View>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                <Icon name='users' type='font-awesome' size={25} style={{marginBottom:10}}/>
                 <Text style={reportStyles.contentText}>{item.participants ? item.participants.length :'0' }</Text>
                </View>
                
            </View>
      
        </View>
    )
}

const RunningChallenges = (props) => {
    return (
        <AdminContainer>
            {
                props.runningList.length > 0 &&
                <FlatList 
                    data={props.runningList}
                    keyExtractor={item => item.videoId}
                    renderItem={({item}) => <ReportItem item={item}/>}
                    />
            }
        </AdminContainer>
    )
}

function mapStateToProps(state){
    return{
        runningList:state.reportState.rlist
    }
}


export default connect(mapStateToProps,null)(RunningChallenges)

const styles = StyleSheet.create({})
