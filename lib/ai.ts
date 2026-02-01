import { db } from "@/database";
import { learningGoals, users } from "@/database/schema";
import { openai } from '@ai-sdk/openai';

type DbUser = typeof users.$inferSelect;
import { generateText } from "ai";
import { and, eq } from "drizzle-orm";
import { createMatch, getGoalsByUserAndCommunity, getGoalsByUsersAndCommunity, getMembersInCommunity, getPartnerUserId, getUserMatchesInCommunity } from "./db-helpers";


export const aiMatchUsers = async (user: DbUser, communityId: string) => {

    try {


        const currentUserLearningGoals = await getGoalsByUserAndCommunity(user.id, communityId)

        const members = await getMembersInCommunity(communityId, user.id);

        const existingMatches = await getUserMatchesInCommunity(user.id, communityId)

        const existingMatchUserIds = new Set(existingMatches.map((m) => getPartnerUserId(m, user.id)))

        const potentialMembersIds = members.filter((m) => !existingMatchUserIds.has(m.user.id)).map((m) => m.user.id)

        const goalsMap = await getGoalsByUsersAndCommunity(potentialMembersIds, communityId)


        const potentialPartners = [];
        const memberWithoutGoals = [];

        for (const member of members) {
            if (existingMatchUserIds.has(member.user.id)) continue;

            const memberGoals = goalsMap.get(member.user.id);
            if (memberGoals.length > 0) {
                potentialPartners.push({
                    userId: member.user.id,
                    username: member.user.name,
                    goals: memberGoals.map((g: typeof learningGoals.$inferSelect) => ({
                        title: g.title,
                        description: g.description || "",
                    }))
                })
            } else {
                memberWithoutGoals.push(member.user.id)
            }


        }


        const prompt = `You are an AI matching assistant for a learning platform. Your job is to match learners with compatible learning partners.

Current User: ${user.name}
Their Learning Goals:
${currentUserLearningGoals.map((g) => `- ${g.title}: ${g.description}`).join("\n")}

Potential Partners:
${potentialPartners
                .map(
                    (p, idx) => `
${idx + 1}. ${p.username}
   Goals:
   ${p.goals
                            .map(
                                (g: typeof learningGoals.$inferSelect) =>
                                    `   - ${g.title}: ${g.description}`
                            )
                            .join("\n")}
`
                )
                .join("\n")}

Task: Analyze the learning goals and identify the TOP 3 most compatible learning partners for ${user.name
            }.

IMPORTANT MATCHING CRITERIA:
1. Use SEMANTIC SIMILARITY - goals don't need exact title matches. For example:
   - "Learn the basics of React" matches with "React Hooks deep dive" (both about React)
   - "Next.js - App Router - Build and Ship an app" matches with "Next.js App Router" (both about Next.js App Router)
   - "JavaScript fundamentals" matches with "JavaScript ES6+ features" (both about JavaScript)

2. Look at BOTH title and description to understand what the person wants to learn

3. Consider:
   - Overlapping or complementary learning goals (even if worded differently)
   - Similar skill levels or learning paths
   - Potential for mutual learning and knowledge sharing
   - Common interests and learning styles

4. Be INCLUSIVE - if there's any reasonable connection between learning goals, include them as a potential match

Return ONLY a JSON array of partner indices (1-based) in order of compatibility. Return between 1-3 matches maximum.
Example: [2, 5, 1] means partner #2 is the best match, then #5, then #1.

Only return an empty array [] if there are truly NO partners with any related learning interests.`;

        const { text } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt: prompt,
        });


        let jsonText = text.trim();
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.replace(/```json\s\n/, "").replace(/\n```\s*$/, "");
        } else if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/^```\s\n/, "").replace(/\n```\s*$/, "");
        }


        console.log("AI MATCHING TEXT: ", jsonText)

        let matchIndices = [];

        try {
            matchIndices = JSON.parse(jsonText)

        } catch (error) {
            console.error("Error parsing JSON: ", error)
            throw new Error("Failed to parse JSON")
        }

        if (!Array.isArray(matchIndices)) {
            throw new Error("Invalid JSON format")
        }

        if (matchIndices.length === 0 || matchIndices.length > 3) {
            throw new Error("Invalid number of matches")
        }

        if (matchIndices.some((idx) => typeof idx !== "number" || idx < 1 || idx > potentialPartners.length)) {
            throw new Error("Invalid match indices")
        }

        const createdMatches = [];

        for (const idx of matchIndices) {
            const partnerIndex = idx - 1;
            if (partnerIndex >= 0 && partnerIndex < potentialPartners.length) {
                const partner = potentialPartners[partnerIndex];
                const match = await createMatch(user.id, partner.userId, communityId)
                createdMatches.push({
                    ...match,
                    partner: partner.username,

                })
            }
        }

        console.log("Created matches: ", createdMatches, createdMatches.length)

        return {
            matched: createdMatches.length,
            matches: createdMatches
        }

    } catch (error) {
        console.error("Error matching users: ", error)
        throw new Error("Failed to match users")
    }



};

export const generateAISummaries = () => { }