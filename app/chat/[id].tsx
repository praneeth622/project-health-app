import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Send, 
  Smile, 
  Plus, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Users,
  Info,
  Heart,
  Reply,
  Pin
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  isOwn: boolean;
  type: 'text' | 'image' | 'system';
  reactions?: Array<{ emoji: string; count: number; users: string[] }>;
  isLiked?: boolean;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
}

interface ChatInfo {
  id: string;
  name: string;
  avatar: string;
  type: 'direct' | 'group';
  isOnline?: boolean;
  lastActive?: string;
  memberCount?: number;
  members?: Array<{ id: string; name: string; avatar: string; isOnline: boolean }>;
}

// Mock data
const mockChatInfo: ChatInfo = {
  id: '1',
  name: 'Tillie Larson',
  avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
  type: 'direct',
  isOnline: true,
  lastActive: '2 minutes ago',
};

const mockGroupChatInfo: ChatInfo = {
  id: '2',
  name: 'Morning Yoga Warriors',
  avatar: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
  type: 'group',
  memberCount: 1247,
  members: [
    { id: '1', name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', isOnline: true },
    { id: '2', name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg', isOnline: false },
    { id: '3', name: 'Emma Wilson', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', isOnline: true },
  ],
};

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! How was your yoga session today?',
    senderId: '2',
    senderName: 'Tillie Larson',
    senderAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
    timestamp: '10:30 AM',
    isOwn: false,
    type: 'text',
  },
  {
    id: '2',
    text: 'It was amazing! We did some really challenging poses today. My flexibility is definitely improving 🧘‍♀️',
    senderId: '1',
    senderName: 'You',
    senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    timestamp: '10:32 AM',
    isOwn: true,
    type: 'text',
    reactions: [{ emoji: '👍', count: 1, users: ['2'] }],
  },
  {
    id: '3',
    text: 'That\'s great to hear! I\'ve been thinking about joining a yoga class myself. Any recommendations?',
    senderId: '2',
    senderName: 'Tillie Larson',
    senderAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
    timestamp: '10:35 AM',
    isOwn: false,
    type: 'text',
  },
  {
    id: '4',
    text: 'I\'d definitely recommend checking out the Morning Yoga Warriors group! They have sessions for all levels',
    senderId: '1',
    senderName: 'You',
    senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    timestamp: '10:37 AM',
    isOwn: true,
    type: 'text',
    replyTo: {
      id: '3',
      text: 'Any recommendations?',
      senderName: 'Tillie Larson',
    },
  },
  {
    id: '5',
    text: 'Perfect! I\'ll look into it. Thanks for the suggestion! 💪',
    senderId: '2',
    senderName: 'Tillie Larson',
    senderAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
    timestamp: '10:40 AM',
    isOwn: false,
    type: 'text',
    isLiked: true,
  },
];

const mockGroupMessages: Message[] = [
  {
    id: '1',
    text: 'Good morning everyone! Ready for today\'s session? 🌅',
    senderId: '2',
    senderName: 'Sarah Johnson',
    senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    timestamp: '6:00 AM',
    isOwn: false,
    type: 'text',
    reactions: [
      { emoji: '🔥', count: 5, users: ['1', '3', '4', '5', '6'] },
      { emoji: '💪', count: 3, users: ['1', '7', '8'] },
    ],
  },
  {
    id: '2',
    text: 'I\'m so ready! Been looking forward to this all week',
    senderId: '1',
    senderName: 'You',
    senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    timestamp: '6:02 AM',
    isOwn: true,
    type: 'text',
  },
  {
    id: '3',
    text: 'Same here! Let\'s crush it today 💯',
    senderId: '3',
    senderName: 'Mike Chen',
    senderAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg',
    timestamp: '6:03 AM',
    isOwn: false,
    type: 'text',
  },
  {
    id: '4',
    text: 'Emma Wilson joined the group',
    senderId: 'system',
    senderName: 'System',
    senderAvatar: '',
    timestamp: '6:05 AM',
    isOwn: false,
    type: 'system',
  },
  {
    id: '5',
    text: 'Welcome Emma! Excited to have you join our morning sessions 🧘‍♀️',
    senderId: '2',
    senderName: 'Sarah Johnson',
    senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    timestamp: '6:06 AM',
    isOwn: false,
    type: 'text',
  },
];

export default function ChatScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Determine chat type based on ID or passed parameters
    const isGroupChat = id === '2' || id === 'group';
    
    if (isGroupChat) {
      setChatInfo(mockGroupChatInfo);
      setMessages(mockGroupMessages);
    } else {
      setChatInfo(mockChatInfo);
      setMessages(mockMessages);
    }
  }, [id]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      senderId: '1',
      senderName: 'You',
      senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      type: 'text',
      replyTo: replyTo ? {
        id: replyTo.id,
        text: replyTo.text,
        senderName: replyTo.senderName,
      } : undefined,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    setReplyTo(null);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleMessageLongPress = (message: Message) => {
    if (message.type === 'system') return;

    Alert.alert(
      'Message Actions',
      '',
      [
        { text: 'Reply', onPress: () => setReplyTo(message) },
        { text: 'React', onPress: () => handleReaction(message.id, '❤️') },
        { text: 'Copy', onPress: () => Alert.alert('Copied', 'Message copied to clipboard') },
        ...(message.isOwn ? [{ text: 'Delete', style: 'destructive' as const, onPress: () => handleDeleteMessage(message.id) }] : []),
        { text: 'Cancel', style: 'cancel' as const },
      ]
    );
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            if (existingReaction.users.includes('1')) {
              // Remove reaction
              const updatedReactions = reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== '1') }
                  : r
              ).filter(r => r.count > 0);
              return { ...msg, reactions: updatedReactions };
            } else {
              // Add reaction
              return {
                ...msg,
                reactions: reactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, count: r.count + 1, users: [...r.users, '1'] }
                    : r
                ),
              };
            }
          } else {
            // New reaction
            return {
              ...msg,
              reactions: [...reactions, { emoji, count: 1, users: ['1'] }],
            };
          }
        }
        return msg;
      })
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };
  const handleChatInfo = () => {
    if (chatInfo?.type === 'group') {
      router.push({ pathname: '/groups/members/[id]', params: { id: chatInfo.id } });
    } else {
      Alert.alert('User Profile', 'User profile would be shown here');
    }
  };

  const handleCall = (type: 'voice' | 'video') => {
    Alert.alert(`${type === 'voice' ? 'Voice' : 'Video'} Call`, `Starting ${type} call with ${chatInfo?.name}`);
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    chatInfoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    chatAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 12,
    },
    chatDetails: {
      flex: 1,
    },
    chatName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    chatStatus: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    headerButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messagesContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    messageContainer: {
      marginVertical: 4,
    },
    ownMessage: {
      alignItems: 'flex-end',
    },
    otherMessage: {
      alignItems: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      marginBottom: 4,
    },
    ownBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: 4,
    },
    otherBubble: {
      backgroundColor: colors.surfaceVariant,
      borderBottomLeftRadius: 4,
    },
    systemBubble: {
      backgroundColor: colors.surfaceVariant + '50',
      alignSelf: 'center',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 12,
      marginVertical: 8,
    },
    messageText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      lineHeight: 18,
    },
    ownMessageText: {
      color: colors.background,
    },
    otherMessageText: {
      color: colors.text,
    },
    systemMessageText: {
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
    },
    messageInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    senderName: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginRight: 8,
    },
    messageTime: {
      fontSize: 10,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
      marginTop: 2,
    },
    replyContainer: {
      backgroundColor: colors.background + '20',
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginBottom: 4,
      borderRadius: 8,
    },
    replyText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    replySender: {
      fontSize: 10,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
      marginBottom: 2,
    },
    reactionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 4,
      gap: 4,
    },
    reactionBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 12,
    },
    reactionEmoji: {
      fontSize: 12,
      marginRight: 2,
    },
    reactionCount: {
      fontSize: 10,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    inputContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    replyPreview: {
      backgroundColor: colors.surfaceVariant,
      padding: 8,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    replyPreviewContent: {
      flex: 1,
    },
    replyPreviewText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    closeReplyButton: {
      padding: 4,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    textInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: 20,
      paddingHorizontal: 12,
    },
    textInput: {
      flex: 1,
      paddingVertical: 8,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      maxHeight: 100,
    },
    inputButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButton: {
      backgroundColor: colors.primary,
    },
    loadingText: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
    },
  });
  if (!chatInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatInfoContainer} onPress={handleChatInfo}>
            <Image source={{ uri: chatInfo.avatar }} style={styles.chatAvatar} />
            <View style={styles.chatDetails}>
              <Text style={styles.chatName}>{chatInfo.name}</Text>
              <Text style={styles.chatStatus}>
                {chatInfo.type === 'group' 
                  ? `${chatInfo.memberCount} members`
                  : chatInfo.isOnline ? 'Online' : `Last seen ${chatInfo.lastActive}`
                }
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            {chatInfo.type === 'direct' && (
              <>
                <TouchableOpacity style={styles.headerButton} onPress={() => handleCall('voice')}>
                  <Phone size={18} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton} onPress={() => handleCall('video')}>
                  <Video size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.headerButton} onPress={handleChatInfo}>
              {chatInfo.type === 'group' ? (
                <Users size={18} color={colors.textSecondary} />
              ) : (
                <Info size={18} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer} 
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <TouchableOpacity
              key={message.id}
              style={[
                styles.messageContainer,
                message.type === 'system' ? {} : message.isOwn ? styles.ownMessage : styles.otherMessage,
              ]}
              onLongPress={() => handleMessageLongPress(message)}
              activeOpacity={0.7}
            >
              {message.type === 'system' ? (
                <View style={styles.systemBubble}>
                  <Text style={styles.systemMessageText}>{message.text}</Text>
                </View>              ) : (
                <>
                  {!message.isOwn && chatInfo.type === 'group' && (
                    <View style={styles.messageInfo}>
                      <Text style={styles.senderName}>{message.senderName}</Text>
                    </View>
                  )}
                  <View style={[
                    styles.messageBubble,
                    message.isOwn ? styles.ownBubble : styles.otherBubble,
                  ]}>
                    {message.replyTo && (
                      <View style={styles.replyContainer}>
                        <Text style={styles.replySender}>{message.replyTo.senderName}</Text>
                        <Text style={styles.replyText} numberOfLines={1}>{message.replyTo.text}</Text>
                      </View>
                    )}
                    <Text style={[
                      styles.messageText,
                      message.isOwn ? styles.ownMessageText : styles.otherMessageText,
                    ]}>
                      {message.text}
                    </Text>
                  </View>
                  {message.reactions && message.reactions.length > 0 && (
                    <View style={styles.reactionsContainer}>
                      {message.reactions.map((reaction, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.reactionBubble}
                          onPress={() => handleReaction(message.id, reaction.emoji)}
                        >
                          <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                          <Text style={styles.reactionCount}>{reaction.count}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <Text style={[styles.messageTime, message.isOwn ? { textAlign: 'right' } : {}]}>
                    {message.timestamp}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          {replyTo && (
            <View style={styles.replyPreview}>
              <View style={styles.replyPreviewContent}>
                <Text style={[styles.replySender, { color: colors.primary }]}>
                  Replying to {replyTo.senderName}
                </Text>
                <Text style={styles.replyPreviewText} numberOfLines={1}>
                  {replyTo.text}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeReplyButton} onPress={() => setReplyTo(null)}>
                <Text style={{ color: colors.textSecondary, fontSize: 18 }}>×</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.inputButton}>
              <Plus size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor={colors.textTertiary}
                value={messageText}
                onChangeText={setMessageText}
                multiline
              />
              <TouchableOpacity style={styles.inputButton}>
                <Smile size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.inputButton, styles.sendButton]} 
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send size={18} color={colors.background} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
