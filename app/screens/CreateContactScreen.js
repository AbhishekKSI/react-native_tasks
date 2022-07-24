import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {COLORS, Loader} from '../utils';
import ROUTES from '../navigation/routes';

const CreateContactScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [contactType, setContactType] = useState('personal');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isLoading, setLoadingState] = useState(false);

  const openImagePicker = () => {
    const options = {mediaType: 'photo'};
    launchImageLibrary(options, imageObj => {
      if (!imageObj.didCancel) {
        const obj = {
          uri: imageObj.assets[0].uri,
          fileName: imageObj.assets[0].fileName,
          fileType: imageObj.assets[0].type,
        };
        setProfileImage(obj);
      }
    });
  };
  const validation = () => {
    let isValid = true;
    if (name == '') {
      alert('please enter name');
      isValid = false;
      return isValid;
    }
    if (mobileNumber == '') {
      alert('please enter mobile number');
      isValid = false;
      return isValid;
    }
    if (contactType == '') {
      alert('please select contact type');
      isValid = false;
      return isValid;
    }
    return isValid;
  };

  const createUserContact = () => {
    if (validation()) {
      setLoadingState(true);
      const data = {
        name,
        mobileNumber,
        isWhatsApp: toggleCheckBox,
        type: contactType,
        imageName: profileImage?.fileName ? profileImage?.fileName : '',
      };
      const reference = database().ref(`/contacts/${name}`);
      reference.set(data).then(async () => {
        profileImage?.fileName &&
          (await storage()
            .ref(profileImage?.fileName)
            .putFile(profileImage?.uri));
        alert('contact created');
        setLoadingState(false);
        navigation.navigate(ROUTES.HOME);
        setName('');
        setMobileNumber('');
        setToggleCheckBox(false);
        setContactType('');
        setProfileImage('');
      });
      setLoadingState(false);
    }
  };
  const profileImg = profileImage?.uri
    ? {uri: profileImage?.uri}
    : require('../assets/images/download.png');
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={openImagePicker}>
          <Image source={profileImg} style={styles.imgStyles} />
        </TouchableOpacity>

        <TextInput
          placeholder="enter name"
          style={styles.textInputContainer}
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          placeholder="enter mobile number"
          style={styles.textInputContainer}
          value={mobileNumber}
          onChangeText={text => setMobileNumber(text)}
        />
        <Picker
          style={styles.pickerStyles}
          selectedValue={contactType}
          onValueChange={(itemValue, itemIndex) => {
            setContactType(itemValue);
          }}>
          <Picker.Item label="Personal" value="personal" />
          <Picker.Item label="Office" value="office" />
        </Picker>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            value={toggleCheckBox}
            onValueChange={newValue => setToggleCheckBox(newValue)}
          />
          <Text>is WhatsApp</Text>
        </View>
        <TouchableOpacity
          style={styles.createButtonContainer}
          onPress={createUserContact}>
          <Text style={styles.createButtonText}>create</Text>
        </TouchableOpacity>
        <Loader isLoading={isLoading} />
      </View>
    </View>
  );
};

export default CreateContactScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.white},
  wrapper: {
    marginTop: '20%',
  },
  imgStyles: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 20,
  },
  textInputContainer: {
    borderColor: COLORS.grey,
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  pickerStyles: {
    marginHorizontal: 10,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  createButtonContainer: {
    backgroundColor: COLORS.primaryButton,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 80,
    borderRadius: 8,
    marginVertical: 30,
  },
  createButtonText: {color: COLORS.white, textTransform: 'uppercase'},
});
