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
  "mailcatch.com", "meltmail.com", "trashymail.com", "trash-mail.at", "trashmail.at",
  "burner.com", "trash.com", "temp.com", "throwaway.com", "junk.com", "spambox.me",
  "guerrilla.com", "inboxalias.com", "fakemail.net", "fakemail.com", "tempemail.co",
  "10minemail.com", "mytempmail.com", "disposable.com", "deadaddress.com"
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
  "asdfgh", "zxcvbn", "qwertyuiop", "asdfasdf", "blabla", "hahaha", "noname", "somebody",
  "nobody", "whatever", "unknown", "random", "testuser", "fakeuser", "dummyuser"
]);

// Known spam/throwaway TLDs
const SPAM_TLDS = new Set(["tk", "ml", "ga", "cf", "gq", "top", "click", "buzz", "rest", "fit"]);

/**
 * Validates whether an email address is real, strictly formatted, and not fake/disposable.
 * When options.requireGmail is true, enforces that the email MUST be a genuine Google Gmail account.
 * Returns { isValid: boolean, error?: string, errorBn?: string }
 */
export function validateRealEmail(email, options = {}) {
  const { requireGmail = false } = options;

  if (!email || typeof email !== "string") {
    return {
      isValid: false,
      error: "Email address is required.",
      errorBn: "ইমেইল অ্যাড্রেস প্রয়োজন।"
    };
  }

  const clean = email.trim().toLowerCase();

  // Basic RFC structure: local@domain.tld
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

  // If requireGmail is true: domain MUST strictly be gmail.com or googlemail.com
  if (requireGmail) {
    if (domain !== "gmail.com" && domain !== "googlemail.com") {
      return {
        isValid: false,
        error: "KindConnect registration strictly requires a genuine Gmail address (@gmail.com). Temporary or other domains are not allowed.",
        errorBn: "অ্যাকাউন্ট তৈরি করতে শুধুমাত্র আসল ও অনুমোদিত Gmail (@gmail.com) ঠিকানা ব্যবহার করতে হবে। কোনো ভুয়া বা অস্থায়ী ইমেইল গ্রহণযোগ্য নয়।"
      };
    }
  }

  // TLD check
  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || SPAM_TLDS.has(tld)) {
    return {
      isValid: false,
      error: "This email domain extension is not allowed. Please use a standard email (e.g. @gmail.com).",
      errorBn: "এই ডোমেইন এক্সটেনশনটি গ্রহণযোগ্য নয়। দয়া করে আসল জিমেইল (@gmail.com) দিন।"
    };
  }

  // Check disposable domains exact match
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: "Temporary or disposable emails are not permitted. Please use your genuine email.",
      errorBn: "ভুয়া বা ডিসপোজেবল ইমেইল গ্রহণযোগ্য নয়। অনুগ্রহ করে আপনার আসল ব্যক্তিগত ইমেইল ব্যবহার করুন।"
    };
  }

  // Check if domain contains suspicious disposable keywords
  const suspiciousKeywords = ["temp", "fake", "trash", "dispos", "throwaway", "burner", "mailinator", "sharklasers", "guerrilla", "junk", "spambox"];
  if (suspiciousKeywords.some(keyword => domain.includes(keyword))) {
    return {
      isValid: false,
      error: "Burner and disposable email domains are blocked. Please provide a genuine email.",
      errorBn: "অস্থায়ী বা ভুয়া ইমেইল ডোমেইন নিষিদ্ধ। অনুগ্রহ করে আপনার আসল ইমেইল দিন।"
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

  // Keyboard mash check: If username is purely alphabetic, 6+ characters long, and has ZERO vowels (a, e, i, o, u, y)
  if (/^[a-z]{6,}$/.test(localPart) && !/[aeiouy]/.test(localPart)) {
    return {
      isValid: false,
      error: "This email address appears to be a random keyboard mash. Please use a genuine email.",
      errorBn: "ইমেইলটি এলোমেলো টাইপ করা ভুয়া ইমেইল মনে হচ্ছে। দয়া করে আপনার আসল ইমেইল ব্যবহার করুন।"
    };
  }

  // Alternating keyboard mash patterns or keyboard walks like "asdfghjk", "qwerty", "asdfasdf"
  const keyboardWalks = ["asdf", "ghjk", "qwerty", "zxcv", "1234", "abcd", "qwer"];
  if (keyboardWalks.some(walk => localPart.includes(walk))) {
    if (/^(asdf|qwerty|zxcv|1234|ghjk|qwer|abcd)[0-9a-z]{0,10}$/.test(localPart.replace(/\./g, ""))) {
      return {
        isValid: false,
        error: "Key-pattern dummy email addresses are blocked.",
        errorBn: "কিবোর্ড প্যাটার্নের ভুয়া ইমেইল গ্রহণযোগ্য নয়।"
      };
    }
  }

  // =========================================================================
  // Strict Genuine Google Gmail Rules (applies to gmail.com / googlemail.com)
  // =========================================================================
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

    // Google only allows letters (a-z), numbers (0-9), and periods (.)
    if (!/^[a-z0-9.]+$/.test(localPart)) {
      return {
        isValid: false,
        error: "Gmail usernames can only contain letters (a-z), numbers (0-9), and periods (.).",
        errorBn: "জিমেইলে কোনো হাইফেন, আন্ডারস্কোর বা বিশেষ চিহ্ন গ্রহণযোগ্য নয় (শুধুমাত্র a-z, 0-9 ও .)।"
      };
    }

    // Google does not allow purely numeric usernames (e.g., 123456@gmail.com)
    if (/^[0-9.]+$/.test(localPart)) {
      return {
        isValid: false,
        error: "Google Gmail usernames cannot consist purely of numbers. At least one letter is required.",
        errorBn: "গুগল জিমেইলে শুধুমাত্র সংখ্যা দিয়ে ইউজারনেম তৈরি করা যায় না। অন্তত একটি ইংরেজি অক্ষর থাকতে হবে।"
      };
    }

    // Block common dummy prefixes & patterns on gmail
    const blockedPrefixes = ["test", "fake", "dummy", "sample", "temp", "asdf", "qwerty", "unknown", "random", "fakeuser", "testuser", "dummyuser"];
    if (blockedPrefixes.some(prefix => localWithoutDots.startsWith(prefix))) {
      return {
        isValid: false,
        error: "Placeholder Gmail addresses with 'test', 'fake', or 'dummy' prefixes are not allowed.",
        errorBn: "টেস্ট, ফেক বা ডামি ইউজারনেমের জিমেইল গ্রহণযোগ্য নয়। অনুগ্রহ করে আপনার আসল জিমেইল দিন।"
      };
    }

    const blockedGmailPatterns = [
      /^test[0-9]*$/,
      /^fake[0-9]*$/,
      /^dummy[0-9]*$/,
      /^user[0-9]*$/,
      /^asdf[0-9]*$/,
      /^abc[0-9]*$/,
      /^1234[0-9]*$/,
      /^sample[0-9]*$/,
      /^email[0-9]*$/,
      /^mail[0-9]*$/,
      /^admin[0-9]*$/
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

/**
 * Validates a person's real name (rejects numbers, pure symbols, or keyboard mash)
 */
export function validateRealName(name) {
  if (!name || typeof name !== "string") {
    return {
      isValid: false,
      error: "Full name is required.",
      errorBn: "আপনার পূর্ণ নাম প্রয়োজন।"
    };
  }

  const clean = name.trim();
  if (clean.length < 3) {
    return {
      isValid: false,
      error: "Name must be at least 3 characters long.",
      errorBn: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।"
    };
  }

  // Must contain at least two letters (English or Bengali)
  const letterCount = (clean.match(/[a-zA-Z\u0980-\u09FF]/g) || []).length;
  if (letterCount < 2) {
    return {
      isValid: false,
      error: "Please enter a genuine name with valid letters.",
      errorBn: "অনুগ্রহ করে একটি সঠিক ও পূর্ণাঙ্গ নাম লিখুন।"
    };
  }

  // Cannot be purely repetitive characters
  if (/^([a-zA-Z0-9])\1+$/i.test(clean.replace(/\s+/g, ""))) {
    return {
      isValid: false,
      error: "Repetitive character names are not allowed.",
      errorBn: "একই অক্ষরের পুনরাবৃত্তিমূলক নাম গ্রহণযোগ্য নয়।"
    };
  }

  // Cannot be placeholder names
  const lower = clean.toLowerCase();
  if (["test", "fake", "dummy", "asdf", "qwerty", "anonymous", "null", "none", "admin"].includes(lower)) {
    return {
      isValid: false,
      error: "Please use your real full name.",
      errorBn: "অনুগ্রহ করে আপনার আসল নাম ব্যবহার করুন।"
    };
  }

  return { isValid: true };
}
