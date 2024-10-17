import React, { useState } from 'react'
import { View } from 'react-native'
import { Text, TextInput, Button, Snackbar } from 'react-native-paper'
import { styles } from '../theme/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { CommonActions, useNavigation } from '@react-navigation/native';

//interface - FormRegister
interface FormRegister {
    email: string,
    password: string
}

//interface - Message
interface ShowMessage{
    visible: boolean;
    message: string;
    color: string;
}

export const RegisterScreen = () => {
    //hook useState: cambiar el estado del formulario
    const [formRegister, setformRegister] = useState<FormRegister>({
        email: "",
        password: ""
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


    //function: actualizar el estado del formulario
    const handleSetValues = (key: string, value: string) => {
        setformRegister({ ...formRegister, [key]: value });
    }

    //function: registrar a nuevo usuario
    const handleRegister = async() => {
        if (!formRegister.email || !formRegister.password) {
            setShowMessage({
                visible:true, 
                message:'Completa todos los campos!',
                color: '#7a0808'
            });
            return;
        }
        console.log(formRegister)
        try{
            const response = await createUserWithEmailAndPassword(
                auth,
                formRegister.email,
                formRegister.password
            );
            setShowMessage({
                visible: true,
                message: 'No se logró completar la transacción, intente más tarde!',
                color: '#7a0808'
            });
        }catch(e){
            console.log(e);
        }
        
    }

    return (
        <View style={styles.root}>
            <Text style={styles.text}>Regístrate</Text>
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
                secureTextEntry = {hiddenPassword}
                onChangeText={(value) => handleSetValues('password', value)}
                right={<TextInput.Icon icon="eye" onPress={()=>setHiddenPassword(!hiddenPassword)}/>}

            />
            <Button mode="contained" onPress={handleRegister}>
                Registrar
            </Button>
            <Text style={styles.textRedirect} 
                onPress={()=>navigation.dispatch(CommonActions.navigate({name: 'Login'}))}>
                Ya tienes una cuenta? Inicia Sesión ahora
            </Text>
            <Snackbar
                visible={showMessage.visible}
                onDismiss={()=>setShowMessage({...showMessage, visible: false})}
                style={{
                    ...styles.message,
                    backgroundColor: showMessage.color
                }}>
                {showMessage.message}
            </Snackbar>
        </View>

    )
}
