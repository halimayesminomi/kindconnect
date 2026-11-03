// src/lib/image-utils.js

/**
 * Compresses an image file selected from the user's phone gallery or laptop/computer.
 * Uses HTML5 Canvas to produce a high-quality, lightweight Base64 JPEG data URL (~25-45KB).
 *
 * @param {File} file - The image file from the file input
 * @param {number} maxWidth - Maximum image width (default: 400px)
 * @param {number} maxHeight - Maximum image height (default: 400px)
 * @param {number} quality - JPEG compression quality (default: 0.85)
 * @returns {Promise<string>} Base64 Data URL string
 */
export function processImageFile(file, maxWidth = 400, maxHeight = 400, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন।"));
    }

    // Must be an image file
    if (!file.type || !file.type.startsWith("image/")) {
      return reject(new Error("অনুগ্রহ করে একটি সঠিক ছবি ফাইল (JPG, JPEG, PNG, WEBP) নির্বাচন করুন।"));
    }

    // Raw file limit: max 15MB
    if (file.size > 15 * 1024 * 1024) {
      return reject(new Error("ছবির সাইজ ১৫ মেগাবাইট (MB) এর কম হতে হবে।"));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("ডিভাইস থেকে ছবি পড়তে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"));
    };

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error("ছবিটি লোড করা যায়নি। ফাইলটি ক্ষতিগ্রস্থ হতে পারে।"));
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Preserve aspect ratio while constraining to maxWidth x maxHeight
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("ব্রাউজার ক্যানভাস ইনিশিয়ালাইজ করতে ব্যর্থ হয়েছে।"));
        }

        // Fill background with clean white for transparent PNGs
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        } catch (err) {
          reject(new Error("ছবি প্রসেসিং ব্যর্থ হয়েছে: " + err.message));
        }
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}
