function buildJavaInput(tc, type) {
  const input = tc?.input || {};
  const lines = [];

  for (const key in input) {
    const value = input[key];

    // Handle 2D array (matrix)
    if (Array.isArray(value) && Array.isArray(value[0])) {
      const rows = value.length;
      const cols = value[0]?.length || 0;

      lines.push(`${rows} ${cols}`);
      for (const row of value) {
        lines.push(row.join(" "));
      }
    }

    // Handle 1D array
    else if (Array.isArray(value)) {
      lines.push(value.length);
      lines.push(value.join(" "));
    }

    // Handle string
    else if (typeof value === "string") {
      lines.push(value);
    }

    // Handle numbers / others
    else {
      lines.push(value);
    }
  }

  return lines.join("\n");
}

module.exports = buildJavaInput;