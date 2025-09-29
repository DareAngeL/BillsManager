import { StatusBar, StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        paddingTop: StatusBar.currentHeight,
        // fontFamily: 'Inter',
        // fontSize: 24,
    },
    text: {
        
    },
});

export const fonts = StyleSheet.create({
    bold: {
        fontFamily: 'Inter_18pt-Bold',
        color: '#303030',
    },
    regular: {
        fontFamily: 'Inter_18pt-Regular',
        color: '#303030',
    },
});
