import * as React from 'react';
import { AppRegistry, View, Image, StyleSheet, TouchableHighlight, Text, ScrollView } from "react-native";
import t from 'tcomb-form-native'; // 0.6.9
import axios from "axios";
import { ThemeProvider, Button } from "react-native-elements";
import { Google, Constants } from 'expo';
import { cpus } from 'os';
import { createStackNavigator, createAppContainer, withNavigation } from 'react-navigation';
import AppContainer from '../App'
const {API_HOST} = Constants.manifest.extra;
 

const theme = {
  Button: {
    containerStyle: {
      marginTop: 10
    },
    raised: true,
    color: 'red',
    borderWidth: 3,
    borderRadius: 10
    // color: "#006edc",
  }
};

class DashboardView extends React.Component{
  constructor(props: object) {
    super(props);
    this.state = {
      groups: [],
      photoUrl: 'a',
      name: ''
    }
  }

  // componentDidUpdate = async () => {
  //   const CancelToken = axios.CancelToken;
  //   const source = CancelToken.source();
  //   let myGroups = await axios.get(`${API_HOST}/myGroups/${this.props.userData.id}`, {cancelToken: source.token});
  //   this.setState({ groups: myGroups.data });
  //   source.cancel('operationCanceled');
  // };

  componentDidMount = async () => {
    setInterval(this.getGroupsAsnyc, 5000);
  };
  
  getGroupsAsnyc = async () => {
    if (this.props.userData){
      this.setState({ photoUrl: this.props.userData.url_profile_pic, name: this.props.name })
      let myGroups = await axios.get(`${API_HOST}/myGroups/${this.props.userData.id}`);
      if(myGroups){
        this.setState({ groups: myGroups.data }) 
      }
    } else {
      let user = this.props.navigation.state.params.userData;
      this.setState({ photoUrl: user.url_profile_pic })
      let newGroups = await axios.get(`${API_HOST}/myGroups/${user.id}`);
      this.setState({ groups: newGroups.data }) 
    }
    
  }
  

  



  clearForm = () => {
    this.setState({value: null});
  }

  onPressCreateGroup = () => {
       // Do whatever you need here to switch to Creating a group View
      console.log('Create Group Button Pressed');
    this.props.navigation.navigate('CreatGroupView', {  
      userInfo: this.props.userData,
    });
  } 

  onPressJoinGroup = () => {
    // Do whatever you need here to switch to Joining a group View
    console.log('Join Group Button Pressed');
    this.props.navigation.navigate('JoinGroup', {
      userInfo: this.props.userData,
    });
  }

  onPressPanic = () => {
    // Do whatever you need here to switch to Joining a group View
    console.log('Panic Button Pressed');
    this.props.navigation.navigate('Panic', {
      hasAudioPermission: this.props.hasAudioPermission,
      hasCameraPermission: this.props.hasCameraPermission,
      userId: this.props.userData.id
    });
  }
 
  onPressViewGroup = (objects) => {
    // Do whatever you need here to switch to Joining a group View
    console.log(objects.nativeEvent.changedTouches);
    this.props.navigation.navigate('GroupView', {
      hasAudioPermission: this.props.hasAudioPermission,
      hasCameraPermission: this.props.hasCameraPermission,
      userInfo: this.props.userData,
    });
  }
  

  
  render() {
    // console.log(this.state.groups); 
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={scroll.contentContainer}>
          <Image
            style={{ borderRadius: 20, width: 155, height: 153, alignSelf: 'center' }}
            source={{
              uri: `${this.state.photoUrl}`
            }}
          />
          <Text style={{ alignSelf: 'center' }}
          >{this.state.name}</Text>
          <ThemeProvider theme={theme}>
            {
              this.state.groups.map((group) => <Button
                group={group.id}
                title={group.name}
                key={group.id}
                onPress={this.onPressViewGroup}
              />)
            }
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            <Button
              title="Create Group"
              onPress={this.onPressCreateGroup}
            /> 
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            <Button
              title="Join Group"
              onPress={this.onPressJoinGroup}
            />
          </ThemeProvider>
            <TouchableHighlight
              style={styles.button}
            onPress={this.onPressPanic}
              underlayColor="#99d9f4"
            >
              <Text style={styles.buttonText}>Panic</Text>
            </TouchableHighlight>
        </ScrollView>
      </View>  
    );
  }
}
const scroll = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20
  }
});

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: "center",
    width: 375,
    paddingTop: 30,
    padding: 30,
    borderRadius: 14,
    backgroundColor: "#0078ef"
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    alignSelf: "center"
  },
  button: {
    height: 50,
    backgroundColor: "#800000",
    borderColor: "#800000",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center"
  },
  image: {
    width: 80,
    height: 80,
    paddingTop: 80,
    justifyContent: "center"
  }
});

export default withNavigation(DashboardView);