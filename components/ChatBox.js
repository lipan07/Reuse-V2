import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import echo from '../service/echo';

const ChatBox = ({ route }) => {
  const { sellerId, buyerId, postId, chatId: existingChatId } = route.params;
  const [chatId, setChatId] = useState(existingChatId || null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const scrollViewRef = useRef();

  console.log({
    REVERB_APP_KEY: process.env.REVERB_APP_KEY,
    REVERB_HOST: process.env.REVERB_HOST,
    REVERB_PORT: process.env.REVERB_PORT,
    BASE_URL: process.env.BASE_URL
  });

  // Initialize user and chat
  useEffect(() => {
    const initialize = async () => {
      const user = await AsyncStorage.getItem('userId');
      setUserId(user);

      if (!chatId) {
        await openChat(sellerId, buyerId, postId);
      } else {
        fetchMessages(chatId);
      }
    };

    initialize();

    return () => {
      if (chatId) {
        echo.leave(`chat.${chatId}`);
      }
    };
  }, []);

  // Laravel Reverb socket connection status
  useEffect(() => {
    try {
      echo.connector.socket.on('reverb:connected', () => {
        console.log('🎉 Reverb connected');
      });
    } catch (e) {
      console.warn('Unable to attach reverb:connected listener:', e.message);
    }
  }, []);

  // Subscribe to chat channel
  useEffect(() => {
    let channel;

    const setupChannel = async () => {
      if (!chatId) return;

      try {
        channel = echo.private(`chat.${chatId}`);

        channel
          .subscribed(() => {
            console.log(`✅ Subscribed to chat.${chatId}`);
          })
          .listen('.MessageSent', (data) => {
            console.log('📨 Message received:', data);
            setMessages(prev => [...prev, data]);
          })
          .error((error) => {
            console.error('❌ Subscription error:', error);
          });

      } catch (error) {
        console.error('❌ Channel setup error:', error);
        setTimeout(setupChannel, 1000); // Retry
      }
    };

    setupChannel();

    return () => {
      if (channel) {
        channel.stopListening('.MessageSent');
        echo.leave(`chat.${chatId}`);
      }
    };
  }, [chatId]);

  const openChat = async (sellerId, buyerId, postId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${process.env.BASE_URL}/open-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ seller_id: sellerId, buyer_id: buyerId, post_id: postId }),
      });

      const data = await response.json();
      setChatId(data.chat.id);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${process.env.BASE_URL}/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setMessages(data.chats || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const token = await AsyncStorage.getItem('authToken');
      await fetch(`${process.env.BASE_URL}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id: chatId,
          message: message
        }),
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markAsSeen = async (messageId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await fetch(`${process.env.BASE_URL}/messages/${messageId}/seen`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error marking message as seen:', error);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Mark as seen
  useEffect(() => {
    messages.forEach(msg => {
      if (!msg.is_seen && msg.user_id !== userId) {
        markAsSeen(msg.id);
      }
    });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.user_id === userId ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={msg.user_id === userId ? styles.sentText : styles.receivedText}>
              {msg.message}
            </Text>
            {msg.user_id === userId && (
              <Text style={styles.statusIcon}>
                {msg.is_seen ? '✓✓' : '✓'}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 15,
    padding: 12,
    marginVertical: 5,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
    borderBottomLeftRadius: 0,
  },
  sentText: {
    color: 'white',
  },
  receivedText: {
    color: 'black',
  },
  statusIcon: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatBox;
