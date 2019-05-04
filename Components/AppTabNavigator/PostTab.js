import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import {Icon, Picker} from 'native-base'
import {ImagePicker} from 'react-native-image-picker'
class PostTab extends Component{
    
    constructor(props){
        super(props)
        this.state={
            imageId: this.uniqueId()
        }

    }

   
    
    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + 
        this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-'
    }

    handleChoosePhoto = () => {
        const options = {};
        ImagePicker.launchImageLibrary(options, response => {
            console.log("response", response)
        })
    }

    static navigationOptions = {
        tabBarIcon: ({tintColor}) => (
            <Icon name = "md-add" style={{color:
            tintColor}}/>
        ) 
    }
    navi = () => {
        


        this.props.navigation.navigate('userProfile')
        
            //promise rejected
            console.log('ff')
        
    }

    render(){
        return(
            <View style = {styles.container}>
                <Button title='Pick' raised onPress={this.navi}></Button>
            </View>
        );
    }
}

export default PostTab;


const styles = StyleSheet.create({
    container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
    }
});