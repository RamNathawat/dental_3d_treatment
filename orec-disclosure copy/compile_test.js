const fs = require('fs');
try {
  const content = fs.readFileSync('app/disclosure/steps/Step5QuestionsA.tsx', 'utf8');
  console.log("Read successfully. Size:", content.length);
} catch (e) {
  console.error(e);
}
