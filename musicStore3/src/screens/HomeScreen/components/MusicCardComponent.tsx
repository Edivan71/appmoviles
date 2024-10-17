import React from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { styles } from '../../../theme/styles';

export const MusicCardComponent = () => {
    return (
        <View style={styles.rootListMusic}>
            <View>
                <Text variant='labelLarge'>Nombre Album: Soda Stereo</Text>
                <Text variant='bodyMedium'>Precio: $48</Text>
            </View>
            <View style={styles.icon}>
                <IconButton
                    icon="arrow-right-bold-box"
                    size={25}
                    mode='contained'
                    onPress={() => console.log('Pressed')}
                />
            </View>
        </View>

    )
}

export default MusicCardComponent