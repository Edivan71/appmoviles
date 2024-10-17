import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Divider, Text, TextInput } from 'react-native-paper'
import { styles } from '../../theme/styles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Product } from './HomeScreen'
import { ref, remove, update } from 'firebase/database'
import { dbRealTime } from '../../config/firebaseConfig'

export default function DetailMusicScreen() {
    //hook useRoot: acceder a toda la información de navegación
    const route = useRoute();
    //console.log(route);
    //@ts-ignore
    const { product } = route.params;
    //console.log(params);

    //hook useNavigation: permite navegar de un screen a otro
    const navigation = useNavigation();

    //hook useState: cambiar el estado del formulario de editar y eliminar
    const [formEdit, setFormEdit] = useState<Product>({
        id:'',
        code:'',
        nameAlbum:'',
        price:0,
        stock: 0,
        description:''

    });

    //hook useEffect: Cargar y mostrar la data del detalle
    useEffect(()=>{
        //Actualizar los datos en el formulario
        setFormEdit(product);
    }, []);

    //función: actualizar los datos capturados desde el formulario
    const handleSetValues = (key: string, value: string) => {
        setFormEdit({...formEdit, [key]: value })
    }

    //función: actualizar la data del producto
    const handleUpdateMusic = async () =>{
        //console.log(formEdit);
        //1. Direccionar a la base de datos y el elemento a editar
        const  dbRef = ref(dbRealTime, 'albums/'+formEdit.id)
        //2. Actualizar el dato seleccionado
        try{
            await update (dbRef,{
                code: formEdit.code,
                nameAlbum: formEdit.nameAlbum,
                price: formEdit.price,
                stock: formEdit.stock,
                description: formEdit.description
            });
            //3. Regresar al anterior screen
            navigation.goBack();
        }catch(e){
            console.log(e);
            
        }
        
    }

    //función: eliminar la data del producto
    const handleDeleteMusic= async ()=>{
        const  dbRef = ref(dbRealTime, 'albums/'+formEdit.id);
        try{
            await remove(dbRef);
            navigation.goBack();
        }catch(e){
            console.log(e);
        }
        
    }

    return (
        <View style={styles.rootDetail}>
            <View style={styles.rootInputsProduct}>
                <Text variant='headlineSmall'>Código:</Text>
                <TextInput
                    value={formEdit.code.toString()}
                    onChangeText={(value)=>handleSetValues('code', value)}
                    style={{ width: '40%' }} />
                <Divider />
            </View>
            <View style={styles.rootInputsProduct}>
                <Text style={styles.textDetail}>Nombre: </Text>
                <TextInput
                    value={formEdit.nameAlbum.toString()}
                    onChangeText={(value)=>handleSetValues('nameAlbum', value)}
                    style={{ width: '40%' }} />
                <Divider />
            </View>
            <View style={styles.rootInputsProduct}>
                <Text style={styles.textDetail}>Precio:</Text>
                <TextInput
                    value={formEdit.price.toString()}
                    onChangeText={(value)=>handleSetValues('price', value)}
                    style={{ width: '28%' }} />
                <Text style={styles.textDetail}>Stock:</Text>
                <TextInput
                    value={formEdit.stock.toString()}
                    onChangeText={(value)=>handleSetValues('stock', value)}
                    style={{ width: '23%' }} />
            </View>
            <View>
                <Text style={styles.textDetail}>Descripción:</Text>
                <TextInput
                    value={formEdit.description}
                    onChangeText={(value)=>handleSetValues('description', value)}
                    multiline
                    numberOfLines={4} />
            </View>
            <Button mode='contained' icon='update' onPress={handleUpdateMusic}>Actualizar</Button>
            <Button mode='contained' icon='delete-empty-outline' onPress={handleDeleteMusic}>Eliminar</Button>
        </View>
    )
}
