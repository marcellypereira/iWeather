import { StyleSheet } from 'react-native';
import {
    StatusBar,
    Platform,
  } from 'react-native';


const styles = StyleSheet.create({
  containerDash: {
    flex: 1,
    backgroundColor: '#13131A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 10,
  },
  condicoesTempo: {
    backgroundColor: '#1C1C27',
    padding: 12,
    borderRadius: 10,
    margin: 5,
  },
  backgroundImage: {
    width: '100%',
  },
  viewInfosImg: {
    padding: 10,
  },
  localDay: {
    gap: 3,
    marginBottom: '15%',
  },
  local: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  day: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '200',
  },
  description: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  descriptionTxt: {
    alignItems: 'flex-start',
  },
  temperatura: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
  },
  sensacao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
  },
  tempo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '200',
  },
  icons: {
    resizeMode: 'contain',
  },
  viewList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 0.2,
    paddingVertical: 9,
    borderColor: '#383854',
  },
  viewListCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewListContText: {
    color: 'rgba(191, 191, 212, 1)',
    fontWeight: '500',
    fontSize: 17,
  },
  viewListContImg: {
    marginRight: 10,
  },
  condicoesTempoUlt: {
    backgroundColor: '#1C1C27',
    padding: 12,
    borderRadius: 10,
    margin: 5,
    marginBottom: 50,
  },
  condicoesTempoProb: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  viewTempDay: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diaSemana: {
    color: 'rgba(191, 191, 212, 1)',
  },
  iconsProb: {
    maxWidth: 100,
    maxHeight: 100,
  },
  temperaturas: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  temperaturaMax: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  temperaturaMin: {
    color: 'rgba(191, 191, 212, 1)',
    fontSize: 17,
    fontWeight: '300',
  },
});

export default styles;
