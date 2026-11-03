// Scratch test script
import { validateRealEmail, validateRealName } from "../src/lib/email-validator.js";

console.log("=== Testing Real Gmail Validation ===");

const testCases = [
  // Non-gmail (must fail when requireGmail: true)
  { email: "user@yahoo.com", requireGmail: true, expectValid: false, label: "Non-gmail domain (yahoo)" },
  { email: "user@tempmail.com", requireGmail: true, expectValid: false, label: "Disposable domain" },
  { email: "fake@fake.com", requireGmail: true, expectValid: false, label: "Fake domain" },
  { email: "someone@kindconnect.org", requireGmail: true, expectValid: false, label: "Non-gmail custom domain" },

  // Gmail with invalid Google username rules
  { email: "abc@gmail.com", requireGmail: true, expectValid: false, label: "Short username (<6 chars)" },
  { email: "123456@gmail.com", requireGmail: true, expectValid: false, label: "Pure numbers username" },
  { email: "aaaaaa@gmail.com", requireGmail: true, expectValid: false, label: "Repetitive chars" },
  { email: "hhhhhh@gmail.com", requireGmail: true, expectValid: false, label: "Repetitive chars (hhhhhh)" },
  { email: "asdfghjk@gmail.com", requireGmail: true, expectValid: false, label: "Keyboard mash without vowels" },
  { email: "test1234@gmail.com", requireGmail: true, expectValid: false, label: "Blocked prefix test" },
  { email: "fakeuser12@gmail.com", requireGmail: true, expectValid: false, label: "Blocked prefix fake" },
  { email: "user..name@gmail.com", requireGmail: true, expectValid: false, label: "Consecutive dots" },
  { email: ".username@gmail.com", requireGmail: true, expectValid: false, label: "Starting with dot" },
  { email: "user-name@gmail.com", requireGmail: true, expectValid: false, label: "Hyphen in gmail username" },

  // Valid genuine Gmail accounts (must pass)
  { email: "halimayesminomi2002@gmail.com", requireGmail: true, expectValid: true, label: "Authentic Admin Gmail" },
  { email: "volunteer.sylhet26@gmail.com", requireGmail: true, expectValid: true, label: "Valid volunteer Gmail with dot and numbers" },
  { email: "tanvir.ahmed.metropolitan@gmail.com", requireGmail: true, expectValid: true, label: "Valid metropolitan student gmail" },
  { email: "farzana.doctor@googlemail.com", requireGmail: true, expectValid: true, label: "Valid googlemail.com" },
];

let failed = 0;
for (const tc of testCases) {
  const res = validateRealEmail(tc.email, { requireGmail: tc.requireGmail });
  const passed = res.isValid === tc.expectValid;
  console.log(`${passed ? "✅ PASS" : "❌ FAIL"}: [${tc.label}] ${tc.email} -> isValid: ${res.isValid} ${!res.isValid ? `(Error: ${res.errorBn})` : ""}`);
  if (!passed) failed++;
}

console.log("\n=== Testing Name Validation ===");
const nameTests = [
  { name: "Halima Yesmin Omi", expectValid: true, label: "Real name" },
  { name: "হালিমা ইয়াসমিন", expectValid: true, label: "Bengali real name" },
  { name: "asdf", expectValid: false, label: "Dummy name asdf" },
  { name: "12345", expectValid: false, label: "Numeric name" },
  { name: "aaaaaa", expectValid: false, label: "Repetitive name" },
];

for (const tc of nameTests) {
  const res = validateRealName(tc.name);
  const passed = res.isValid === tc.expectValid;
  console.log(`${passed ? "✅ PASS" : "❌ FAIL"}: [${tc.label}] "${tc.name}" -> isValid: ${res.isValid}`);
  if (!passed) failed++;
}

if (failed === 0) {
  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
} else {
  console.error(`\n❌ ${failed} TESTS FAILED!`);
  process.exit(1);
}
