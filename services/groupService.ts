import { 
  GroupsAPI, 
  Group, 
  GroupMember, 
  CreateGroupRequest, 
  UpdateGroupRequest, 
  GroupFilters, 
  PaginationParams,
  GroupCategory,
  GroupVisibility,
  MemberRole
} from './api';

/**
 * Service class for group-related operations
 * Provides a higher-level interface for group management
 */
export class GroupService {
  /**
   * Create a new group with validation
   */
  static async createGroup(groupData: CreateGroupRequest): Promise<Group> {
    // Validate required fields
    if (!groupData.name.trim()) {
      throw new Error('Group name is required');
    }
    if (!groupData.description.trim()) {
      throw new Error('Group description is required');
    }
    if (groupData.name.length > 100) {
      throw new Error('Group name must be less than 100 characters');
    }
    if (groupData.description.length > 1000) {
      throw new Error('Group description must be less than 1000 characters');
    }

    return await GroupsAPI.createGroup(groupData);
  }

  /**
   * Get groups with smart defaults
   */
  static async getGroups(
    filters?: GroupFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<{ groups: Group[]; pagination: any }> {
    const response = await GroupsAPI.getGroups(filters, { page, limit });
    return {
      groups: response.groups || [],
      pagination: {
        page: response.page,
        limit: response.limit,
        total: response.total,
        total_pages: response.total_pages
      }
    };
  }

  /**
   * Search groups with enhanced filtering
   */
  static async searchGroups(
    query: string,
    category?: GroupCategory,
    page: number = 1,
    limit: number = 20
  ): Promise<{ groups: Group[]; pagination: any }> {
    const filters = category ? { category } : undefined;
    const response = await GroupsAPI.searchGroups(query, filters, { page, limit });
    return {
      groups: response.data || [],
      pagination: {
        page: response.page,
        limit: response.limit,
        total: response.total,
        total_pages: response.total_pages
      }
    };
  }

  /**
   * Get user's groups with role information
   */
  static async getMyGroups(
    page: number = 1,
    limit: number = 20
  ): Promise<{ groups: (Group & { my_role: MemberRole })[]; pagination: any }> {
    try {
      const response = await GroupsAPI.getMyGroups({ page, limit });
      return {
        groups: response.groups || [],
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          total_pages: response.total_pages
        }
      };
    } catch (error: any) {
      // Enhanced error handling with more specific error types
      if (error.message?.includes('500') || error.message?.includes('Internal server error')) {
        throw new Error('Server is temporarily unavailable. Please try again later.');
      }
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('Session expired. Please log in again.');
      }
      if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        throw new Error('Access denied. Please check your permissions.');
      }
      if (error.message?.includes('Network')) {
        throw new Error('Network connection error. Please check your internet connection.');
      }
      
