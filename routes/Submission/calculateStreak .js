const calculateStreak = (submissions) => {
  if (!submissions.length) return 0;

  const dates = new Set(
    submissions.map(sub =>
      new Date(sub.createdAt).toISOString().split("T")[0]
    )
  );

  // 2. Convert to sorted array (latest first)
  const sortedDates = Array.from(dates).sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];

    if (dates.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

module.exports = calculateStreak;