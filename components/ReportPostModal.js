import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const ReportPostModal = ({ visible, onClose, postId }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        // Implement your report logic here (API call, etc.)
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Report Post</Text>
                    <Text style={styles.label}>Reason for reporting:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Describe the issue..."
                        value={reason}
                        onChangeText={setReason}
                        multiline
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '85%',
        elevation: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        color: '#e74c3c',
        textAlign: 'center',
    },
    label: {
        fontSize: 15,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        minHeight: 100,
        marginBottom: 18,
        fontSize: 15,
        color: '#222',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        marginRight: 16,
    },
    cancelText: {
        color: '#888',
        fontWeight: '600',
        fontSize: 15,
    },
    submitButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    submitText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});

export default ReportPostModal;