      // Re-throw with original message if no specific error type detected
      throw error;
    }
  }

  /**
   * Get group details with error handling
   */
  static async getGroupById(groupId: string): Promise<Group> {
    if (!groupId) {
      throw new Error('Group ID is required');
    }
    return await GroupsAPI.getGroupById(groupId);
  }

  /**
   * Update group with validation
   */
  static async updateGroup(groupId: string, updateData: UpdateGroupRequest): Promise<Group> {
    if (!groupId) {
      throw new Error('Group ID is required');
    }
    
    // Validate update data
    if (updateData.name && updateData.name.length > 100) {
      throw new Error('Group name must be less than 100 characters');
    }
    if (updateData.description && updateData.description.length > 1000) {
      throw new Error('Group description must be less than 1000 characters');
    }

    return await GroupsAPI.updateGroup(groupId, updateData);
  }

  /**
   * Delete group with confirmation
   */
  static async deleteGroup(groupId: string): Promise<boolean> {
    if (!groupId) {
      throw new Error('Group ID is required');
    }
    
    const response = await GroupsAPI.deleteGroup(groupId);
    return response.success;
  }

  /**
   * Join group with error handling
   */
  static async joinGroup(groupId: string): Promise<GroupMember> {
    if (!groupId) {
      throw new Error('Group ID is required');
    }
    return await GroupsAPI.joinGroup(groupId);
  }

  /**
   * Leave group with confirmation
   */
  static async leaveGroup(groupId: string): Promise<boolean> {
    if (!groupId) {
      throw new Error('Group ID is required');
    }
    
    const response = await GroupsAPI.leaveGroup(groupId);
    return response.success;
  }

  /**
   * Get group members with filtering
   */
  static async getGroupMembers(
    groupId: string,
    role?: MemberRole,
    page: number = 1,
    limit: number = 50
  ): Promise<{ members: GroupMember[]; pagination: any }> {
    if (!groupId) {
      throw new Error('Group ID is required');
    }
    
    const response = await GroupsAPI.getGroupMembers(groupId, { page, limit }, role);
    return {
      members: response.data || [],
      pagination: {
        page: response.page,
        limit: response.limit,
        total: response.total,
        total_pages: response.total_pages
      }
    };
  }

  /**
   * Update member role (admin only)
   */
  static async updateMemberRole(
    groupId: string,
    memberId: string,
    newRole: MemberRole
  ): Promise<GroupMember> {
    if (!groupId || !memberId) {
      throw new Error('Group ID and Member ID are required');
    }
    
    if (!['admin', 'moderator', 'member'].includes(newRole)) {
      throw new Error('Invalid role specified');
    }

    return await GroupsAPI.updateMemberRole(groupId, memberId, newRole);
  }

  /**
   * Remove member from group (admin/moderator only)
   */
  static async removeMember(groupId: string, memberId: string): Promise<boolean> {
    if (!groupId || !memberId) {
      throw new Error('Group ID and Member ID are required');
    }
    
    const response = await GroupsAPI.removeMember(groupId, memberId);
    return response.success;
  }

  /**
   * Get group statistics (admin only)
   */
  static async getGroupStats(groupId: string) {
    if (!groupId) {
      throw new Error('Group ID is required');
    }
    
    return await GroupsAPI.getGroupStats(groupId);
  }

  /**
   * Get groups by category
   */
  static async getGroupsByCategory(
    category: GroupCategory,
    page: number = 1,
    limit: number = 20
  ): Promise<{ groups: Group[]; pagination: any }> {
    return await this.getGroups({ category }, page, limit);
  }

  /**
   * Get popular groups (most members)
   */
  static async getPopularGroups(
    page: number = 1,
    limit: number = 20
  ): Promise<{ groups: Group[]; pagination: any }> {
    // This would require a backend sort parameter
    return await this.getGroups({}, page, limit);
  }

  /**
   * Get recommended groups for user
   */
  static async getRecommendedGroups(
    page: number = 1,
    limit: number = 20
  ): Promise<{ groups: Group[]; pagination: any }> {
    // This would require backend logic for recommendations
    return await this.getGroups({}, page, limit);
  }

  /**
   * Get nearby groups (if location is available)
   */
  static async getNearbyGroups(
    location: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ groups: Group[]; pagination: any }> {
    return await this.getGroups({ location }, page, limit);
  }

  /**
   * Validate group data before creation/update
   */
  static validateGroupData(data: Partial<CreateGroupRequest>): string[] {
    const errors: string[] = [];
    
    if (data.name !== undefined) {
      if (!data.name.trim()) {
        errors.push('Group name is required');
      } else if (data.name.length > 100) {
        errors.push('Group name must be less than 100 characters');
      }
    }
    
    if (data.description !== undefined) {
      if (!data.description.trim()) {
        errors.push('Group description is required');
      } else if (data.description.length > 1000) {
        errors.push('Group description must be less than 1000 characters');
      }
    }
    
    if (data.rules && data.rules.length > 2000) {
      errors.push('Group rules must be less than 2000 characters');
    }
    
    if (data.location && data.location.length > 200) {
      errors.push('Location must be less than 200 characters');
    }
    
    if (data.tags) {
      if (data.tags.length > 10) {
        errors.push('Maximum of 10 tags allowed');
      }
      
      for (const tag of data.tags) {
        if (tag.length > 30) {
          errors.push('Each tag must be less than 30 characters');
        }
      }
    }
    
    return errors;
  }

  /**
   * Format group data for display
   */
  static formatGroupForDisplay(group: Group) {
    return {
      ...group,
      memberCountText: group.member_count === 1 
        ? '1 member' 
        : `${group.member_count.toLocaleString()} members`,
      tagsArray: Array.isArray(group.tags) 
        ? group.tags
        : group.tags 
          ? String(group.tags).split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : [],
      createdAtFormatted: new Date(group.created_at).toLocaleDateString(),
      updatedAtFormatted: group.updated_at ? new Date(group.updated_at).toLocaleDateString() : 'N/A',
    };
  }

  /**
   * Check if user can perform admin actions
   */
  static canUserManageGroup(userRole: MemberRole): boolean {
    return userRole === 'admin';
  }

  /**
   * Check if user can moderate group
   */
  static canUserModerateGroup(userRole: MemberRole): boolean {
    return userRole === 'admin' || userRole === 'moderator';
  }
}

export default GroupService;
