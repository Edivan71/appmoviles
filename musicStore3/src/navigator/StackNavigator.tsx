import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import React from 'react';
import { styles } from '../theme/styles';

//interface - Routes (StackScreen)
interface Routes {
    name: string;
    screen: () => JSX.Element; //componente React
}

//arreglo - routes cuando el usuario no esté autenticado
const routesNoAuth: Routes[] = [
    { name: 'Login', screen: LoginScreen },
    { name: 'Register', screen: RegisterScreen }
];

//arreglo - roues cuando el usuario esté autenticado
const routesAuth: Routes[] = [{
    name: 'Home', screen: HomeScreen
}];

const Stack = createStackNavigator();

export const StackNavigator = () => {
    //hook useState: verificar si está autenticado o no
    const [isAuth, setIsAuth] = useState <boolean>(false);

    //hook useState: controlar carga inicial
    const [isLoading, setIsLoading] = useState<boolean>(false);

    //hook useEffect: Validar el estado de autenticación
    useEffect(()=>{
        //cargar el activity Indicator
        setIsLoading(true);
        onAuthStateChanged(auth, (user)=>{
            if(user){
                //console.log(user);
                setIsAuth(true);
            }
            //ocualtar el activity indicator
            setIsLoading(false);
                
        });
    },[]);
    return (
        <>

        { isLoading ? (
            <View style={styles.rootActivity}>
            <ActivityIndicator animating={true} size={35}/>
            </View>
        ):(
            <Stack.Navigator>
            {
                !isAuth ?
                routesNoAuth.map((item, index)=>(
                    <Stack.Screen key={index}
                        name={item.name} 
                        options={{ headerShown: false }} 
                        component={item.screen} />
                ))
                :
                routesAuth.map((item,index)=>(
                    <Stack.Screen key={index}
                    name={item.name} 
                    options={{ headerShown: false }} 
                    component={item.screen} />
                ))
            }
            
           
        </Stack.Navigator>
        )}
        </>
    );
}