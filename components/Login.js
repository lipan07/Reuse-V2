import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, TouchableWithoutFeedback, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const countryCodes = [
   { code: '+1', name: 'United States' },
   { code: '+91', name: 'India' },
   { code: '+44', name: 'United Kingdom' },
   { code: '+61', name: 'Australia' },
   { code: '+81', name: 'Japan' },
   { code: '+86', name: 'China' },
   { code: '+49', name: 'Germany' },
   { code: '+33', name: 'France' },
   { code: '+39', name: 'Italy' },
   { code: '+7', name: 'Russia' },
   { code: '+55', name: 'Brazil' },
   { code: '+27', name: 'South Africa' },
   { code: '+34', name: 'Spain' },
   { code: '+62', name: 'Indonesia' },
   { code: '+63', name: 'Philippines' },
   { code: '+64', name: 'New Zealand' },
   { code: '+82', name: 'South Korea' },
   { code: '+65', name: 'Singapore' },
   { code: '+66', name: 'Thailand' },
   { code: '+60', name: 'Malaysia' },
   { code: '+971', name: 'United Arab Emirates' },
   { code: '+92', name: 'Pakistan' },
   { code: '+20', name: 'Egypt' },
   { code: '+98', name: 'Iran' },
   { code: '+90', name: 'Turkey' },
   { code: '+31', name: 'Netherlands' },
   { code: '+32', name: 'Belgium' },
   { code: '+46', name: 'Sweden' },
   { code: '+47', name: 'Norway' },
   { code: '+48', name: 'Poland' },
   { code: '+351', name: 'Portugal' },
   { code: '+30', name: 'Greece' },
   { code: '+52', name: 'Mexico' },
   { code: '+54', name: 'Argentina' },
   { code: '+56', name: 'Chile' },
   { code: '+57', name: 'Colombia' },
   { code: '+58', name: 'Venezuela' },
   { code: '+94', name: 'Sri Lanka' },
   { code: '+880', name: 'Bangladesh' },
   { code: '+93', name: 'Afghanistan' },
   { code: '+964', name: 'Iraq' },
   { code: '+972', name: 'Israel' },
   { code: '+212', name: 'Morocco' },
   { code: '+213', name: 'Algeria' },
   { code: '+216', name: 'Tunisia' },
   { code: '+254', name: 'Kenya' },
   { code: '+255', name: 'Tanzania' },
   { code: '+256', name: 'Uganda' },
   { code: '+234', name: 'Nigeria' },
   { code: '+233', name: 'Ghana' },
   { code: '+263', name: 'Zimbabwe' },
   { code: '+260', name: 'Zambia' },
   { code: '+977', name: 'Nepal' },
   { code: '+975', name: 'Bhutan' },
   { code: '+960', name: 'Maldives' },
   { code: '+673', name: 'Brunei' },
   { code: '+84', name: 'Vietnam' },
   { code: '+856', name: 'Laos' },
   { code: '+855', name: 'Cambodia' },
   { code: '+679', name: 'Fiji' },
   { code: '+678', name: 'Vanuatu' },
   { code: '+682', name: 'Cook Islands' },
   { code: '+685', name: 'Samoa' },
   { code: '+686', name: 'Kiribati' },
   { code: '+687', name: 'New Caledonia' },
   { code: '+689', name: 'French Polynesia' },
   { code: '+672', name: 'Antarctica' },
   { code: '+501', name: 'Belize' },
   { code: '+502', name: 'Guatemala' },
   { code: '+503', name: 'El Salvador' },
   { code: '+504', name: 'Honduras' },
   { code: '+505', name: 'Nicaragua' },
   { code: '+506', name: 'Costa Rica' },
   { code: '+507', name: 'Panama' },
   { code: '+509', name: 'Haiti' },
   { code: '+592', name: 'Guyana' },
   { code: '+593', name: 'Ecuador' },
   { code: '+595', name: 'Paraguay' },
   { code: '+598', name: 'Uruguay' },
   { code: '+599', name: 'Netherlands Antilles' },
];

