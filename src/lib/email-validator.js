// src/lib/email-validator.js

// Comprehensive list of disposable/temporary/burner email domains
const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com", "temp-mail.org", "temp-mail.io", "10minutemail.com", "mailinator.com",
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.biz", "guerrillamail.org",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "pokemail.net", "spam4.me",
  "yopmail.com", "yopmail.fr", "yopmail.net", "dispostable.com", "trashmail.com",
  "throwawaymail.com", "getairmail.com", "maildrop.cc", "fakeinbox.com", "crazymailing.com",
  "mohmal.com", "nada.ltd", "inboxkitten.com", "tempmailo.com", "generator.email",
  "emailondeck.com", "dropmail.me", "tempinbox.com", "mytemp.email", "fakemailgenerator.com",
  "burnermail.io", "trashmail.net", "mailnesia.com", "disposablemail.com", "tempmail.net",
  "fake.com", "dummy.com", "test.com", "example.com", "sample.com", "asdf.com", "invalid.com",
  "mailcatch.com", "meltmail.com", "trashymail.com", "trash-mail.at", "trashmail.at"
]);

// Known fake / placeholder usernames
const FAKE_USERNAMES = new Set([
  "test", "testing", "fake", "dummy", "asdf", "qwerty", "123456", "admin", "user",
  "sample", "none", "null", "undefined", "anonymous", "temp", "tempmail", "abc", "xyz",
  "aaa", "bbb", "ccc", "ddd", "eee", "fff", "ggg", "hhh", "iii", "jjj", "kkk", "lll",
  "mmm", "nnn", "ooo", "ppp", "qqq", "rrr", "sss", "ttt", "uuu", "vvv", "www", "xxx", "yyy", "zzz",
  "111", "222", "333", "444", "555", "666", "777", "888", "999", "000",
  "aaaa", "bbbb", "cccc", "dddd", "eeee", "ffff", "gggg", "hhhh", "iiii", "jjjj",
  "kkkk", "llll", "mmmm", "nnnn", "oooo", "pppp", "qqqq", "rrrr", "ssss", "tttt",
  "aaaaa", "bbbbb", "ccccc", "ddddd", "eeeee", "fffff", "ggggg", "hhhhh", "iiiii",
  "aaaaaa", "bbbbbb", "cccccc", "dddddd", "eeeeee", "ffffff", "gggggg", "hhhhhh", "nnnnnn",
  "123123", "12345", "1234567", "12345678", "000000", "111111", "222222", "999999",
  "asdfgh", "zxcvbn", "qwertyuiop", "asdfasdf"
]);

/**
 * Validates whether an email address is real, strictly formatted, and not fake/disposable.
 * Returns { isValid: boolean, error?: string, errorBn?: string }
 */
export function validateRealEmail(email) {
  if (!email || typeof email !== "string") {
    return {
      isValid: false,
      error: "Email address is required.",
      errorBn: "ইমেইল অ্যাড্রেস প্রয়োজন।"
    };
  }

  const clean = email.trim().toLowerCase();

  // Basic structure: local@domain.tld
  const generalRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!generalRegex.test(clean)) {
    return {
      isValid: false,
      error: "Please enter a valid, properly formatted email address (e.g. name@gmail.com).",
      errorBn: "অনুগ্রহ করে একটি সঠিক ও পূর্ণাঙ্গ ইমেইল দিন (যেমন: name@gmail.com)।"
    };
  }

  const [localPart, domain] = clean.split("@");

  // Domain cannot contain double dots or start/end with dot
  if (!domain || domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) {
    return {
      isValid: false,
      error: "Invalid email domain.",
      errorBn: "ইমেইল ডোমেইনটি সঠিক নয়।"
    };
  }

  // Check disposable domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: "Temporary or disposable emails are not permitted. Please use your genuine email.",
      errorBn: "ভুয়া বা ডিসপোজেবল ইমেইল গ্রহণযোগ্য নয়। অনুগ্রহ করে আপনার আসল ব্যক্তিগত ইমেইল ব্যবহার করুন।"
    };
  }

  // Check known fake/placeholder usernames
  if (FAKE_USERNAMES.has(localPart)) {
    return {
      isValid: false,
      error: "This appears to be a dummy or placeholder email. Please use your genuine personal email.",
      errorBn: "এই ইমেইলটি একটি ডামি বা ভুয়া ইমেইল বলে মনে হচ্ছে। অনুগ্রহ করে আপনার আসল ব্যক্তিগত ইমেইল দিন।"
    };
  }

  // Check for fully repetitive characters like "aaaaaa" or "111111"
  if (/^([a-z0-9])\1+$/.test(localPart)) {
    return {
      isValid: false,
      error: "Repetitive character dummy emails are not permitted. Please use a real email.",
      errorBn: "একই অক্ষরের পুনরাবৃত্তিমূলক ভুয়া ইমেইল গ্রহণযোগ্য নয়। অনুগ্রহ করে আপনার আসল ইমেইল দিন।"
    };
  }

  // Strict Gmail rules (applies if domain is gmail.com or googlemail.com)
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const localWithoutDots = localPart.replace(/\./g, "");

    // Google enforces minimum 6 characters for Gmail usernames
    if (localWithoutDots.length < 6) {
      return {
        isValid: false,
        error: "Google requires Gmail usernames to be at least 6 characters long.",
        errorBn: "গুগলের অফিশিয়াল নিয়ম অনুযায়ী জিমেইল ইউজারনেম কমপক্ষে ৬ অক্ষরের হতে হবে।"
      };
    }

    if (localPart.length > 30) {
      return {
        isValid: false,
        error: "Gmail usernames cannot exceed 30 characters.",
        errorBn: "জিমেইল ইউজারনেম সর্বোচ্চ ৩০ অক্ষরের হতে পারে।"
      };
    }

    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      return {
        isValid: false,
        error: "Gmail usernames cannot start or end with a period.",
        errorBn: "জিমেইল অ্যাড্রেসের শুরুতে বা শেষে ডট (.) থাকা সম্ভব নয়।"
      };
    }

    if (localPart.includes("..")) {
      return {
        isValid: false,
        error: "Gmail usernames cannot contain consecutive periods.",
        errorBn: "জিমেইলে পরপর দুটি ডট (..) গ্রহণযোগ্য নয়।"
      };
    }

    // Must only contain a-z, 0-9, and .
    if (!/^[a-z0-9.]+$/.test(localPart)) {
      return {
        isValid: false,
        error: "Gmail usernames can only contain letters (a-z), numbers (0-9), and periods (.).",
        errorBn: "জিমেইলে কোনো হাইফেন, আন্ডারস্কোর বা বিশেষ চিহ্ন গ্রহণযোগ্য নয় (শুধুমাত্র a-z, 0-9 ও .)।"
      };
    }

    // Block common dummy patterns on gmail
    const blockedGmailPatterns = [
      /^test[0-9]*$/,
      /^fake[0-9]*$/,
      /^dummy[0-9]*$/,
      /^user[0-9]*$/,
      /^asdf[0-9]*$/,
      /^abc[0-9]*$/,
      /^1234[0-9]*$/
    ];
    for (const pat of blockedGmailPatterns) {
      if (pat.test(localWithoutDots)) {
        return {
          isValid: false,
          error: "Placeholder Gmail addresses like 'test' or 'fake' are not allowed.",
          errorBn: "টেস্ট বা ভুয়া জিমেইল গ্রহণযোগ্য নয়। আপনার আসল জিমেইল ব্যবহার করুন।"
        };
      }
    }
  }

  return { isValid: true };
}
