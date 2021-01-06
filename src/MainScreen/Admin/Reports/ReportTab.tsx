import React,{useState,useEffect} from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import CompletedChallenges from './CompletedChallenges';
import RunningChallenges from './RunningChallenges';
import { connect } from 'react-redux';
import { setReports } from '../../../actions/ReportActions';


const ReportTab = createMaterialTopTabNavigator()

const ReportTabScreen = (props) =>{
    const dareRef = firestore().collection('dares');
   
    useEffect(() =>{
         
        const unsubscribeListener = dareRef.onSnapshot(querySnapshot => {
            let dlist=[]
            let clist = []
           
            querySnapshot.forEach(doc => {

                let end = (new Date(doc.data().end_date)).getTime()
                let current = (new Date()).getTime()
              
                console.log(end<current)
                if(current >end){
                        clist.push(doc.data())
                }else{
                        dlist.push(doc.data())
                }
                
               
                
            
            

            });
             console.log(clist)
             props.setReportsData(clist,dlist)
               

              
                
            
            
            
          });

           
          return () => unsubscribeListener()
    },[])
    return(
        <ReportTab.Navigator
        lazy={true}

        >
            <ReportTab.Screen name="Running Challenges" component={RunningChallenges} />
            <ReportTab.Screen name="Completed Challeneges" component={CompletedChallenges} />
            
        </ReportTab.Navigator>
    )
}

function mapDispatchToProps(dispatch){
    return{
        setReportsData:(clist,rlist) => dispatch(setReports(clist,rlist))
    }
}

export default connect(null,mapDispatchToProps)(ReportTabScreen)