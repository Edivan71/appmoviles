import React, { useState } from 'react'
import { Button, Divider, IconButton, Modal, Portal, Snackbar, Text, TextInput } from 'react-native-paper'
import { styles } from '../../../theme/styles';
import { View } from 'react-native';
import { dbRealTime } from '../../../config/firebaseConfig';
import { push, ref, set } from 'firebase/database';


//interface - Props
interface Props {
    showModalProduct: boolean;
    setShowModalProduct: Function; //función del hook useState
}

//interface - Message
interface ShowMessage {
    visible: boolean;
    message: string;
    color: string;
}

//interface - FormProduct
interface FormMusic {
    code: string;
    nameAlbum: string;
    price: number;
    stock: number;
    description: string;
}

export const NewMusicComponent = ({ showModalProduct, setShowModalProduct }: Props) => {

    //hook para cambiar el estado del formulario
    const [formMusic, setFormMusic] = useState<FormMusic>({
        code: '',
        nameAlbum: '',
        price: 0,
        stock: 0,
        description: ''
    });

    //hook useState: cambiar el estado del mensaje
    const [showMessage, setShowMessage] = useState<ShowMessage>({
        visible: false,
        message: "",
        color: "#fff"
    });

    //función: actualizar el estado del formulario
    const handleSetValues = (key: string, value: string) => {
        setFormMusic({ ...formMusic, [key]: value });
    }

    //función: Agregar los productos
    const handleSaveMusic = async() => {
        if (!formMusic.code || !formMusic.nameAlbum || !formMusic.price
            || !formMusic.stock || !formMusic.description) {
            setShowMessage({
                visible: true,
                message: 'Completa todos los campos',
                color: '#7a0808'
            })
            return;
        }
        //console.log(formProduct);
        //1. Crear o direccionar a la tabla de la BD
        const dbRef = ref (dbRealTime, 'albums');
        //2. Crear una colección que agregue los datos en la dbRef
        const saveMusic = push(dbRef);
        //3. Almacenar los datos en la BD
        try{
            await set (saveMusic, formMusic);
            //cerrar modal
            setShowModalProduct(false);
        } catch(e){
            console.log(e);
            setShowMessage({
                visible: true,
                message: 'No se completó la transacción, intentalo más tarde!',
                color: '#7a0808'
            })
        }
        


    }

    return (
        <>
            <Portal>
                <Modal visible={showModalProduct} contentContainerStyle={styles.modal}>
                    <View style={styles.header}>
                        <Text variant='headlineSmall'>Nuevo Album</Text>
                        <View style={styles.icon}>
                            <IconButton
                                icon='close-circle-outline'
                                size={30}
                                onPress={() => setShowModalProduct(false)} />
                        </View>
                    </View>
                    <Divider />
                    <TextInput
                        label='Codigo'
                        mode='outlined'
                        onChangeText={(value) => handleSetValues('code', value)} />
                    <TextInput
                        label='Nombre'
                        mode='outlined'
                        onChangeText={(value) => handleSetValues('nameAlbum', value)} />
                    <View style={styles.rootInputsProduct}>
                        <TextInput
                            label='Precio'
                            mode='outlined'
                            keyboardType='numeric'
                            style={{ width: '45%' }}
                            onChangeText={(value) => handleSetValues('price', value)} />
                        <TextInput
                            label='Stock'
                            mode='outlined'
                            keyboardType='numeric'
                            style={{ width: '45%' }}
                            onChangeText={(value) => handleSetValues('stock', value)} />
                    </View>
                    <TextInput
                        label='Descripción'
                        mode='outlined'
                        multiline
                        numberOfLines={3}
                        onChangeText={(value) => handleSetValues('description', value)} />
                    <Button mode='contained' onPress={handleSaveMusic}>Agregar</Button>
                </Modal>
                <Snackbar
                    visible={showMessage.visible}
                    onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
                    style={{
                        ...styles.message,
                        backgroundColor: showMessage.color
                    }}>
                    {showMessage.message}
                </Snackbar>
            </Portal>

        </>
    )
}
