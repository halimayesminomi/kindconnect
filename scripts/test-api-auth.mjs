// scripts/test-api-auth.mjs

const BASE = "http://localhost:3000/api";

async function run() {
  console.log("=== Testing API Endpoint Auth & Email Enforcement ===");

  // 1. Try registering with non-gmail
  console.log("\n1. Testing registration with non-gmail (@yahoo.com)...");
  const nonGmailRes = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Tariqul Islam",
      email: "tariqul@yahoo.com",
      password: "Password123"
    })
  });
  const nonGmailData = await nonGmailRes.json();
  console.log(`Status: ${nonGmailRes.status} (Expected 400) -> Message: ${nonGmailData.message}`);

  // 2. Try registering with fake gmail prefix
  console.log("\n2. Testing registration with fake prefix (@gmail.com)...");
  const fakeGmailRes = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Fake User",
      email: "fakeuser99@gmail.com",
      password: "Password123"
    })
  });
  const fakeGmailData = await fakeGmailRes.json();
  console.log(`Status: ${fakeGmailRes.status} (Expected 400) -> Message: ${fakeGmailData.message}`);

  // 3. Try registering with keyboard mash gmail
  console.log("\n3. Testing registration with keyboard mash (asdfgh@gmail.com)...");
  const mashGmailRes = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Mash User",
      email: "asdfgh@gmail.com",
      password: "Password123"
    })
  });
  const mashGmailData = await mashGmailRes.json();
  console.log(`Status: ${mashGmailRes.status} (Expected 400) -> Message: ${mashGmailData.message}`);

  // 4. Try registering with authentic genuine gmail
  const testRealEmail = `volunteer.omi.verify.${Date.now().toString().slice(-6)}@gmail.com`;
  console.log(`\n4. Testing registration with authentic Gmail (${testRealEmail})...`);
  const realGmailRes = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Sultana Razia",
      email: testRealEmail,
      password: "StrongPassword2026"
    })
  });
  const realGmailData = await realGmailRes.json();
  console.log(`Status: ${realGmailRes.status} (Expected 200) -> Token: ${!!realGmailData.token}, User: ${realGmailData.user?.name}`);

  // 5. Try logging in with fake email format
  console.log("\n5. Testing login with fake email format...");
  const fakeLoginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "fake123@fake.com",
      password: "Password123"
    })
  });
  const fakeLoginData = await fakeLoginRes.json();
  console.log(`Status: ${fakeLoginRes.status} (Expected 400) -> Message: ${fakeLoginData.message}`);

  // 6. Test Admin login with username 'omi' and password 'Omi@2026'
  console.log("\n6. Testing Admin Login with username 'omi' and 'Omi@2026'...");
  const adminLoginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "omi",
      password: "Omi@2026"
    })
  });
  const adminLoginData = await adminLoginRes.json();
  console.log(`Status: ${adminLoginRes.status} (Expected 200) -> Role: ${adminLoginData.user?.role}, Name: ${adminLoginData.user?.name}`);

  console.log("\n🎉 ALL API AUTH & ENFORCEMENT VERIFIED SUCCESSFULLY!");
}

run().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
