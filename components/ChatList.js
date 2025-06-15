import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNavBar from './BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { createEcho } from '../service/echo';

const { width, height } = Dimensions.get('window');
const scale = width / 375;
const verticalScale = height / 812;
const normalize = (size) => Math.round(scale * size);
const normalizeVertical = (size) => Math.round(verticalScale * size);

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);


  useEffect(() => {
    let echoInstance;
    let channelInstances = [];

    const setupEcho = async () => {
      echoInstance = await createEcho();

      // Subscribe to all chat channels in the list
      chats.forEach(chat => {
        const channel = echoInstance.channel(`chat.${chat.id}`);

        // Listen for new messages
        channel.listen('.MessageSent', (data) => {
          console.log('last message data:', data);
          setChats(prevChats =>
            prevChats.map(c =>
              c.id === chat.id
                ? {
                  ...c,
                  last_message: data,
                }
                : c
            )
          );
        });

        // Listen for seen updates
        channel.listen('.MessageSeen', (data) => {
          setChats(prevChats =>
            prevChats.map(c =>
              c.id === chat.id && c.last_message?.id === data.id
                ? {
                  ...c,
                  last_message: {
                    ...c.last_message,
                    is_seen: 1,
                  },
                }
                : c
            )
          );
        });

        channelInstances.push(channel);
      });
    };

    if (chats.length > 0) {
      setupEcho();
    }

    return () => {
      // Leave all channels on unmount
      if (echoInstance && channelInstances.length) {
        channelInstances.forEach((channel, idx) => {
          echoInstance.leave(`chat.${chats[idx].id}`);
        });
      }
    };
  }, [chats]);
  useEffect(() => {
    getAllChat();
  }, []);

  const getAllChat = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${process.env.BASE_URL}/chats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setChats(data.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <ActivityIndicator
        size="large"
        color="#007BFF"
        style={styles.loadingIndicator}
      />
    );
  };
  const formatTimeAgo = (utcDate) => {
    const localTime = moment.utc(utcDate).local(); // Convert to local
    const now = moment();

    const diffMins = now.diff(localTime, 'minutes');
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = now.diff(localTime, 'hours');
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = now.diff(localTime, 'days');
    return `${diffDays}d ago`;
  };

  const renderChatItem = ({ item: chat }) => {
    const postImage =
      chat.post?.image?.url ||
      'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

    const isSeen = chat.last_message?.is_seen === 1;

    return (
      <TouchableOpacity
        style={[
          styles.chatCard,
          !isSeen && styles.highlightedCard // highlight if not seen
        ]}
        onPress={() => navigation.navigate('ChatBox', {
          chatId: chat.id,
          sellerId: chat.seller_id,
          buyerId: chat.buyer_id,
          postId: chat.post_id,
        })}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: postImage }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text
              style={[
                styles.chatTitle,
                isSeen ? styles.dimmedText : styles.highlightedText
              ]}
              numberOfLines={1}
            >
              {chat.post.title}
            </Text>
            <Text
              style={[
                styles.chatTime,
                isSeen ? styles.dimmedText : styles.highlightedText
              ]}
            >
              {chat.last_message?.created_at
                ? formatTimeAgo(chat.last_message.created_at)
                : ''}
            </Text>
          </View>

          {chat.last_message?.message && (
            <View style={styles.chatDetails}>
              <MaterialIcons name="chat" size={normalize(14)} color={isSeen ? "#b0b0b0" : "#666"} />
              <Text
                style={[
                  styles.chatUser,
                  isSeen ? styles.dimmedText : styles.highlightedText
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {chat.last_message.message}
              </Text>
              {typeof chat.last_message.is_seen !== 'undefined' && (
                <MaterialIcons
                  name={chat.last_message.is_seen ? 'done-all' : 'done'}
                  size={normalize(14)}
                  color={chat.last_message.is_seen ? '#4fc3f7' : '#999'}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
          )}

          <View style={styles.chatDetails}>
            <MaterialIcons name="person" size={normalize(14)} color={isSeen ? "#b0b0b0" : "#666"} />
            <Text
              style={[
                styles.chatUser,
                isSeen ? styles.dimmedText : styles.highlightedText
              ]}
              numberOfLines={1}
            >
              {chat.buyer.name}
            </Text>
          </View>
        </View>

        <MaterialIcons name="chevron-right" size={normalize(20)} color={isSeen ? "#b0b0b0" : "#999"} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(chat) => chat.id.toString()} // Added toString() for safety
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyState}>
              <MaterialIcons name="forum" size={normalize(60)} color="#007BFF" />
              <Text style={styles.emptyTitle}>
                {isError ? 'Connection Error' : 'No Chats Yet'}
              </Text>
              <Text style={styles.emptyText}>
                {isError ?
                  'Failed to load conversations. Please check your connection.' :
                  'Start a conversation by contacting sellers about their items!'
                }
              </Text>
              {isError && (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={getAllChat}
                  activeOpacity={0.7}
                >
                  <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
      />
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContainer: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalizeVertical(16),
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    padding: normalize(16),
    marginBottom: normalizeVertical(12),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: normalize(12),
  },
  avatar: {
    width: normalize(72),      // increased from 48
    height: normalize(72),     // increased from 48
    borderRadius: normalize(10), // slightly more rounding for a modern card look
    backgroundColor: '#f0f0f0',
    resizeMode: 'cover',
  },
  chatContent: {
    flex: 1,
    marginRight: normalize(12),
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalizeVertical(4),
  },
  chatTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#2D3436',
    maxWidth: '70%',
  },
  chatTime: {
    fontSize: normalize(12),
    color: '#999999',
  },
  chatDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalizeVertical(4),
  },
  chatUser: {
    fontSize: normalize(14),
    color: '#666666',
    marginLeft: normalize(6),
    maxWidth: '80%',
  },
  chatLocation: {
    fontSize: normalize(12),
    color: '#999999',
    marginLeft: normalize(6),
    maxWidth: '80%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(24),
    marginTop: normalizeVertical(100),
  },
  emptyTitle: {
    fontSize: normalize(20),
    fontWeight: '600',
    color: '#2D3436',
    marginVertical: normalizeVertical(12),
  },
  emptyText: {
    fontSize: normalize(14),
    color: '#666666',
    textAlign: 'center',
    lineHeight: normalizeVertical(20),
  },
  retryButton: {
    marginTop: normalizeVertical(20),
    backgroundColor: '#007BFF',
    paddingHorizontal: normalize(24),
    paddingVertical: normalizeVertical(12),
    borderRadius: normalize(8),
  },
  retryText: {
    color: 'white',
    fontWeight: '500',
    fontSize: normalize(14),
  },
  loadingIndicator: {
    marginVertical: normalizeVertical(20),
  },
  highlightedCard: {
    // backgroundColor: '#FFF8E1', // light yellow for unread
  },
  dimmedText: {
    color: '#b0b0b0',
  },
  highlightedText: {
    color: '#2D3436',
    fontWeight: 'bold',
  },
});

export default ChatList;