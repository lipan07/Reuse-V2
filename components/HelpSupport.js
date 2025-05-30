import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const scale = width / 375;
const verticalScale = height / 812;
const normalize = (size) => Math.round(scale * size);
const normalizeVertical = (size) => Math.round(verticalScale * size);

const HelpSupport = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [issue, setIssue] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!name || !phone || !message) {
            Alert.alert('Missing Fields', 'Please fill out all required fields.');
            return;
        }
        Alert.alert('Support Request Sent', 'Our team will get back to you shortly.');
        setName('');
        setPhone('');
        setIssue('');
        setMessage('');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Modern Header */}
            <LinearGradient
                colors={['#0d6efd', '#0b5ed7']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.headerContent}>
                    <Icon name="support-agent" size={normalize(24)} color="#fff" />
                    <Text style={styles.title}>Help Center</Text>
                </View>
            </LinearGradient>

            <Text style={styles.description}>
                Need help using Reuse? Whether you're buying or selling new or used items like mobiles, bikes, flats,
                electronics, services, or machinery — we're here to help!
            </Text>

            <View style={styles.card}>
                <View style={styles.sectionHeader}>
                    <Icon name="help-outline" size={normalize(20)} color="#0d6efd" />
                    <Text style={styles.sectionTitle}>Common Questions</Text>
                </View>

                <View style={styles.questionContainer}>
                    <Icon name="help" size={normalize(16)} color="#0d6efd" style={styles.icon} />
                    <View style={styles.textWrapper}>
                        <Text style={styles.question}>How do I post an ad?</Text>
                        <Text style={styles.answer}>Go to the 'Sell' tab and follow the steps to upload product details and images.</Text>
                    </View>
                </View>

                <View style={styles.questionContainer}>
                    <Icon name="help" size={normalize(16)} color="#0d6efd" style={styles.icon} />
                    <View style={styles.textWrapper}>
                        <Text style={styles.question}>Is it free to post ads?</Text>
                        <Text style={styles.answer}>Yes! Posting on Reuse is 100% free for everyone.</Text>
                    </View>
                </View>

                <View style={styles.questionContainer}>
                    <Icon name="help" size={normalize(16)} color="#0d6efd" style={styles.icon} />
                    <View style={styles.textWrapper}>
                        <Text style={styles.question}>What if I get scammed?</Text>
                        <Text style={styles.answer}>
                            Reuse encourages face-to-face deals in safe locations. If you suspect fraud, report the user immediately.
                        </Text>
                    </View>
                </View>

                <View style={styles.questionContainer}>
                    <Icon name="warning" size={normalize(16)} color="#dc3545" style={styles.icon} />
                    <View style={styles.textWrapper}>
                        <Text style={[styles.question, styles.warning]}>Should I pay in advance before receiving the product?</Text>
                        <Text style={styles.answer}>
                            ❌ No. Reuse strongly advises users never to pay any advance money before inspecting and receiving the product.
                            Always meet in person and verify the item before making any payment.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.sectionHeader}>
                    <Icon name="contact-support" size={normalize(20)} color="#0d6efd" />
                    <Text style={styles.sectionTitle}>Still Need Help?</Text>
                </View>

                <Text style={styles.description}>
                    Fill out the form below and our support team will get in touch with you within 24 hours.
                </Text>

                <View style={styles.inputContainer}>
                    <Icon name="person" size={normalize(18)} color="#6c757d" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Your Name"
                        placeholderTextColor="#adb5bd"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="phone" size={normalize(18)} color="#6c757d" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor="#adb5bd"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="info" size={normalize(18)} color="#6c757d" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Issue Type (optional)"
                        placeholderTextColor="#adb5bd"
                        value={issue}
                        onChangeText={setIssue}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="message" size={normalize(18)} color="#6c757d" style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: normalizeVertical(12) }]} />
                    <TextInput
                        placeholder="Describe your issue"
                        placeholderTextColor="#adb5bd"
                        value={message}
                        onChangeText={setMessage}
                        style={[styles.input, styles.messageInput]}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Submit Request</Text>
                    <Icon name="send" size={normalize(16)} color="#fff" style={styles.buttonIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.contactInfo}>
                <View style={styles.sectionHeader}>
                    <Icon name="alternate-email" size={normalize(20)} color="#0d6efd" />
                    <Text style={styles.contactTitle}>Other Ways to Reach Us</Text>
                </View>

                <View style={styles.contactRow}>
                    <Icon name="email" size={normalize(16)} color="#0d6efd" />
                    <Text style={styles.contactText}>support@reuse.com</Text>
                </View>
                <View style={styles.contactRow}>
                    <Icon name="phone" size={normalize(16)} color="#0d6efd" />
                    <Text style={styles.contactText}>+1 (800) 123-4567</Text>
                </View>
                <View style={styles.contactRow}>
                    <Icon name="forum" size={normalize(16)} color="#0d6efd" />
                    <Text style={styles.contactText}>Live Chat (available 24/7)</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: normalize(14),
        backgroundColor: '#f8f9fa',
        paddingBottom: normalizeVertical(30),
    },
    header: {
        borderRadius: normalize(12),
        marginBottom: normalizeVertical(16),
        marginTop: normalizeVertical(6),
        overflow: 'hidden',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: normalize(14),
    },
    title: {
        fontSize: normalize(20),
        fontWeight: '700',
        color: '#fff',
        marginLeft: normalize(10),
    },
    description: {
        fontSize: normalize(14),
        color: '#495057',
        marginBottom: normalizeVertical(18),
        fontWeight: '400',
        lineHeight: normalizeVertical(20),
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: normalize(12),
        padding: normalize(14),
        marginBottom: normalizeVertical(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalizeVertical(14),
    },
    sectionTitle: {
        fontSize: normalize(16),
        fontWeight: '600',
        color: '#212529',
        marginLeft: normalize(8),
    },
    questionContainer: {
        flexDirection: 'row',
        marginBottom: normalizeVertical(16),
        alignItems: 'flex-start',
    },
    icon: {
        marginRight: normalize(10),
        marginTop: normalizeVertical(3),
    },
    textWrapper: {
        flex: 1,
    },
    question: {
        fontWeight: '500',
        fontSize: normalize(14),
        marginBottom: normalizeVertical(4),
        color: '#212529',
    },
    warning: {
        color: '#dc3545',
    },
    answer: {
        fontSize: normalize(13),
        color: '#6c757d',
        lineHeight: normalizeVertical(18),
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: normalizeVertical(12),
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: normalize(12),
        top: normalize(12),
        zIndex: 1,
    },
    input: {
        flex: 1,
        height: normalizeVertical(44),
        backgroundColor: '#f8f9fa',
        borderRadius: normalize(10),
        paddingHorizontal: normalize(40),
        fontSize: normalize(13),
        borderColor: '#dee2e6',
        borderWidth: 1,
        color: '#212529',
    },
    messageInput: {
        height: normalizeVertical(100),
        paddingTop: normalizeVertical(12),
        paddingHorizontal: normalize(40),
    },
    button: {
        backgroundColor: '#0d6efd',
        paddingVertical: normalizeVertical(12),
        borderRadius: normalize(10),
        alignItems: 'center',
        marginTop: normalizeVertical(8),
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#0d6efd',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: normalize(14),
    },
    buttonIcon: {
        marginLeft: normalize(6),
    },
    contactInfo: {
        backgroundColor: '#fff',
        borderRadius: normalize(12),
        padding: normalize(16),
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    contactTitle: {
        fontSize: normalize(16),
        fontWeight: '600',
        color: '#212529',
        marginLeft: normalize(8),
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalizeVertical(10),
        paddingLeft: normalize(4),
    },
    contactText: {
        fontSize: normalize(14),
        color: '#495057',
        marginLeft: normalize(10),
    },
});

export default HelpSupport;