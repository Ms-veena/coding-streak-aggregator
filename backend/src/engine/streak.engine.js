const calculateStreak = (submissions) => {
  if (!submissions || submissions.length === 0) return 0;

  // take only accepted submissions
  const accepted = submissions
    .filter((s) => s.verdict === "OK")
    .map((s) => {
      const date = new Date(s.time * 1000);
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    });

  // remove duplicate days
  const uniqueDays = [...new Set(accepted)];

  // sort days descending
  uniqueDays.sort((a, b) => (a < b ? 1 : -1));

  let streak = 0;
  let currentDay = new Date();

  for (let day of uniqueDays) {
    const dayDate = new Date(day);
    const diff =
      (currentDay.setHours(0, 0, 0, 0) - dayDate.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24);

    if (diff === 0 || diff === 1) {
      streak++;
      currentDay = dayDate;
    } else {
      break;
    }
  }

  return streak;
};

module.exports = calculateStreak;
