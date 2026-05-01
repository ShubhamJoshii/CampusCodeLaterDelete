const mongoose = require("mongoose");
const Problem = require("./models/Problems.js");
// The data from your uploaded file (truncated for brevity)
const { problems: rawProblems } = require("./frontend/src/assets/Problem.js");

const connectDB = require("./database.js");
const seedData = async () => {
  try {
    await connectDB();

    // Transform raw data to match Mongoose Schema
    const formattedProblems = rawProblems.map((p, id) => {
      console.log(id);
      return {
        title: p.title,
        description: p.description,
        difficulty: p.difficulty.toLowerCase(),
        tags: [p.category.toLowerCase()],
        testCases: p.examples.map((ex) => ({
          input: ex.input,
          output: ex.output,
        })),
      };
    });

    // Clear existing problems to avoid duplicates
    await Problem.deleteMany({});

    // Bulk Insert
    await Problem.insertMany(formattedProblems);

    console.log("150 Problems Seeded Successfully! 🚀");
    process.exit();
  } catch (err) {
    console.error("Seeding Error:", err);
    process.exit(1);
  }
};

seedData();
