const fetchLeetCodeData = async (username) => {
  const url = "https://leetcode.com/graphql";

  const query = `
    query userProfilePublic($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            count
          }
        }
      }
    }
  `;

  const body = {
    query,
    variables: { username },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!result.data || !result.data.matchedUser) {
      throw new Error("Invalid LeetCode username");
    }

    const user = result.data.matchedUser;

    return {
      handle: username,
      totalSolved: user.submitStatsGlobal.acSubmissionNum[0].count,
      ranking: user.profile?.ranking || null,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = fetchLeetCodeData;
