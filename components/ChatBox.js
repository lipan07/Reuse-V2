import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { addEventListener, removeEventListener } from 'react-native-event-listeners';
import { createEcho } from '../service/echo';

import {
  BannerAd,
  BannerAdSize,
  TestIds,
  AppOpenAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.G_BANNER_AD_UNIT_ID;

const ChatBox = ({ route }) => {
  const { sellerId, buyerId, postId, chatId: existingChatId } = route.params;
  const [chatId, setChatId] = useState(existingChatId || null);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [channel, setChannel] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  useEffect(() => {
    let echoInstance;
    let channelInstance;

    const setupEcho = async () => {

      const userId = await AsyncStorage.getItem('userId');
      if (!chatId || !userId) {
        console.log('Echo setup skipped: missing chatId or loggedInUserId', { chatId, userId });
        return;
      }

      try {
        echoInstance = await createEcho();
        console.log('Echo instance created:', echoInstance);

        channelInstance = echoInstance.channel(`chat.${chatId}`);
        setChannel(channelInstance);
        console.log(`Subscribed to channel: chat.${chatId}`);

        channelInstance.listen('.MessageSent', (data) => {
          setChatHistory(prev => {
            // Check if the message already exists by its unique id
            if (prev.some(msg => msg.id === data.id)) {
              return prev; // Don't add duplicate
            }
            return [...prev, data];
          });
        });

        channelInstance.listen('.MessageSeen', (data) => {
          console.log('Received MessageSeen event:', data);
          updateMessageStatus(data.id);
        });

        channelInstance.error((error) => {
          console.log('Channel error:', error);
        });
      } catch (err) {
        console.log('Error setting up Echo:', err);
      }
    };

    setupEcho();

    return () => {
      if (echoInstance && channelInstance) {
        echoInstance.leave(`chat.${chatId}`);
        console.log(`Left channel: chat.${chatId}`);
      }
    };
  }, [chatId, loggedInUserId]);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      console.log('Fetched logged in user ID:', userId);
      setLoggedInUserId(userId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchChatMessages(chatId);
    } else {
      openChat(sellerId, buyerId, postId);
    }
  }, [chatId]);

  const fetchChatMessages = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${process.env.BASE_URL}/chats/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Fetched chat messages:', data);

      // Set messages if available
      setChatHistory(data.chats);


    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };


  const openChat = async (sellerId, buyerId, postId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${process.env.BASE_URL}/open-chat`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ seller_id: sellerId, buyer_id: buyerId, post_id: postId }),
      });
      const data = await response.json();
      setChatId(data.chat.id);
      setChatHistory(data.messages);
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };

  const handleSend = async (message) => {
    message = message.trim();
    if (!message) return;
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Sending message:', message, 'to chat:', chatId);
      const response = await fetch(`${process.env.BASE_URL}/send-message`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ chat_id: chatId, message: message }),
      });
      const data = await response.json();
      console.log('Send message response:', data);
      setInputText('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleMessageOption = (message) => {
    if (message.trim()) {
      handleSend(message);
    }
  };

  const handleMessageText = () => {
    handleSend(inputText); // Pass the input text value to handleSend
  };

  const handleSeeMessage = async (messageID) => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      console.log(`${process.env.BASE_URL}/messages/${messageID}/seen`);
      const response = await fetch(`${process.env.BASE_URL}/messages/${messageID}/seen`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageID: messageID }),
      });

      updateMessageStatus(messageID);
    } catch (error) {
      console.error("Failed to mark message as seen:", error);
    }
  };

  const updateMessageStatus = (messageId) => {
    console.log(`Updating message ${messageId} to seen status 1`);
    setChatHistory(prev => {
      const newMessages = prev.map(msg =>
        msg.id === messageId ? { ...msg, is_seen: 1 } : msg
      );
      console.log('newMessages - ', newMessages);
      return newMessages;
    });
  };
  useEffect(() => {
    // Function to mark messages as seen
    const markMessagesAsSeen = async () => {
      // Find all messages that are not marked as seen
      const unseenMessages = chatHistory.filter(msg => msg.user_id !== loggedInUserId && msg.is_seen !== 1);
      unseenMessages.forEach(message => {
        handleSeeMessage(message.id);
      });
    };

    markMessagesAsSeen();
  }, [chatHistory]);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 100}
    >

      {/* <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} /> */}

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatHistory} keyboardShouldPersistTaps='handled'>
        {chatHistory.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.user_id === loggedInUserId ? styles.messageRight : styles.messageLeft,
            ]}
          >
            <Text style={styles.messageText}>{message.message}</Text>
            <View style={styles.timeTickRow}>
              <Text style={styles.timeText}>
                {message.created_at
                  ? moment.utc(message.created_at).local().format('hh:mm A')
                  : ''}
              </Text>

              {message.user_id === loggedInUserId && <MessageTick status={message.is_seen} />}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, Platform.OS === 'ios' && { marginBottom: 20 }]}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleMessageText}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const MessageTick = ({ status }) => {
  switch (status) {
    case 1:
      return <Text style={styles.tickTextBlue}>✔✔</Text>;
    default:
      return <Text style={styles.tickText}>✔</Text>;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f0f7',
  },
  chatHistory: { padding: 20 },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  messageLeft: {
    backgroundColor: '#89bed6',
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14, // increased padding
    paddingHorizontal: 14, // increased padding
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    marginBottom: 16, // add margin to lift it up
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 14, // increased height
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#fff',
    fontSize: 16, // slightly larger text
  },
  sendButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageText: {
    color: '#fff',
    fontSize: 17, // make message text bigger
  },
  timeText: {
    color: '#eee',
    fontSize: 11, // make time smaller
    marginRight: 4,
  },
  tickText: {
    color: '#eee',
    fontSize: 11, // make tick smaller
  },
  tickTextBlue: {
    color: '#4fc3f7',
    fontSize: 11, // make tick smaller
  },
  timeTickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4, // space between message and time/tick
    marginLeft: 2,
  },
});

export default ChatBox;