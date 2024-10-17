//import React from 'react'
import React, { useState } from 'react'
import { View } from 'react-native'
import { styles } from '../theme/styles'
import { Button, Snackbar, Text, TextInput } from 'react-native-paper'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { CommonActions, useNavigation } from '@react-navigation/native';

//interface - FormLogin
interface FormLogin {
    email: string;
    password: string;
}

//interface - Message
interface ShowMessage{
    visible: boolean;
    message: string;
    color: string;
}

export const LoginScreen = () => {

    //hook useState:cambiar el estado del formulario
    const [formLogin, setFormLogin] = useState<FormLogin>({
        email: "",
        password: "",
    });

    //hook useState: cambiar el estado del mensaje
    const [showMessage, setShowMessage] = useState<ShowMessage>({
        visible: false,
        message: "",
        color: "#fff"
    });

    //hook eseState: permitir que la contraseña sea visible o no
    const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);

    //hook useNavigation: permitir navegación de un screen a otro
    const navigation = useNavigation();

    //función: actualizar el estado del formulario
    const handleSetValues = (key:string, value: string) => {
        setFormLogin({...formLogin, [key]: value })
    }

    //función: iniciar sesión con el usuario registrado
    const handleSignIn = async() => {
        //valida que los campos esten llenos
        if (!formLogin.email || !formLogin.password){
            setShowMessage({
                visible: true,
                message: 'Complete todos los campos',
                color: '#7a0808'
            });
            return;
        }
        console.log(formLogin);
        try {
            const response = await signInWithEmailAndPassword(
                auth,
                formLogin.email,
                formLogin.password 
            );
            console.log(response);
        } catch(e){
            console.log(e);
            setShowMessage({
                visible: true,
                message: 'Correo y/o contraseña incorrecta!',
                color: '#7a0808'
            })

        }
        
        
    }

    return (
        <View style={styles.root}>
            <Text style={styles.text}>Inicia Sesión</Text>
            <TextInput
                label="Correo"
                mode="outlined"
                placeholder="Escribe tu correo"
                onChangeText={(value) => handleSetValues('email', value)}

            />
            <TextInput
                label="Contraseña"
                mode="outlined"
                placeholder="Escribe tu contraseña"
                secureTextEntry={hiddenPassword}
                onChangeText={(value) => handleSetValues('password', value)}
                right={<TextInput.Icon icon="eye" onPress={() => setHiddenPassword(!hiddenPassword)} />}

            />
            <Button mode="contained" onPress={handleSignIn}>
                Iniciar
            </Button>
            <Text style={styles.textRedirect} 
                onPress={()=>navigation.dispatch(CommonActions.navigate({name: 'Register'}))}>
                No tienes una cuenta? Regístrate ahora
            </Text>
            <Snackbar
                visible={showMessage.visible}
                onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
                style={{
                    ...styles.message,
                    backgroundColor: showMessage.color
                }}>
                {showMessage.message}
            </Snackbar>
            
        </View>
    )
}
