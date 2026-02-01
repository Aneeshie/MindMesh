import { db } from "@/database";
import { communities, communityMembers, learningGoals, matches, users, conversations, messages } from "@/database/schema";
import { and, asc, desc, eq, ilike, inArray, ne, notInArray, or, sql } from "drizzle-orm";


export const getCommunityMembers = async (communityId: string) => {

}

export const getGoalsByUserAndCommunity = async (userId: string, communityId: string) => {
    const currentUserLearningGoals = await db
        .select()
        .from(learningGoals)
        .where(and(eq(learningGoals.userId, userId), eq(learningGoals.communityId, communityId)));


    return currentUserLearningGoals

}

export const getMembersInCommunity = async (communityId: string, excludeUserId: string) => {
    const conditions = [eq(communityMembers.communityId, communityId)]
    if (excludeUserId) {
        conditions.push(ne(users.id, excludeUserId))
    }

    return db.select({ member: communityMembers, user: users }).from(communityMembers).innerJoin(users, eq(communityMembers.userId, users.id)).where(and(...conditions))
}

export const getUserMatchesInCommunity = async (userId: string, communityId: string) => {

    return db
        .select()
        .from(matches)
        .where(
            and(
                eq(matches.communityId, communityId),
                sql`${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId}`
            )
        )

}

export const getPartnerUserId = (match: typeof matches.$inferSelect, userId: string) => {
    if (match.user1Id === userId) {
        return match.user2Id
    }
    return match.user1Id
}

export const getGoalsByUsersAndCommunity = async (userIds: string[], communityId: string) => {
    if (userIds.length === 0) {
        return new Map();
    }

    const allGoals = await db
        .select()
        .from(learningGoals)
        .where(and(
            inArray(learningGoals.userId, userIds),
            eq(learningGoals.communityId, communityId)
        ))

    const goalsMap = new Map<string, (typeof learningGoals.$inferSelect)[]>()

    for (const goal of allGoals) {
        if (!goalsMap.has(goal.userId)) {
            goalsMap.set(goal.userId, [])
        }
        goalsMap.get(goal.userId)?.push(goal)
    }

    return goalsMap
}

export const createMatch = async (user1Id: string, user2Id: string, communityId: string) => {
    const match = db.insert(matches).values({
        user1Id,
        user2Id,
        communityId,
        status: "pending"
    }).returning()

    return match
}

export const getPendingMatchesForUser = async (userId: string) => {
    const pendingMatches = await db
        .select({
            match: matches,
            community: communities,
            partner: users,
        })
        .from(matches)
        .innerJoin(communities, eq(matches.communityId, communities.id))
        .innerJoin(users, sql`
            CASE 
                WHEN ${matches.user1Id} = ${userId} THEN ${users.id} = ${matches.user2Id}
                ELSE ${users.id} = ${matches.user1Id}
            END
        `)
        .where(
            and(
                sql`${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId}`,
                eq(matches.status, "pending")
            )
        );

    const matchesWithGoals = await Promise.all(
        pendingMatches.map(async (m) => {
            const partnerGoals = await db
                .select()
                .from(learningGoals)
                .where(
                    and(
                        eq(learningGoals.userId, m.partner.id),
                        eq(learningGoals.communityId, m.community.id)
                    )
                );
            return {
                ...m,
                partnerGoals,
            };
        })
    );

    return matchesWithGoals;
};


export const getActiveMatchesForUser = async (userId: string) => {
    const activeMatches = await db
        .select({
            match: matches,
            community: communities,
            partner: users,
        })
        .from(matches)
        .innerJoin(communities, eq(matches.communityId, communities.id))
        .innerJoin(users, sql`
            CASE 
                WHEN ${matches.user1Id} = ${userId} THEN ${users.id} = ${matches.user2Id}
                ELSE ${users.id} = ${matches.user1Id}
            END
        `)
        .where(
            and(
                sql`${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId}`,
                eq(matches.status, "active")
            )
        );

    const matchesWithGoals = await Promise.all(
        activeMatches.map(async (m) => {
            const partnerGoals = await db
                .select()
                .from(learningGoals)
                .where(
                    and(
                        eq(learningGoals.userId, m.partner.id),
                        eq(learningGoals.communityId, m.community.id)
                    )
                );

            const myGoals = await db
                .select()
                .from(learningGoals)
                .where(
                    and(
                        eq(learningGoals.userId, userId),
                        eq(learningGoals.communityId, m.community.id)
                    )
                );

            return {
                ...m,
                partnerGoals,
                myGoals
            };
        })
    );

    return matchesWithGoals;
};

