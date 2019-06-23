import React from 'react';
import {
    StyleSheet,
    View, TouchableOpacity, TouchableWithoutFeedback,
    StatusBar, SafeAreaView,
    Text, TextInput,
    Keyboard, KeyboardAvoidingView,
    Platform, ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import db from '../../networking/db';
import colors from 'res/colors.json';
import Feather from 'react-native-vector-icons/Feather';
import { Card, Button } from '../common';

class LoginScreen extends React.Component {
    state = {
        login: true,
        name: '',
        email: '',
        password: '',
        loading: false,
    }

    async onLoginPress() {
        const { email, password } = this.state;
        if (email === '' || password === '') { return; }
        this.setState({ loading: true });
        let token = await db.loginUser(email, password);
        if (token === 'bad request') {
            if (Platform.OS == 'android') {
                ToastAndroid.show('Bad request, check email and password again')
            }
        }
        await AsyncStorage.setItem('userToken', token);
        this.setState({ loading: false });
        this.props.navigation.navigate('Home');
    }

    switchForm() {
        this.setState({ login: !this.state.login });
    }

    async onSignUpPress() {
        const { name, email, password } = this.state;
        if (email === '' || password === '' || name === '') { return; }
        this.setState({ loading: true });
        let token = await db.createUser(name, email, password);
        if (token === 'bad request') {
            if (Platform.OS == 'android') {
                ToastAndroid.show('Bad request, check email and password again', ToastAndroid.LONG);
                return this.setState({ loading: false });
            }
        }
        await AsyncStorage.setItem('userToken', token);
        this.setState({ loading: false });
        this.props.navigation.navigate('Home');
    }

    renderLogo() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.logoContainer}>
                <Card>
                    <View style={styles.logo}>
                        <Feather name='check-circle' size={30} color={colors.red} />
                        <Text style={styles.text}>Task Maker</Text>
                    </View>
                    <Text style={styles.hello}>Hey there, Let's get onboard!</Text>
                </Card>
            </KeyboardAvoidingView>
        );
    }

    renderForm() {
        return (
            <View>
                <Card>
                    {this.state.login ? null :
                        <TextInput
                            placeholder="Your Name"
                            placeholderTextColor={colors.lightRed}
                            style={styles.textInput}
                            value={this.state.name}
                            onChangeText={(name) => this.setState({ name })}
                        />}
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor={colors.lightRed}
                        style={styles.textInput}
                        value={this.state.email}
                        keyboardType='email-address'
                        onChangeText={(email) => this.setState({ email })}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={colors.lightRed}
                        style={styles.textInput}
                        value={this.state.password}
                        keyboardType='default'
                        onChangeText={(password) => this.setState({ password })}
                    />
                </Card>
                <Card>
                    <View style={{ paddingTop: 5 }}>
                        <Button
                            onPress={() => { this.state.login ? this.onLoginPress() : this.onSignUpPress() }}
                            loading={this.state.loading}>
                            {this.state.login ? 'Log in' : 'Create Account'}
                        </Button>
                    </View>
                </Card>
            </View>
        );
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    backgroundColor={colors.backgroundColor}
                    barStyle="dark-content"
                />
                <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {this.renderLogo()}
                        {this.renderForm()}
                        <View style={styles.bottomTextView}>
                            <Text style={styles.bottomText}>
                                {this.state.login ? 'Still without an account? ' : 'Already have an account? '}
                            </Text>
                            <TouchableOpacity onPress={() => this.switchForm()}>
                                <Text style={[styles.bottomText, { color: colors.red }]}>
                                    {this.state.login ? 'Create one' : 'Log in'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor
    },
    text: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.red,
        marginHorizontal: 5,
    },
    logoContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    logo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hello: {
        fontSize: 22,
        fontWeight: '500',
        color: colors.red,
        padding: 5
    },
    textInput: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.red,
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.red
    },
    bottomTextView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    bottomText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    }
});

export default LoginScreen;