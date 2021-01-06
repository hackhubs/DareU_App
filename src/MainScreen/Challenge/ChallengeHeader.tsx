import React, { useState } from 'react'
import { StatusBar, StyleSheet, Text, TouchableOpacity, View,TextInput } from 'react-native'
import { Icon,SearchBar } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import { clearSearch, searchChallenge } from '../../actions/ChallengeActions'
const ChallengeHeader = (props) => {
    const [showSearch,setShowSearch] = useState(false)
    const [search,setSearch] = useState('')

    return (
        <View style={styles.header}>
            <StatusBar backgroundColor="#66a6ff"/>
          
            {
                !showSearch?
                
                    <View style={styles.titleView}>
                        <Text style={styles.title}>{props.title}</Text>
                    </View>
                
            
               
                :
                <View style={styles.searchBar}>
                   
                        <TouchableOpacity 
                        style={{position:'absolute',zIndex:5,top:12,left:15}}
                        onPress={() =>{setShowSearch(false)}}
                        >
                            <Icon name="arrow-back" type="ionicon" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={{position:'absolute',zIndex:5,top:12,right:15}}
                        onPress={() =>{
                            setSearch('')
                            props.clearFiltered()
                        }}
                        >
                            <Icon name="clear" type="material" />
                        </TouchableOpacity>
                        <TextInput
                        placeholder="Search Challenge"
                        style={{
                            backgroundColor:'white',
                            marginHorizontal:8,
                            marginVertical:5,
                            paddingLeft:38
                        }}
                        value={search}
                        onChangeText={txt => setSearch(txt)}
                        onSubmitEditing={() =>{props.setFiltered(search)}}
                        />
                     
                </View>
            }
            {
                !showSearch ?
                <View style={styles.action}>
              
                    <TouchableOpacity onPress={() => setShowSearch(true)}>
                    <Icon name="search" type="material" color="white"/>
                    </TouchableOpacity>
                
               
                    <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                        <Icon name="menu" type="material" color="white"/>
                    </TouchableOpacity>
                 </View>
                 :
                 null
            }
            
            
        </View>
    )
}


function mapStateToProps(state){
    return{
      
    }
  }
  
  function mapDispatchToProps(dispatch){
    return{
        setFiltered:(query) => dispatch(searchChallenge(query)),
        clearFiltered:() => dispatch(clearSearch()),
    }
  }
  
export default connect(mapStateToProps,mapDispatchToProps)(ChallengeHeader)

const styles = StyleSheet.create({
    header:{
        flexDirection:'row',
        alignItems:'center',
        height:50,
        backgroundColor:'#66a6ff'

    },
    title:{
        fontSize:19,
        color:'white',
        fontWeight:'bold',
        textAlign:'center'
    },
    titleView:{

       width:'75%'

    },
    searchBar:{
        width:'100%'
    },
    action:{
        width:'25%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
    }
})
