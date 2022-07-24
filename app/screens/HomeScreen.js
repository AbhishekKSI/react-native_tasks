import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Pressable,
  Modal,
  Image,
} from 'react-native';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {COLORS, Loader} from '../utils';
import ROUTES from '../navigation/routes';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';

const HomeScreen = ({navigation}) => {
  const [contactsArr, setContactsArr] = useState([]);
  const [modalData, setModalData] = useState('');
  const [isLoading, setLoadingState] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const reference = database().ref('/contacts');
    reference.on('value', snapshot => {
      setLoadingState(false);

      if (snapshot !== null) {
        let keys = snapshot.val() ? Object.keys(snapshot.val()) : [];
        const data = snapshot.val();
        const contactsData = keys.map(key => {
          return data[key];
        });
        setContactsArr(contactsData);
      }
    });
    setLoadingState(false);
  }, []);
  const onPressDelete = item => {
    Alert.alert(
      'Delete this contact',
      '',
      [
        {
          text: 'Delete',
          onPress: async () => {
            await database()
              .ref(`contacts/${item.name}`)
              .remove(async () => {
                await storage().ref(item.imageName).delete();
                alert('contact deleted');
              });
          },
        },
        {
          text: 'cancel',
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  };
  const onPressItem = async item => {
    if (item.imageName !== '') {
      await storage()
        .ref(item.imageName)
        .getDownloadURL()
        .then(value => {
          setModalData({...item, image: value});
          setModalVisible(true);
        });
    } else {
      setModalData({...item});
      setModalVisible(true);
    }
  };
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onPressItem(item)}>
        <View style={styles.itemDetailsContainer}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemText}>{item.mobileNumber}</Text>
        </View>
        <View style={styles.itemEditDeleteContainer}>
          <TouchableOpacity
            style={styles.editDeleteButtonContainer}
            onPress={() =>
              navigation.navigate(ROUTES.EDIT_CONTACT, {contactData: item})
            }>
            <Text style={styles.itemButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPressDelete(item)}
            style={[
              styles.editDeleteButtonContainer,
              {backgroundColor: COLORS.red},
            ]}>
            <Text style={styles.itemButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  const EmptyComponent = () => {
    return <Text style={styles.emptyText}>No Contacts saved</Text>;
  };
  const createContact = () => {
    navigation.navigate(ROUTES.CREATE_CONTACT);
  };
  const ModalView = () => {
    console.log({modalData})
    const image =
      modalData?.image !== ''
        ? {uri: modalData?.image}
        : require('../assets/images/download.png');
    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalView}>
            <Image style={styles.imgStyles} source={image} />
            <Text style={styles.modalText}>Name: {modalData?.name}</Text>
            <Text style={styles.modalText}>
              Mobile Number: {modalData?.mobileNumber}
            </Text>

            <View style={styles.checkBoxContainer}>
              <CheckBox value={modalData?.isWhatsApp} />
              <Text>is WhatsApp</Text>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>close</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButtonContainer}
        onPress={createContact}>
        <Text style={styles.createButtonText}>create contact</Text>
      </TouchableOpacity>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <FlatList
          ListEmptyComponent={<EmptyComponent />}
          data={contactsArr}
          renderItem={renderItem}
        />
      )}
      <ModalView />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.white},
  createButtonContainer: {
    backgroundColor: COLORS.primaryButton,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 80,
    borderRadius: 8,
    marginVertical: 30,
  },
  createButtonText: {color: COLORS.white, textTransform: 'uppercase'},
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  itemDetailsContainer: {},
  itemEditDeleteContainer: {
    marginVertical: 10,
  },
  itemText: {
    fontSize: 18,
  },
  editDeleteButtonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.borderColor,
    borderRadius: 5,
    marginVertical: 5,
  },
  itemButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.white,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  pickerStyles: {
    marginHorizontal: 10,
  },
  imgStyles: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },

  centeredView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    marginTop: '40%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    paddingHorizontal: 30,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
