const fetchCodeforcesData = async (handle) => {
  const userInfoUrl = `https://codeforces.com/api/user.info?handles=${handle}`;
  const userStatusUrl = `https://codeforces.com/api/user.status?handle=${handle}`;

  try {
    const userInfoRes = await fetch(userInfoUrl);
    const userInfoData = await userInfoRes.json();

    if (userInfoData.status !== "OK") {
      throw new Error("Invalid Codeforces handle");
    }

    const user = userInfoData.result[0];

    const userStatusRes = await fetch(userStatusUrl);
    const userStatusData = await userStatusRes.json();

    if (userStatusData.status !== "OK") {
      throw new Error("Failed to fetch submissions");
    }

    const submissions = userStatusData.result.map((sub) => ({
      time: sub.creationTimeSeconds,
      verdict: sub.verdict,
    }));

    return {
      handle: user.handle,
      rating: user.rating || 0,
      rank: user.rank || "unrated",
      maxRating: user.maxRating || 0,
      submissions,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = fetchCodeforcesData;