export const updateMatchStatus = async (matchId: string, status: "active" | "declined") => {
    const [updatedMatch] = await db
        .update(matches)
        .set({ status })
        .where(eq(matches.id, matchId))
        .returning();

    // Create a conversation if match is accepted
    if (updatedMatch && status === "active") {
        await db.insert(conversations).values({
            matchId: updatedMatch.id
        });
    }

    return updatedMatch;
};


export const getMatchById = async (matchId: string, userId: string) => {
    const [match] = await db
        .select({
            match: matches,
            community: communities,
            partner: users,
        })
        .from(matches)
        .innerJoin(communities, eq(matches.communityId, communities.id))
        .innerJoin(users, sql`
            CASE 
                WHEN ${matches.user1Id} = ${userId} THEN ${users.id} = ${matches.user2Id}
                ELSE ${users.id} = ${matches.user1Id}
            END
        `)
        .where(
            and(
                eq(matches.id, matchId),
                sql`${matches.user1Id} = ${userId} OR ${matches.user2Id} = ${userId}`
            )
        );

    if (!match) return null;

    return match;
}

export const getMessages = async (matchId: string, limit = 50) => {
    // 1. Get conversation ID
    const [conversation] = await db
        .select()
        .from(conversations)
        .where(eq(conversations.matchId, matchId))
        .limit(1);

    if (!conversation) return [];

    // 2. Get messages
    const chatMessages = await db
        .select({
            id: messages.id,
            content: messages.content,
            senderId: messages.senderId,
            createdAt: messages.createdAt,
            senderName: users.name
        })
        .from(messages)
        .innerJoin(users, eq(messages.senderId, users.id))
        .where(eq(messages.conversationId, conversation.id))
        .orderBy(asc(messages.createdAt)) // Oldest first for chat history
        .limit(limit);

    return chatMessages;
}

export const createMessage = async (matchId: string, senderId: string, content: string) => {
    // 1. Get or create conversation (should exist, but safe to check)
    let [conversation] = await db
        .select()
        .from(conversations)
        .where(eq(conversations.matchId, matchId))
        .limit(1);

    if (!conversation) {
        // Technically should exist from 'accept' but fail-safe
        [conversation] = await db.insert(conversations).values({ matchId }).returning();
    }

    // 2. Insert message
    const [newMessage] = await db.insert(messages).values({
        conversationId: conversation.id,
        senderId,
        content
    }).returning();

    // 3. Update conversation last message timestamp
    await db.update(conversations)
        .set({ lastMessageAt: new Date() })
        .where(eq(conversations.id, conversation.id));

    return newMessage;
}

export const searchUsers = async (query: string, currentUserId: string) => {
    // 1. Get IDs of users already matched (pending or active)
    const existingMatches = await db
        .select({
            partnerId: sql<string>`
                CASE 
                    WHEN ${matches.user1Id} = ${currentUserId} THEN ${matches.user2Id}
                    ELSE ${matches.user1Id}
                END
            `
        })
        .from(matches)
        .where(
            or(
                eq(matches.user1Id, currentUserId),
                eq(matches.user2Id, currentUserId)
            )
        );

    const excludedUserIds = [currentUserId, ...existingMatches.map(m => m.partnerId)];

    // 2. Search users excluding matched ones
    const results = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            imageUrl: users.imageUrl
        })
        .from(users)
        .where(
            and(
                notInArray(users.id, excludedUserIds),
                or(
                    ilike(users.name, `%${query}%`),
                    ilike(users.email, `%${query}%`)
                )
            )
        )
        .limit(10);

    return results;
}
