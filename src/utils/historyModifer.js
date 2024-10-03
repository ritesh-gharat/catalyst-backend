function convertHistory(history) {
  let requiredHistory = [];

  if (history) {
    history.forEach((entry) => {
      const maxLength = Math.max(entry.user.length, entry.model.length);

      for (let i = 0; i < maxLength; i++) {
        if (i < entry.user.length) {
          requiredHistory.push({
            role: "user",
            parts: [{ text: String(entry.user[i].text) }],
          });
        }

        if (i < entry.model.length) {
          requiredHistory.push({
            role: "model",
            parts: [{ text: String(entry.model[i].text) }],
          });
        }
      }
    });

    return requiredHistory;
  }
  return null;
}

export default convertHistory;