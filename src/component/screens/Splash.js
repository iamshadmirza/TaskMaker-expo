import React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import firebase from 'firebase';
import colors from 'res/colors';
import { Feather } from '@expo/vector-icons';

class Splash extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
        }
    }

    componentWillMount() {
        //this.logOut();
    }

    async logOut() {
        firebase.auth().signOut();
        await AsyncStorage.removeItem('userToken');
    }

    async componentDidMount() {
        let userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
            setTimeout(() => {
                this.props.navigation.navigate('Home');
            }, 1000);
        } else {
            setTimeout(() => {
                this.props.navigation.navigate('Auth');
            }, 1000);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Feather name='check-circle' size={60} color={colors.red} />
                <Text style={styles.text}>Task Maker</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundColor
    },
    text: {
        fontSize: 20,
        fontWeight: '500',
        color: colors.red,
        paddingVertical: 15,
    }
});

export default Splash;