const AlertModal = ({ visible, type, title, message, onClose }) => {
   const getIconConfig = () => {
      switch (type) {
         case 'success': return { name: 'check-circle', color: '#4CAF50' };
         case 'error': return { name: 'error-outline', color: '#f44336' };
         case 'warning': return { name: 'warning', color: '#FF9800' };
         default: return { name: 'info', color: '#2196F3' };
      }
   };

   const { name, color } = getIconConfig();

   return (
      <Modal visible={visible} transparent animationType="fade">
         <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.alertModalOverlay}>
               <TouchableWithoutFeedback>
                  <View style={styles.alertContainer}>
                     <MaterialIcons name={name} size={48} color={color} style={styles.alertIcon} />
                     <Text style={styles.alertTitle}>{title}</Text>
                     <Text style={styles.alertMessage}>{message}</Text>
                     <TouchableOpacity
                        style={[styles.alertButton, { backgroundColor: color }]}
                        onPress={onClose}
                        activeOpacity={0.8}
                     >
                        <Text style={styles.alertButtonText}>OK</Text>
                     </TouchableOpacity>
                  </View>
               </TouchableWithoutFeedback>
            </View>
         </TouchableWithoutFeedback>
      </Modal>
   );
};

const Login = () => {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [countryCode, setCountryCode] = useState('+91');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [otp, setOtp] = useState('');
   const [showOtpField, setShowOtpField] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [showAlert, setShowAlert] = useState(false);
   const [alertType, setAlertType] = useState('info');
   const [alertTitle, setAlertTitle] = useState('');
   const [alertMessage, setAlertMessage] = useState('');
   const navigation = useNavigation();
   const otpInputRef = useRef(null);

   useEffect(() => {
      const checkLoginStatus = async () => {
         const token = await AsyncStorage.getItem('authToken');
         if (token) {
            setIsLoggedIn(true);
            navigation.navigate('Home');
         }
      };
      checkLoginStatus();
   }, []);

   const handlePhoneNumberSubmit = async () => {
      if (!phoneNumber || phoneNumber.length < 10) {
         setAlertType('error');
         setAlertTitle('Invalid Phone');
         setAlertMessage('Please enter a valid 10-digit phone number');
         setShowAlert(true);
         return;
      }
      setShowOtpField(true);
      setTimeout(() => {
         otpInputRef.current?.focus();
      }, 100);
   };

   const handleOtpSubmit = async () => {
      try {
         console.log(`${process.env.BASE_URL}/login`);
         const response = await fetch(`${process.env.BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: `${phoneNumber}`, otp }),
         });
         const data = await response.json();
         console.log(data);

         if (response.ok) {
            await AsyncStorage.multiSet([
               ['authToken', data.token],
               ['userId', data.user.id.toString()],
               ['name', data.user.name],
               ['phoneNo', data.user.phone_no],
               ['userName', data.user.name || ''],
               ['userImage', data.user.images?.url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png']
            ]);
            setIsLoggedIn(true);
            navigation.navigate('Home');
         } else {
            setAlertType('error');
            setAlertTitle('Login Failed');
            setAlertMessage(data.message || 'Invalid credentials');
            setShowAlert(true);
         }
      } catch (error) {
         setAlertType('error');
         setAlertTitle('Connection Error');
         setAlertMessage('Please check your internet connection');
         setShowAlert(true);
      }
   };

   const handleLogout = async () => {
      await AsyncStorage.clear();
      setIsLoggedIn(false);
      setShowOtpField(false);
      setCountryCode('+91');
      setPhoneNumber('');
      setOtp('');
   };

   const filteredCountries = countryCodes.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery)
   );

   const renderCountryCodeItem = ({ item }) => (
      <TouchableOpacity
         style={styles.countryCodeItem}
         onPress={() => {
            setCountryCode(item.code);
            setIsModalVisible(false);
         }}
      >
         <Text style={styles.countryCodeText}>{item.name} ({item.code})</Text>
      </TouchableOpacity>
   );

   return (
      <>
         <StatusBar backgroundColor="#f0f4f8" barStyle="dark-content" />
         <View style={styles.container}>
            <AlertModal
               visible={showAlert}
               type={alertType}
               title={alertTitle}
               message={alertMessage}
               onClose={() => setShowAlert(false)}
            />


            <Text style={styles.loginTitle}>Welcome to Reuse!</Text>
            <Text style={styles.loginSubtitle}>Login to your account</Text>

            <View style={styles.phoneInputContainer}>
               <TouchableOpacity
                  style={styles.countryCodeInput}
                  onPress={() => setIsModalVisible(true)}
                  activeOpacity={0.8}
               >
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
               </TouchableOpacity>

               <TextInput
                  style={styles.phoneNumberInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
               />
            </View>

            {showOtpField && (
               <TextInput
                  ref={otpInputRef}
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="#999"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  autoFocus={true}
               />
            )}

            <TouchableOpacity
               style={styles.loginButton}
               onPress={showOtpField ? handleOtpSubmit : handlePhoneNumberSubmit}
               activeOpacity={0.8}
            >
               <Text style={styles.buttonText}>
                  {showOtpField ? 'Verify OTP' : 'Send OTP'}
               </Text>
            </TouchableOpacity>

            {isLoggedIn && (
               <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.buttonText}>Logout</Text>
               </TouchableOpacity>
            )}

            {/* Country Code Selection Modal */}
            <Modal visible={isModalVisible} transparent animationType="slide">
               <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                     <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Country</Text>
                        <TouchableOpacity
                           onPress={() => setIsModalVisible(false)}
                           style={styles.closeButton}
                        >
                           <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                     </View>

                     <View style={styles.searchContainer}>
                        <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                           style={styles.searchInput}
                           placeholder="Search country or code"
                           placeholderTextColor="#999"
                           value={searchQuery}
                           onChangeText={setSearchQuery}
                        />
                     </View>

                     <FlatList
                        data={filteredCountries}
                        keyExtractor={(item) => item.code}
                        renderItem={renderCountryCodeItem}
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={styles.countryList}
                     />
                  </View>
               </View>
            </Modal>
         </View>
      </>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f0f4f8',
      justifyContent: 'center',
   },
   loginTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: 8,
      textAlign: 'center',
   },
   loginSubtitle: {
      fontSize: 16,
      color: '#7f8c8d',
      marginBottom: 32,
      textAlign: 'center',
   },
   phoneInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
   },
   countryCodeInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      backgroundColor: '#fff',
      marginRight: 12,
      minWidth: 100,
   },
   countryCodeText: {
      fontSize: 16,
      color: '#333',
   },
   phoneNumberInput: {
      flex: 1,
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      backgroundColor: '#fff',
      fontSize: 16,
      color: '#333',
   },
   input: {
      height: 50,
      borderColor: '#3498db',
      borderWidth: 2,
      borderRadius: 12,
      paddingHorizontal: 16,
      backgroundColor: '#fff',
      marginBottom: 20,
      fontSize: 16,
      color: '#333',
   },
   loginButton: {
      backgroundColor: '#3498db',
      height: 50,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
   logoutButton: {
      backgroundColor: '#e74c3c',
      height: 50,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
   },
   // Alert Modal Styles
   alertModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
   },
   alertContainer: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 24,
      width: '90%',
      alignItems: 'center',
   },
   alertTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#2c3e50',
      marginVertical: 8,
      textAlign: 'center',
   },
   alertMessage: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
      textAlign: 'center',
      lineHeight: 22,
   },
   alertButton: {
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 30,
      marginTop: 10,
   },
   alertButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
   },

   // Updated Country Code Modal Styles
   modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
   },
   modalContainer: {
      backgroundColor: '#fff',
      height: '50%',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
   },
   searchContainer: {
      paddingHorizontal: 16,
      marginVertical: 12,
   },
   searchInput: {
      height: 50,
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      paddingLeft: 44,
      fontSize: 16,
      color: '#333',
   },
   countryList: {
      paddingBottom: 20,
      flexGrow: 1,
   },

   searchIcon: {
      position: 'absolute',
      left: 28,
      top: 15,
      zIndex: 1,
   },
   countryCodeItem: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: '#f5f5f5',
   },
   countryCodeText: {
      fontSize: 16,
      color: '#333',
   },
});

export default Login;