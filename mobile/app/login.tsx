import React, { useRef, useState } from 'react';
import {
  View, TextInput, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { useAuth } from '@/src/hooks/useAuth';
import { gstyle, loginStyle as tstyle, colors } from '@/src/styles';
import AnimatedButton, { AnimatedButtonHandle } from '@/src/components/AnimatedButton';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('pedroviscz');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const buttonRef = useRef<AnimatedButtonHandle>(null);

  const handleLogin = async () => {
    if (isButtonDisabled) return;

    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 1400);

    if (!username || !password) {
      setIsValid(false)
      setError('Username e senha são obrigatórios')
      buttonRef.current?.flip(false);
      setTimeout(() => buttonRef.current?.shake(), 800);
    } else {
      const loginSuccess = await login(username, password);
      setIsValid(loginSuccess);
      buttonRef.current?.flip(loginSuccess);
      if (loginSuccess) {
        router.navigate('/(logged-in)')
      }else{
        setError('Usuário ou senha inválidos')
        setTimeout(() => buttonRef.current?.shake(), 800);
      }
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={tstyle.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={tstyle.containerText}>
          <Text style={[gstyle.mitrSemiBold, tstyle.title]}>BEM VINDO(A)!</Text>
          <Text style={[gstyle.mitrMedium, tstyle.subtitle]}>faça login para continuar</Text>
        </View>
        <View style={tstyle.inputContainer}>
          <Text style={[gstyle.mitrMedium, tstyle.label]}>Username</Text>
          <TextInput
            value={username}
            style={[tstyle.textInput, gstyle.mitrMedium]}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="Insira seu username"
            placeholderTextColor={colors.lightBrown}
            cursorColor={colors.lightBrown}
            selectionColor={colors.lightBrown}
          />
        </View>
        <View style={tstyle.inputContainer}>
          <Text style={[gstyle.mitrMedium, tstyle.label]}>Senha</Text>
          <TextInput
            value={password}
            style={[tstyle.textInput, gstyle.mitrMedium]}
            secureTextEntry
            onChangeText={setPassword}
            placeholder="Insira sua senha"
            placeholderTextColor={colors.lightBrown}
            cursorColor={colors.lightBrown}
            selectionColor={colors.lightBrown}
          />
        </View>
        <AnimatedButton ref={buttonRef} disabled={isButtonDisabled} success={isValid} onPress={handleLogin} />
        <Text style={[gstyle.mitrMedium, tstyle.errorText]}>{error}</Text>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}