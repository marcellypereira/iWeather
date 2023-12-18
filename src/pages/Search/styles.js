import { StyleSheet } from 'react-native';
import {
    StatusBar,
    Platform,
  } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  logoInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: '15%',
  },
  boxInput: {
    width: '80%',
  },
  boxTitle: {
    alignItems: 'center',
    marginBottom: '10%',
  },
  titleWhite: {
    color: '#fff',
    fontSize: 20,
  },
  titleBlue: {
    color: '#8FB2F5',
  },
  subtitleWhite: {
    color: '#fff',
  },
  input: {
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    backgroundColor: '#1C1C27',
    borderRadius: 10,
    color: 'rgba(250, 250, 250, 1)',
    justifyContent: 'center',
  },
  suggestionsList: {
    width: '80%',
    maxHeight: 240,
    borderWidth: 1,
    borderColor: '#13131A',
    borderRadius: 10,
    top: 10,
    backgroundColor: 'rgba(59, 59, 84, 1)',
    alignSelf: 'center',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#13131A',
    height: 60,
    justifyContent: 'center',
  },
  txtList: {
    color: 'rgba(250, 250, 250, 1)',
  },
});
