import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Users, 
  UserMinus, 
  UserPlus, 
  Shield, 
  Trash2, 
  Pin, 
  Settings,
  Edit,
  Eye,
  EyeOff,
  Crown,
  Flag,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedDate: string;
  lastActive: string;
  postCount: number;
  isOnline: boolean;
}

interface PendingRequest {
  id: string;
  name: string;
  avatar: string;
  requestDate: string;
  mutualFriends: number;
}

interface ReportedContent {
  id: string;
  type: 'post' | 'comment';
  content: string;
  reportedBy: string;
  reportReason: string;
  reportDate: string;
  author: {
    name: string;
    avatar: string;
  };
}

const mockMembers: GroupMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'admin',
    joinedDate: '2023-01-15',
    lastActive: '2 minutes ago',
    postCount: 47,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'moderator',
    joinedDate: '2023-02-20',
    lastActive: '1 hour ago',
    postCount: 23,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'member',
    joinedDate: '2023-03-10',
    lastActive: '5 minutes ago',
    postCount: 12,
    isOnline: true,
  },
];

const mockPendingRequests: PendingRequest[] = [
  {
    id: '1',
    name: 'David Kim',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    requestDate: '2 hours ago',
    mutualFriends: 3,
  },
  {
    id: '2',
    name: 'Jessica Lee',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    requestDate: '1 day ago',
    mutualFriends: 7,
  },
];

