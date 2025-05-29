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
            <View style={styles.header}>
                <Icon name="support-agent" size={normalize(28)} color="#fff" />
                <Text style={styles.title}>Help & Support</Text>
            </View>

            <Text style={styles.description}>
                Need help using Reuse? Whether you're buying or selling new or used items like mobiles, bikes, flats,
                electronics, services, or machinery — we're here to help!
            </Text>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Common Questions</Text>

                <View style={styles.questionContainer}>
                    <Icon name="help" size={normalize(18)} color="#0984e3" style={styles.icon} />
                    <View style={styles.textWrapper}>
                        <Text style={styles.question}>How do I post an ad?</Text>
                        <Text style={styles.answer}>Go to the 'Sell' tab and follow the steps to upload product details and images.</Text>
                    </View>
                </View>

                <View style={styles.questionContainer}>
                    <Icon name="help" size={normalize(18)} color="#0984e3" style={styles.icon} />
                    <View style={styles.textWrapper}>
                        <Text style={styles.question}>Is it free to post ads?</Text>
                        <Text style={styles.answer}>Yes! Posting on Reuse is 100% free for everyone.</Text>
                    </View>
                </View>

                <View style={styles.questionContainer}>
                    <Icon name="help" size={normalize(18)} color="#0984e3" style={styles.icon} />
                    <View style={styles.textWrapper}>
                        <Text style={styles.question}>What if I get scammed?</Text>
                        <Text style={styles.answer}>
                            Reuse encourages face-to-face deals in safe locations. If you suspect fraud, report the user immediately.
                        </Text>
                    </View>
                </View>

                <View style={styles.questionContainer}>
                    <Icon name="warning" size={normalize(18)} color="#e74c3c" style={styles.icon} />
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
                <Text style={styles.sectionTitle}>Still Need Help?</Text>
                <Text style={styles.description}>
                    Fill out the form below and our support team will get in touch with you within 24 hours.
                </Text>

                <View style={styles.inputContainer}>
                    <Icon name="person" size={normalize(20)} color="#7f8c8d" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Your Name"
                        placeholderTextColor="#95a5a6"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="phone" size={normalize(20)} color="#7f8c8d" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor="#95a5a6"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="info" size={normalize(20)} color="#7f8c8d" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Issue Type (optional)"
                        placeholderTextColor="#95a5a6"
                        value={issue}
                        onChangeText={setIssue}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="message" size={normalize(20)} color="#7f8c8d" style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: normalizeVertical(12) }]} />
                    <TextInput
                        placeholder="Describe your issue"
                        placeholderTextColor="#95a5a6"
                        value={message}
                        onChangeText={setMessage}
                        style={[styles.input, styles.messageInput]}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Submit Request</Text>
                    <Icon name="send" size={normalize(18)} color="#fff" style={styles.buttonIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Other Ways to Reach Us</Text>
                <View style={styles.contactRow}>
                    <Icon name="email" size={normalize(18)} color="#0984e3" />
                    <Text style={styles.contactText}>support@reuse.com</Text>
                </View>
                <View style={styles.contactRow}>
                    <Icon name="phone" size={normalize(18)} color="#0984e3" />
                    <Text style={styles.contactText}>+1 (800) 123-4567</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: normalize(16),
        backgroundColor: '#f8f9fa',
        paddingBottom: normalizeVertical(30),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0984e3',
        padding: normalize(16),
        borderRadius: normalize(12),
        marginBottom: normalizeVertical(20),
        marginTop: normalizeVertical(10),
    },
    title: {
        fontSize: normalize(24),
        fontWeight: '800',
        color: '#fff',
        marginLeft: normalize(12),
    },
    description: {
        fontSize: normalize(16),
        color: '#57606f',
        marginBottom: normalizeVertical(24),
        fontWeight: '400',
        lineHeight: normalizeVertical(22),
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: normalize(16),
        padding: normalize(10),
        marginBottom: normalizeVertical(24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: normalize(20),
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: normalizeVertical(16),
    },
    questionContainer: {
        flexDirection: 'row',
        marginBottom: normalizeVertical(20),
        alignItems: 'flex-start',
    },
    icon: {
        marginRight: normalize(12),
        marginTop: normalizeVertical(4),
    },
    textWrapper: {
        flex: 1,
        flexWrap: 'wrap',
        maxWidth: '90%',
    },
    question: {
        fontWeight: '600',
        fontSize: normalize(16),
        marginBottom: normalizeVertical(6),
        color: '#2d3436',
    },
    warning: {
        color: '#e74c3c',
    },
    answer: {
        fontSize: normalize(15),
        color: '#636e72',
        lineHeight: normalizeVertical(22),
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: normalizeVertical(16),
    },
    inputIcon: {
        position: 'absolute',
        left: normalize(14),
        top: normalize(14),
        zIndex: 1,
    },
    input: {
        flex: 1,
        height: normalizeVertical(50),
        backgroundColor: '#f8f9fa',
        borderRadius: normalize(12),
        paddingHorizontal: normalize(46),
        fontSize: normalize(15),
        borderColor: '#e0e0e0',
        borderWidth: 1,
        color: '#2d3436',
    },
    messageInput: {
        height: normalizeVertical(120),
        paddingTop: normalizeVertical(16),
        paddingHorizontal: normalize(46),
    },
    button: {
        backgroundColor: '#0984e3',
        paddingVertical: normalizeVertical(16),
        borderRadius: normalize(12),
        alignItems: 'center',
        marginTop: normalizeVertical(10),
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: normalize(16),
    },
    buttonIcon: {
        marginLeft: normalize(8),
    },
    contactInfo: {
        backgroundColor: '#fff',
        borderRadius: normalize(16),
        padding: normalize(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    contactTitle: {
        fontSize: normalize(18),
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: normalizeVertical(16),
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalizeVertical(12),
    },
    contactText: {
        fontSize: normalize(16),
        color: '#57606f',
        marginLeft: normalize(12),
    },
    questionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: normalizeVertical(20),
        flexWrap: 'nowrap',
        // paddingRight: normalize(4),
    },

    textWrapper: {
        flex: 1,
        flexShrink: 1,
    },

    answer: {
        fontSize: normalize(15),
        color: '#636e72',
        lineHeight: normalizeVertical(22),
        flexWrap: 'wrap',
    },

});

export default HelpSupport;
