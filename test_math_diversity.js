// test_math_diversity.js
import { QuestionGenerator } from './src/math/QuestionGenerator.js';

console.log("Testing current QuestionGenerator...");
const samples = [];
for (let i = 0; i < 20; i++) {
  const q = QuestionGenerator.generate(1);
  samples.push(q.prompt);
}
console.log("20 samples:", samples);
