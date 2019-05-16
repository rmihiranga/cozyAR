import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList, StatusBar, TouchableOpacity} from "react-native";
import {Icon, Container, Content, Card, CardItem, Thumbnail, Body, Left, Right, Button} from 'native-base'
import Video from 'react-native-video';
import firebase from 'react-native-firebase'
import blu from '../../assets/VID-20190303-WA0029.mp4'

class HomeTab extends Component{

    constructor(props){
        super(props);
        this.state = {
            photo_feed: [],
            refresh: false,
            loading: true,
            liked: false
        }
    }

    componentDidMount = () => {
        this.loadFeed();
    }

    pluralCheck = (s) => {
        if (s == 1){
            return ' ago'
        }else {
            return 's ago'
        }
    }

    timeConverter = (timestamp) => {
        var a = new Date(timestamp * 1000)
        var seconds = Math.floor((new Date() - a) / 1000)
        var interval = Math.floor(seconds/31536000)
        if(interval > 1){
            return interval + ' year' +this.pluralCheck(interval)
        }
        interval = Math.floor(seconds / 2592000);
        if(interval > 1){
            return interval + ' month' +this.pluralCheck(interval)
        }
        interval = Math.floor(seconds / 86400);
        if(interval > 1){
            return interval + ' day' +this.pluralCheck(interval)
        }
        interval = Math.floor(seconds / 3600);
        if(interval > 1){
            return interval + ' hour' +this.pluralCheck(interval)
        }
        interval = Math.ceil(seconds / 60);
        if(interval > 1){
            return interval + ' minute' +this.pluralCheck(interval)
        } return Math.floor(seconds) + 'second' +this.pluralCheck(interval)
    }

    addToFlatlist = (photo_feed, data, photo) => {
        var that = this
        var photoObj = data[photo];
                    firebase.database().ref('users').child(photoObj.author).once('value').then(function(snapshot){
                        const exists = (snapshot.val() !== null)
                        if(exists) data = snapshot.val();
                        photo_feed.push({
                            id: photo,
                            url: photoObj.url,
                            caption: photoObj.caption,
                            posted: that.timeConverter(photoObj.posted),
                            author: data.name,
                            avatar: data.avatar,
                            likes:photoObj.likes,
                            authorId:photoObj.author,
                            flag:photoObj.flag
                            
                        });
                        that.setState({
                            refresh: false,
                            loading: false
                        })
                    }).catch(error => console.log(error));
    }
  
    loadFeed = () => {
        this.setState({
            refresh:true,
            photo_feed: []
        })
        var that = this;
    
        firebase.database().ref('photos').orderByChild('posted').once('value').then(function(snapshot){
            const exists = (snapshot.val() !== null)
            
            if(exists) data = snapshot.val();
                var photo_feed = that.state.photo_feed;
                console.log(data)
                for(var photo in data){
                    that.addToFlatlist(photo_feed, data, photo)
                }
        }).catch(error => console.log(error));
    }

    loadNew = () => {
        this. loadFeed()
    }

    likeButton = () => {
        if (this.state.liked){
            this.setState({
                liked: false
            })
        }else{
            this.setState({
                liked: true
            })
        }
    }
    // need to  add a condition to check whether a video or image. When upload a flag object when uploading a video so we can check that here
    render(){
        return(
            <FlatList
                refreshing ={this.state.refresh}
                onRefresh = {this.loadNew}
                data ={this.state.photo_feed}
                keyExtractor={(item, index)=>index.toString}
                style = {{flex:1,backgroundColor:'#ffffff'}}
                renderItem = {({item, index}) => (
                    <View key ={index}>
                        <Card transparent>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={{uri:item.avatar}} style={{height:35,width:35}}/>
                                    <Body>
                                        <TouchableOpacity onPress = {() => this.props.navigation.navigate('UserView', {userId: item.authorId})}>
                                            <Text style = {{fontWeight:"normal"}}>
                                                {item.author}
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={{fontSize:11}}>{item.posted}</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            
                            {item.flag == false ? (
                            
                                
                                    <Image source={{uri:item.url}} style={
                                    {height:350, width:null, flex:1}}/>
                       
                                ) : (
                              
                                    <View style={{flex:1}}>
                                        <Video
                                            source={blu}
                                            resizeMode="cover"
                                            repeat={true}
                                        />
                                    </View>
                                    
                                )}
                                
                            <CardItem style={{height: 45}}>
                                <Left>
                                    <Button transparent onPress={this.likeButton}>
                                        <Icon type = 'SimpleLineIcons' name="heart"
                                            style={
                                                this.state.liked
                                                ? styles.likedTrue
                                                : styles.likedFalse
                                                }/>
                                    </Button>
                                    <Button transparent onPress = {()=> this.props.navigation.navigate('Comments',{photoId:item.id})}>
                                        <Icon type = 'SimpleLineIcons' name="bubble"
                                            style={{color: 'black', fontSize: 32}}/>
                                        </Button>
                                </Left>
                            </CardItem>
                            <CardItem style={{height:20}}>
                                <Text>
                                    {item.likes} likes
                                </Text>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text>
                                        <Text style = {{fontWeight:"900"}}>{item.author} </Text>
                                        {item.caption}
                                    </Text>
                                </Body>
                            </CardItem>
                        </Card>
                    </View> 
                )}
            >
            </FlatList>
        )    
    }
}

export default HomeTab;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    likedTrue:{
        color: 'red',
          fontSize: 32
    },
    likedFalse: {
        color: 'black',
        fontSize: 32
    }
});