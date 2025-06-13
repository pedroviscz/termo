import { StyleSheet } from "react-native";
import { width } from "../constants";
import colors from "./colors";

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryBrown,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '15%',
        paddingHorizontal: '10%'
    },
    containerText: {
        flex: 0,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20%'
    },
    title:{
      color: 'white',
      fontSize: 40
    },
    subtitle: {
        color: 'white',
        fontSize: 17
    },
    label: {
        color: 'white',
        marginBottom: '1%'
    },
    textInput: {
        flex: 0,
        alignSelf: 'stretch',
        borderColor: colors.lightBrown,
        borderWidth: 3,
        borderRadius: 5,
        paddingHorizontal: '3%',
        color: 'white'
    },
    inputContainer: {
        flex: 0,
        alignSelf: 'stretch',
        marginBottom: '10%'
    },
    button: {
        flex: 0,
    },
    containerSquads: {
        flex: 0,
        justifyContent: 'center',
        flexDirection: 'row',
        height: width * 0.15,
        gap: '1.5%'
    },
    squad: {
        height: '100%',
        width: width * 0.15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    squadText: {
        fontSize: 30,
        color: 'white'
    },
    errorText:{
        color: 'white',
        marginTop: '10%'
    }
})

export default style;