const mockReportedContent: ReportedContent[] = [
  {
    id: '1',
    type: 'post',
    content: 'This workout routine is absolutely terrible and dangerous...',
    reportedBy: 'Anonymous',
    reportReason: 'Inappropriate content',
    reportDate: '1 hour ago',
    author: {
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
  },
];

export default function GroupAdminScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'members' | 'requests' | 'reports' | 'settings'>('members');
  const [members, setMembers] = useState(mockMembers);
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
  const [reportedContent, setReportedContent] = useState(mockReportedContent);
  const [groupSettings, setGroupSettings] = useState({
    requireApproval: true,
    allowMemberPosts: true,
    allowMemberInvites: false,
    showMemberList: true,
  });

  const groupInfo = {
    name: 'Morning Yoga Warriors',
    memberCount: 1247,
    visibility: 'public',
  };

  const handleMemberAction = (memberId: string, action: 'promote' | 'demote' | 'remove') => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    switch (action) {
      case 'promote':
        if (member.role === 'member') {
          setMembers(members.map(m => 
            m.id === memberId ? { ...m, role: 'moderator' } : m
          ));
          Alert.alert('Success', `${member.name} has been promoted to moderator`);
        } else if (member.role === 'moderator') {
          Alert.alert(
            'Promote to Admin',
            `Are you sure you want to make ${member.name} an admin? They will have full control over the group.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Promote', onPress: () => {
                setMembers(members.map(m => 
                  m.id === memberId ? { ...m, role: 'admin' } : m
                ));
                Alert.alert('Success', `${member.name} is now an admin`);
              }}
            ]
          );
        }
        break;
      case 'demote':
        if (member.role === 'admin') {
          setMembers(members.map(m => 
            m.id === memberId ? { ...m, role: 'moderator' } : m
          ));
          Alert.alert('Success', `${member.name} has been demoted to moderator`);
        } else if (member.role === 'moderator') {
          setMembers(members.map(m => 
            m.id === memberId ? { ...m, role: 'member' } : m
          ));
          Alert.alert('Success', `${member.name} has been demoted to member`);
        }
        break;
      case 'remove':
        Alert.alert(
          'Remove Member',
          `Are you sure you want to remove ${member.name} from the group?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => {
              setMembers(members.filter(m => m.id !== memberId));
              Alert.alert('Success', `${member.name} has been removed from the group`);
            }}
          ]
        );
        break;
    }
  };

  const handleJoinRequest = (requestId: string, action: 'approve' | 'decline') => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;

    if (action === 'approve') {
      const newMember: GroupMember = {
        id: requestId,
        name: request.name,
        avatar: request.avatar,
        role: 'member',
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just joined',
        postCount: 0,
        isOnline: true,
      };
      setMembers([...members, newMember]);
      Alert.alert('Approved', `${request.name} has been approved to join the group`);
    } else {
      Alert.alert('Declined', `${request.name}'s request has been declined`);
    }
    
    setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
  };

  const handleReportedContent = (contentId: string, action: 'approve' | 'remove') => {
    const content = reportedContent.find(c => c.id === contentId);
    if (!content) return;

    if (action === 'remove') {
      Alert.alert('Content Removed', 'The reported content has been removed');
    } else {
      Alert.alert('Content Approved', 'The reported content has been approved and will remain visible');
    }
    
    setReportedContent(reportedContent.filter(c => c.id !== contentId));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown size={16} color={colors.warning} fill={colors.warning} />;
      case 'moderator':
        return <Shield size={16} color={colors.info} />;
      default:
        return <Users size={16} color={colors.textSecondary} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return colors.warning;
      case 'moderator':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    groupInfo: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      alignItems: 'center',
    },
    groupName: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    groupMeta: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
      fontFamily: 'Inter-SemiBold',
    },
    tabContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    memberCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    memberAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    memberInfo: {
      flex: 1,
    },
    memberHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    memberName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginRight: 8,
    },
    roleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      gap: 4,
    },
    roleText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      textTransform: 'capitalize',
    },
    memberMeta: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 8,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    memberStats: {
      flexDirection: 'row',
      gap: 12,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    statLabel: {
      fontSize: 10,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    memberActions: {
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    onlineIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.success,
    },
    requestCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    requestInfo: {
      flex: 1,
    },
    requestName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    requestMeta: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    mutualFriends: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.primary,
    },
    requestActions: {
      flexDirection: 'row',
      gap: 8,
    },
    approveButton: {
      backgroundColor: colors.success,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    declineButton: {
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    approveText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    declineText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
    },
    reportCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.error + '30',
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    reportHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    reportType: {
      backgroundColor: colors.error + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
    },
    reportTypeText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: colors.error,
      textTransform: 'uppercase',
    },
    reportReason: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.error,
    },
    reportContent: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      marginBottom: 8,
      fontStyle: 'italic',
    },
    reportFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    reportMeta: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    reportActions: {
      flexDirection: 'row',
      gap: 8,
    },
    removeButton: {
      backgroundColor: colors.error,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    keepButton: {
      backgroundColor: colors.success,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    removeText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    keepText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.background,
    },
    settingsSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 12,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    settingLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    settingDescription: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyIcon: {
      marginBottom: 12,
    },
    emptyTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    emptyMessage: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  const renderMembers = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {members.map((member) => (
        <View key={member.id} style={styles.memberCard}>
          <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
          <View style={styles.memberInfo}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberName}>{member.name}</Text>
              <View style={styles.roleBadge}>
                {getRoleIcon(member.role)}
                <Text style={[styles.roleText, { color: getRoleColor(member.role) }]}>
                  {member.role}
                </Text>
              </View>
            </View>
            <View style={styles.memberMeta}>
              <Text style={styles.metaText}>Joined {member.joinedDate}</Text>
              <Text style={styles.metaText}>Last active: {member.lastActive}</Text>
            </View>
            <View style={styles.memberStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{member.postCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>
          </View>
          <View style={styles.memberActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert(
                'Member Actions',
                `Choose an action for ${member.name}`,
                [
                  { text: 'Promote', onPress: () => handleMemberAction(member.id, 'promote') },
                  { text: 'Demote', onPress: () => handleMemberAction(member.id, 'demote') },
                  { text: 'Remove', onPress: () => handleMemberAction(member.id, 'remove'), style: 'destructive' },
                  { text: 'Cancel', style: 'cancel' }
                ]
              )}
            >
              <MoreHorizontal size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            {member.isOnline && <View style={styles.onlineIndicator} />}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderRequests = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {pendingRequests.length > 0 ? (
        pendingRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <Image source={{ uri: request.avatar }} style={styles.memberAvatar} />
            <View style={styles.requestInfo}>
              <Text style={styles.requestName}>{request.name}</Text>
              <Text style={styles.requestMeta}>Requested {request.requestDate}</Text>
              <Text style={styles.mutualFriends}>
                {request.mutualFriends} mutual friends
              </Text>
            </View>
            <View style={styles.requestActions}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleJoinRequest(request.id, 'approve')}
              >
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleJoinRequest(request.id, 'decline')}
              >
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <UserPlus size={48} color={colors.textTertiary} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Pending Requests</Text>
          <Text style={styles.emptyMessage}>All join requests have been reviewed</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderReports = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {reportedContent.length > 0 ? (
        reportedContent.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={styles.reportType}>
                <Text style={styles.reportTypeText}>{report.type}</Text>
              </View>
              <Text style={styles.reportReason}>{report.reportReason}</Text>
            </View>
            <Text style={styles.reportContent} numberOfLines={3}>
              "{report.content}"
            </Text>
            <View style={styles.reportFooter}>
              <Text style={styles.reportMeta}>
                By {report.author.name} • Reported {report.reportDate}
              </Text>
              <View style={styles.reportActions}>
                <TouchableOpacity
                  style={styles.keepButton}
                  onPress={() => handleReportedContent(report.id, 'approve')}
                >
                  <Text style={styles.keepText}>Keep</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleReportedContent(report.id, 'remove')}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Flag size={48} color={colors.textTertiary} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Reports</Text>
          <Text style={styles.emptyMessage}>No content has been reported in this group</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Group Settings</Text>
        
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Require approval for new members</Text>
            <Text style={styles.settingDescription}>
              Admin approval needed before new members can join
            </Text>
          </View>
          <Switch
            value={groupSettings.requireApproval}
            onValueChange={(value) => setGroupSettings({...groupSettings, requireApproval: value})}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Allow members to post</Text>
            <Text style={styles.settingDescription}>
              Members can create posts in the group
            </Text>
          </View>
          <Switch
            value={groupSettings.allowMemberPosts}
            onValueChange={(value) => setGroupSettings({...groupSettings, allowMemberPosts: value})}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Allow members to invite others</Text>
            <Text style={styles.settingDescription}>
              Members can invite their friends to join
            </Text>
          </View>
          <Switch
            value={groupSettings.allowMemberInvites}
            onValueChange={(value) => setGroupSettings({...groupSettings, allowMemberInvites: value})}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Show member list</Text>
            <Text style={styles.settingDescription}>
              Make the member list visible to all group members
            </Text>
          </View>
          <Switch
            value={groupSettings.showMemberList}
            onValueChange={(value) => setGroupSettings({...groupSettings, showMemberList: value})}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Admin</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Settings size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Group Info */}
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{groupInfo.name}</Text>
        <Text style={styles.groupMeta}>
          {groupInfo.memberCount.toLocaleString()} members • {groupInfo.visibility}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'members', label: 'Members', count: members.length },
          { key: 'requests', label: 'Requests', count: pendingRequests.length },
          { key: 'reports', label: 'Reports', count: reportedContent.length },
          { key: 'settings', label: 'Settings' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && ` (${tab.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </View>
    </SafeAreaView>
  );
}
