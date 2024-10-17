import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Avatar, Button, Divider, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { styles } from '../../theme/styles';
import { auth, dbRealTime } from '../../config/firebaseConfig';
import firebase, { updateProfile } from '@firebase/auth';
import { FirebaseApp } from 'firebase/app';
import MusicCardComponent from './components/MusicCardComponent';
import { NewMusicComponent } from './components/NewMusicComponent';

import { onValue, ref } from 'firebase/database';



//interface - FormUser
interface FormUser {
    name: string;
}

//interface - Product
export interface Product {
    id: string;
    code: string;
    nameAlbum: string;
    price: number;
    stock: number;
    description: string;
}

export const HomeScreen = () => {

    //hook useState: cambiar el estado del formulario
    const [formUser, setFormUser] = useState<FormUser>({
        name: ""
    });

    //hook useState: capturar y modificar la data del usuario autenticado
    const [userData, setUserData] = useState<firebase.User | null>(null);

    //hook useState: gestionar la lista de productos
    const [products, setProducts] = useState<Product[]>([]);

    //hook useState: permitir que el modal de usuario se visualice o no
    const [showModalProfile, setShowModalProfile] = useState<boolean>(false);

    //hook useState: permitir que el modal de producto se visualice o no
    const [showModalProduct, setShowModalProduct] = useState<boolean>(false);

    //hook useEffect: validar el estado de autenticación
    useEffect(() => {
        //cambiar de null al usuario autenticado
        setUserData(auth.currentUser);
        setFormUser({ name: auth.currentUser?.displayName ?? '' });
        //llamar la función para la lista de Productos
        getAllAlbums();
    }, []);

    //función: actualizar el estado del formulario
    const handleSetValues = (key: string, value: string) => {
        setFormUser({ ...formUser, [key]: value })
    }

    //función: actualizar la información del usuario autenticado
    const handleUpdateUser = async () => {
        try {
            await updateProfile(userData!,
                { displayName: formUser.name });
        } catch (e) {
            console.log(e);
        }

        //ocultar modal    
        setShowModalProfile(false);
    }

    //función: obtener los productos para listarlos
    const getAllAlbums = () => {
        //1. Direccionar a la tabla de la BD
        const dbRef = ref(dbRealTime, 'albums');
        //2. Acceder a la data
        onValue(dbRef, (snapshot) => {
            //3. Capturar la data
            const data = snapshot.val(); // Obtener la data en un formato esperado
            //4. Obtener las keys de cada dato
            const getKeys = Object.keys(data);
            //5. Crear un arreglo para alamacenar cada producto que se obtiene
            const listAlbum: Product[] = [];
            //6. Recorrer las Keys para acceder a cada producto
            getKeys.forEach((key) => {
                const value = { ...data[key], id: key }
                listAlbum.push(value);
            });
            //7. Actualizar  la data obtenida en el arreglo del hook useState
            setProducts(listAlbum);
        })
    }

    //función cerrar sesión
    const handleSignOut = () => {

    }



    return (
        <>
            <View style={styles.rootHome}>
                <View style={styles.header}>
                    <Avatar.Text size={50} label="Edison" />
                    <View>
                        <Text variant='bodySmall'>Bienvenid@</Text>
                        <Text variant='labelLarge'>{userData?.displayName}</Text>
                    </View>
                    <View style={styles.icon}>
                        <IconButton
                            icon="account-edit"
                            size={30}
                            mode='contained'
                            onPress={() => setShowModalProfile(true)}
                        />

                    </View>
                </View>
                <View>
                    <FlatList
                        data={products}
                        renderItem={({ item }) => <MusicCardComponent product={item} />}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
            <Portal>
                <Modal visible={showModalProfile} contentContainerStyle={styles.modal}>
                    <View style={styles.header}>
                        <Text variant='headlineSmall'>Mi perfil</Text>
                        <View style={styles.icon}>
                            <IconButton
                                icon="close-circle-outline"
                                size={30}
                                onPress={() => setShowModalProfile(false)}
                            />
                        </View>

                    </View>

                    <Divider />
                    <TextInput
                        mode='outlined'
                        label="Nombre"
                        value={formUser.name}
                        onChangeText={(value) => handleSetValues('name', value)}
                    />
                    <TextInput
                        mode='outlined'
                        label="Correo"
                        disabled
                        value={userData?.email!}
                    />
                    <Button mode='contained' onPress={handleUpdateUser}>Actualizar</Button>
                </Modal>
            </Portal>
            <FAB
                icon="plus"
                style={styles.fabProduct}
                onPress={() => setShowModalProduct(true)}
            />
            <NewMusicComponent showModalProduct={showModalProduct} setShowModalProduct={setShowModalProduct} />
        </>
    )
}

export default HomeScreen