// 🔑 הטוקן של Hugging Face
const HF_API_KEY = "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";

// 🤖 מודל מומלץ לשיחות בעברית
const MODEL_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";

// 🎭 הודעות פתיחה
const welcomeMessages = [
  "שלום! אני אוסקר, בוט המלצות הסרטים שלך 🎬 איזה סרט מעניין אותך היום?",
  "היי! אני אוסקר ואני מתמחה בהמלצות סרטים 🍿 מה תרצה לראות?",
  "ברוכים הבאים! אני אוסקר ואשמח לעזור לך למצוא סרט מושלם 🎭 מה אתה מחפש?"
];

// 📚 מאגר סרטים זמני (ישמש כגיבוי)
const backupMovies = [
  {
    Title: "המצאה מתוקה",
    Release_Year: 2024,
    Genres: "Animation, Comedy, Family",
    Rating: "7.5",
    ageRange: "7+",
    "נטפליקס": 1,
    "יס": 1,
    "הוט": 0,
    trailer: "https://www.youtube.com/watch?v=sweet_invention_trailer_example",
    Duration: 90 // Added Duration
  },
  {
    Title: "המבול",
    Release_Year: 2023,
    Genres: "Action, Drama",
    Rating: "8.5",
    ageRange: "16+",
    "נטפליקס": 1,
    "יס": 0,
    "הוט": 1,
    trailer: "https://www.youtube.com/watch?v=QxJQbGY3LcI",
    Duration: 130 // Added Duration
  },
  {
    Title: "המשחק",
    Release_Year: 2022,
    Genres: "Comedy, Romance",
    Rating: "7.8",
    ageRange: "12+",
    "נטפליקס": 1,
    "יס": 1,
    "הוט": 0,
    trailer: "https://www.youtube.com/watch?v=example2",
    Duration: 105 // Added Duration
  },
  {
    Title: "מלחמת הכוכבים: עלייתו של סקייווקר",
    Release_Year: 2019,
    Genres: "Action, Adventure, Sci-Fi",
    Rating: "6.5",
    ageRange: "12+",
    "נטפליקס": 1,
    "יס": 1,
    "הוט": 1,
    trailer: "https://www.youtube.com/watch?v=8Qn_spdM5Zg",
    Duration: 142 // Added Duration
  },
  {
    Title: "ג'וקר",
    Release_Year: 2019,
    Genres: "Drama, Thriller",
    Rating: "8.4",
    ageRange: "16+",
    "נטפליקס": 1,
    "יס": 1,
    "הוט": 0,
    trailer: "https://www.youtube.com/watch?v=zAGVQLHvwOY",
    Duration: 122 // Added Duration
  },
  {
    Title: "המטריקס", // New movie for 17+ and Action, Sci-Fi, medium duration
    Release_Year: 1999,
    Genres: "Action, Sci-Fi",
    Rating: "8.7",
    ageRange: "17+",
    "נטפליקס": 1,
    "יס": 0,
    "הוט": 1,
    trailer: "https://www.youtube.com/watch?v=matrix_trailer_example",
    Duration: 110 // Changed to medium duration (90-120)
  },
  {
    Title: "שתיקת הכבשים",
    Release_Year: 1991,
    Genres: "Crime, Drama, Thriller",
    Rating: "8.6",
    ageRange: "17+", // Changed to 17+ for testing
    "נטפליקס": 1,
    "יס": 0,
    "הוט": 0,
    trailer: "https://www.youtube.com/watch?v=silence_of_the_lambs_trailer_example",
    Duration: 118 // Added Duration
  },
  {
    Title: "שר הטבעות: אחוות הטבעת",
    Release_Year: 2001,
    Genres: "Adventure, Drama, Fantasy",
    Rating: "8.8",
    ageRange: "13+",
    "נטפליקס": 0,
    "יס": 1,
    "הוט": 1,
    trailer: "https://www.youtube.com/watch?v=fellowship_trailer_example",
    Duration: 178 // Added Duration
  },
  {
    Title: "הסנדק",
    Release_Year: 1972,
    Genres: "Crime, Drama",
    Rating: "9.2",
    ageRange: "17+", // Changed to 17+ for testing
    "נטפליקס": 1,
    "יס": 0,
    "הוט": 0,
    trailer: "https://www.youtube.com/watch?v=godfather_trailer_example",
    Duration: 175 // Added Duration
  }
];

// פונקציה לטעינת מאגר סרטים
let moviesDatabase = null;

async function loadMoviesDatabase() {
  if (moviesDatabase) return moviesDatabase;
  
  try {
    console.log("📚 מנסה לטעון את מאגר הסרטים...");
    const response = await fetch('movies.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load movies: ${response.status} ${response.statusText}`);
    }
    
    moviesDatabase = await response.json();
    console.log(`✅ נטענו ${moviesDatabase.length} סרטים מהמאגר המקומי`);
    console.log("📊 דוגמה לסרט:", moviesDatabase[0]);
    return moviesDatabase;
  } catch (error) {
    console.error("❌ שגיאה בטעינת הסרטים:", error);
    console.log("⚠️ משתמש במאגר סרטים זמני");
    moviesDatabase = backupMovies;
    return moviesDatabase;
  }
}

// 📚 מאגר מילות מפתח
const keywords = {
  // ז'אנרים
  genres: {
    "אקשן": ["אקשן", "פעולה", "action", "קרב", "מרדף", "הרפתקה"],
    "קומדיה": ["קומדיה", "מצחיק", "comedy", "הומור", "צחוק", "מבדר", "קל", "קליל", "כיפי"],
    "דרמה": ["דרמה", "רגשי", "drama", "מרגש", "עצוב", "רציני", "נוגע ללב", "דרמטי"],
    "רומנטי": ["רומנטי", "אהבה", "romance", "זוגי", "רומנטיקה", "מתוק", "עדין", "אהבה"],
    "אימה": ["אימה", "מפחיד", "horror", "אימה", "מבעית", "מצמרר", "דמים"],
    "מתח": ["מתח", "thriller", "מותחן", "ריגול"],
    "מדע בדיוני": ["מדע בדיוני", "sci-fi", "עתידני", "חלל", "רובוטים", "פנטזיה", "עתיד", "טכנולוגיה"],
    "פנטזיה": ["פנטזיה", "קסם", "דרקונים", "עולמות אחרים", "כישוף", "אגדה"],
    "אנימציה": ["אנימציה", "מצויר", "ילדים", "פיקסאר", "דיסני", "אנימה", "מנגה"],
    "תיעודי": ["תיעודי", "דוקומנטרי", "אמת", "מציאות", "היסטוריה", "טבע", "ביוגרפיה"],
    "ביוגרפיה": ["ביוגרפיה", "סיפור אמיתי", "חיים של", "אישיות", "היסטורי", "אדם אמיתי"],
    "היסטוריה": ["היסטוריה", "תקופה עתיקה", "עבר", "מלכים", "היסטורי"],
    "מוזיקלי": ["מוזיקלי", "שירים", "ריקוד", "מחזמר", "מוזיקה", "קליפים"],
    "מערבון": ["מערבון", "קאובוי", "פראי מערב", "סוסים", "אקדחים"],
    "פשע": ["פשע", "משטרה", "גניבה", "חוק", "פושעים", "בלש", "חקירה"],
    "מסתורין": ["מסתורין", "תעלומה", "בלש", "חקירה", "לא ברור", "חידה"],
    "משפחה": ["משפחה", "הורים", "אחים", "כיף לכל המשפחה"],
    "ספורט": ["ספורט", "כדורגל", "כדורסל", "אולימפיאדה", "תחרות", "נצחון"],
    "מלחמה": ["מלחמה", "קרב", "חיילים", "צבא", "היסטורי", "גבורה"]
  },
  // מצבי רוח
  moods: {
    "שמח": ["שמח", "מבדר", "קליל", "חיובי", "מאושר", "טוב לי", "מעולה", "מצוין", "נהדר", "כיפי", "קול", "בסדר", "אחלה", "סבבה"],
    "מרומם": ["מרומם", "מעורר השראה", "מוטיבציה", "הצלחה", "מעודד", "מחזק", "מעצים", "מעורר השראה", "אופטימי", "חיובי", "השראה"],
    "רגוע": ["רגוע", "נינוח", "שלווה", "מרגיע", "שליו", "נינוח", "מרגוע", "מנוחה", "שקט", "רפוי", "שלו"],
    "עצוב": ["עצוב", "מעוצבן", "כועס", "עצבני", "מתסכל", "מתסכל", "מעצבן", "מרגיז", "מעיק", "קשה", "רע לי", "לא טוב לי", "מבאס", "דיכאון", "באסה", "עצבות", "בכי"],
    "מרגש": ["מרגש", "נוגע ללב", "רגשי", "מרגש", "מרגש", "נוגע", "מרגש", "סוחף", "עוצמתי", "מותח"],
    "מפחיד": ["מפחיד", "מלחיץ", "מסתורי", "אימה", "מפחיד", "מלחיץ", "מטריד", "מבהיל", "פחד", "בעתה", "חרדה"],
    "רומנטי": ["רומנטי", "אהבה", "זוגי", "רומנטיקה", "אהבה", "זוגיות", "מתוק", "דביק", "נשיקה", "חיבוק"],
    "נוסטלגי": ["נוסטלגי", "זיכרונות", "ילדות", "עבר", "ישן", "קלאסי", "פעם", "זכרון", "עתיק"],
    "מעורר השראה": ["מעורר השראה", "מעודד", "מחזק", "מעצים", "מוטיבציה", "השראה", "התגברות", "הצלחה"],
    "משעשע": ["משעשע", "מצחיק", "מבדר", "קליל", "הומור", "צחוק", "שעשוע", "בדיחה", "קונדסון"],
    "משועמם": ["משועמם", "משעמם", "אין לי מה לעשות", "אוף", "חסר לי"],
    "עייף": ["עייף", "בלי כוח", "תשוש", "מותש", "אפיפות", "לישון"],
    "רעב": ["רעב", "לאכול", "אוכל", "נשנוש", "מזון"],
    "צמא": ["צמא", "לשתות", "שתיה", "מים"],
    "קר": ["קר", "קפוא", "צמרמורת", "קור"],
    "חם": ["חם", "שרב", "הביל", "חום"],
    "כואב": ["כואב", "פצוע", "חולה", "כאב"],
    "בסדר": ["בסדר", "סבבה", "אחלה", "טוב", "רגיל"],
    "לא יודע": ["לא יודע", "לא בטוח", "מתלבט", "אולי", "בערך"]
  },
  // פלטפורמות
  platforms: {
    "נטפליקס": ["נטפליקס", "netflix"],
    "יס": ["יס", "yes"],
    "הוט": ["הוט", "hot"]
  },
  // אורך סרט
  duration: {
    "קצר": ["קצר", "מהיר", "קליל", "קצת זמן"],
    "בינוני": ["בינוני", "רגיל", "סטנדרטי"],
    "ארוך": ["ארוך", "מפואר", "אפי", "מקיף"]
  },
  // פקודות
  commands: {
    "אחרים": ["אחרים", "נוספים", "עוד", "הבאים", "אחר"],
    "איפוס": ["התחל שיחה חדשה", "אפס", "חדש", "התחל מחדש"]
  }
};

// עדכון זיכרון השיחה
let conversationMemory = {
  lastGenres: [],
  lastMoods: [],
  lastPlatforms: [],
  lastRecommendations: [],
  lastQuestion: null,
  userPreferences: {
    age: null,
    duration: null,
    favoriteActors: [],
    favoriteDirectors: []
  },
  conversationState: "collecting_info",
  collectedInfo: {
    genres: false,
    age: false,
    mood: false,
    duration: false,
    platforms: false
  },
  recommendationOffset: 0 // New property to track how many movies have been shown
};

// עדכון שאלות אינטראקטיביות
const interactiveQuestions = [
  {
    id: "genres",
    question: "איזה סוגי סרטים אתה אוהב? (למשל: אקשן, קומדיה, דרמה וכו') 🎭",
    keywords: ["ז'אנר", "סוג", "סרטים", "אוהב"]
  },
  {
    id: "age",
    question: "מה הגיל שלך? זה יעזור לי להתאים סרטים מתאימים 👥",
    keywords: ["גיל", "בן", "בת", "ילד", "מבוגר"]
  },
  {
    id: "duration",
    question: "כמה זמן יש לך לצפות בסרט? (קצר/בינוני/ארוך) 🕒",
    keywords: ["זמן", "אורך", "כמה זמן", "משך"]
  },
  {
    id: "platforms",
    question: "האם יש לך מנוי לנטפליקס, יס או הוט? 📺",
    keywords: ["פלטפורמה", "מנוי", "נטפליקס", "יס", "הוט"]
  }
];

// פונקציה לניתוח טקסט
function analyzeText(text) {
  const lowerText = text.toLowerCase().trim();
  const analysis = {
    genres: [],
    moods: [],
    platforms: [],
    ageRange: null,
    duration: null,
    actors: [],
    directors: [],
    command: null
  };

  console.log("Debug: analyzeText - Input lowerText:", lowerText);

  // זיהוי פקודות
  for (const [command, words] of Object.entries(keywords.commands)) {
    if (words.some(word => lowerText.includes(word))) {
      analysis.command = command; // Store the detected command
      break; // Assume only one command per message for simplicity
    }
  }

  // זיהוי ז'אנרים - שיפור הזיהוי
  for (const [genre, words] of Object.entries(keywords.genres)) {
    if (words.some(word => lowerText.includes(word))) {
      analysis.genres.push(genre);
    }
  }

  // זיהוי מצבי רוח
  for (const [mood, words] of Object.entries(keywords.moods)) {
    if (words.some(word => lowerText.includes(word))) {
      analysis.moods.push(mood);
    }
  }

  // זיהוי פלטפורמות - שיפור משמעותי
  const platformKeywords = {
    "נטפליקס": ["נטפליקס", "netflix", "כן", "יש", "יש לי"],
    "יס": ["יס", "yes", "כן", "יש", "יש לי"],
    "הוט": ["הוט", "hot", "כן", "יש", "יש לי"]
  };

  // בדיקה לכל פלטפורמה - נבדוק גם התאמה מלאה למילה בודדת
  for (const [platform, keywords] of Object.entries(platformKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword) || lowerText === keyword)) {
      analysis.platforms.push(platform);
    }
  }

  // אם יש תשובה שלילית מפורשת, מנקים את הפלטפורמות
  const negativeKeywords = ["לא", "אין", "אין לי", "אף אחד"];
  if (negativeKeywords.some(keyword => lowerText === keyword || lowerText.includes(keyword))) {
    analysis.platforms = [];
  }

  // זיהוי אורך סרט
  for (const [duration, words] of Object.entries(keywords.duration)) {
    if (words.some(word => lowerText.includes(word))) {
      analysis.duration = duration;
    }
  }

  // זיהוי גיל - שיפור משמעותי
  const agePatterns = [
    /(\d+)\s*(?:שנה|שנים|גיל)/,  // בן 15 שנה, בן 15 שנים, גיל 15
    /בן\s*(\d+)/,                // בן 15
    /בת\s*(\d+)/,                // בת 15
    /אני\s*(\d+)/,               // אני 15
    /(\d+)\s*אני/,               // 15 אני
    /^(\d+)$/,                   // רק מספר (למשל: 15)
    /לגיל\s*(\d+)/,              // לגיל 13
    /בגיל\s*(\d+)/,              // בגיל 13
    /מתאים\s*(?:ל)?גיל\s*(\d+)/, // מתאים לגיל 13
    /(?:ל|ב)גיל\s*(\d+)/,        // לגיל 13 או בגיל 13
    /(?:ל|ב)ילדים\s*(?:בגיל)?\s*(\d+)/, // לילדים בגיל 13
    /(?:ל|ב)נוער\s*(?:בגיל)?\s*(\d+)/,  // לנוער בגיל 13
    /(?:ל|ב)מבוגרים\s*(?:בגיל)?\s*(\d+)/ // למבוגרים בגיל 13
  ];

  // בדיקת גיל לפי מספרים
  for (const pattern of agePatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const age = parseInt(match[1]);
      if (!isNaN(age)) {
        if (age < 13) analysis.ageRange = "7+";
        else if (age < 16) analysis.ageRange = "13+";
        else if (age < 17) analysis.ageRange = "16+"; // For ages 16 specifically
        else analysis.ageRange = "17+"; // For ages 17 and above
        break;
      }
    }
  }

  console.log("Debug: analyzeText - Detected ageRange (from patterns/numbers):", analysis.ageRange);

  // זיהוי גיל לפי מילות מפתח - שיפור משמעותי
  if (!analysis.ageRange) {
    const ageKeywords = {
      "7+": [
        "ילדים", "משפחתי", "ילד", "קטן", "צעיר", "לילדים", "לילד", "לילדה",
        "בן 5", "בת 5", "בן 6", "בת 6", "בן 7", "בת 7", "בן 8", "בת 8", "בן 9", "בת 9", "בן 10", "בת 10",
        "בן 11", "בת 11", "בן 12", "בת 12", "לכל המשפחה", "קטינים", "לגיל הרך"
      ],
      "13+": [
        "נוער", "נער", "נערה", "לנוער", "לנער", "לנערה", "מתבגר", "מתבגרת",
        "בן 13", "בת 13", "בן 14", "בת 14", "בן 15", "בת 15"
      ],
      "16+": [
        "בן 16", "בת 16", "מגיל 16"
      ],
      "17+": [ // New category for adult movies (17+ and above)
        "מבוגרים", "בוגר", "מבוגר", "למבוגרים", "לבוגר", "לבוגרת",
        "בן 17", "בת 17", "בן 18", "בת 18", "למבוגרים בלבד", "לקהל בוגר", "מגיל 18", "17+", "18+"
      ]
    };

    for (const [ageRange, keywords] of Object.entries(ageKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        analysis.ageRange = ageRange;
        break;
      }
    }
  }

  console.log("Debug: analyzeText - Detected ageRange (from keywords):", analysis.ageRange);

  // זיהוי שחקנים ובמאים
  const starsMatch = lowerText.match(/משחק(?:ים)?\s+(?:בו|בה)\s+([^,.]+)/);
  if (starsMatch) {
    analysis.actors = starsMatch[1].split(/\s+ו\s+/);
  }

  const directorMatch = lowerText.match(/ביים\s+([^,.]+)/);
  if (directorMatch) {
    analysis.directors = [directorMatch[1]];
  }

  console.log("Debug: analyzeText - Final analysis:", analysis);
  return analysis;
}

// פונקציה לחישוב דמיון בין סרטים
function calculateSimilarity(movie1, movie2) {
  let score = 0;
  
  // השוואת ז'אנרים
  const genres1 = movie1.Genres.toLowerCase().split(", ");
  const genres2 = movie2.Genres.toLowerCase().split(", ");
  const commonGenres = genres1.filter(g => genres2.includes(g));
  score += commonGenres.length * 2;

  // השוואת דירוג
  const ratingDiff = Math.abs(parseFloat(movie1.Rating) - parseFloat(movie2.Rating));
  score += (10 - ratingDiff) * 0.5;

  // השוואת שנה
  const yearDiff = Math.abs(movie1.Release_Year - movie2.Release_Year);
  score += (10 - Math.min(yearDiff, 10)) * 0.3;

  return score;
}

// פונקציה לזיהוי טקסט לא ברור
function isUnclearText(text) {
  // בדיקה אם הטקסט קצר מדי
  if (text.length < 2) return true;
  
  // בדיקה אם הטקסט מכיל רק סימני פיסוק או רווחים
  if (/^[\s\p{P}]+$/u.test(text)) return true;
  
  // בדיקה אם הטקסט מכיל רק מספרים
  if (/^\d+$/.test(text)) return true;
  
  // בדיקה אם הטקסט מכיל רק אותיות בודדות
  if (/^[א-ת]{1,2}$/.test(text)) return true;
  
  // בדיקה אם הטקסט מכיל רק סימנים מיוחדים
  if (/^[^א-תa-zA-Z0-9\s]+$/.test(text)) return true;
  
  return false;
}

// פונקציה לבדיקת הבנה של תשובה
function checkUnderstanding(message, questionId) {
  const analysis = analyzeText(message);
  const lowerMessage = message.toLowerCase();

  // בדיקה אם הטקסט לא ברור - עברה לסוף הבדיקות הספציפיות
  // if (isUnclearText(message)) {
  //   return false;
  // }

  switch(questionId) {
    case "genres":
      // בדיקת ז'אנרים - נשאר כפי שהיה
      return analysis.genres.length > 0;
    case "age":
      // בדיקת גיל - נשאר כפי שהיה
      // שיפור בדיקת הבנה של גיל
      if (analysis.ageRange) return true;
      // בדיקה אם יש מספרים בהודעה
      const hasNumbers = /^\d+$/.test(message.trim()); // בודק אם ההודעה היא רק מספר
      if (hasNumbers) {
        const age = parseInt(message.trim());
        if (!isNaN(age) && age > 0 && age < 120) { // בדיקה שהמספר הוא גיל הגיוני
          return true;
        }
      }
      // בדיקה אם יש מילות מפתח הקשורות לגיל
      const ageKeywords = ["ילד", "נוער", "מבוגר", "בוגר", "משפחתי"];
      return ageKeywords.some(keyword => lowerMessage.includes(keyword));
    case "duration":
      // בדיקת אורך סרט - נשאר כפי שהיה
      return analysis.duration !== null;
    case "platforms":
      // בדיקת הבנה של פלטפורמות - שיפור הלוגיקה כאן
      const platformKeywords = {
        "נטפליקס": ["נטפליקס", "netflix", "כן", "יש", "יש לי"],
        "יס": ["יס", "yes", "כן", "יש", "יש לי"],
        "הוט": ["הוט", "hot", "כן", "יש", "יש לי"]
      };

      // בדיקה ראשונה: האם יש תשובה חיובית כלשהי או התייחסות לפלטפורמה ספציפית (כולל מילים בודדות)
      const hasPositiveOrSpecificResponse = Object.values(platformKeywords).some(keywords =>
        keywords.some(keyword => lowerMessage.includes(keyword) || lowerMessage === keyword)
      );
      if (hasPositiveOrSpecificResponse) return true;

      // בדיקה שנייה: האם יש תשובה שלילית (כולל מילים בודדות)
      const negativeKeywords = ["לא", "אין", "אין לי", "אף אחד"];
      const hasNegativeResponse = negativeKeywords.some(keyword => lowerMessage.includes(keyword) || lowerMessage === keyword);
      if (hasNegativeResponse) return true;

      // בדיקה שלישית (רק אם לא זוהתה תשובה רלוונטית): האם הטקסט לא ברור
      return !isUnclearText(message);

    default:
      // אם לא נשאלה שאלה ספציפית, נבדוק אם הטקסט לא ברור
      return !isUnclearText(message);
  }

  // בדיקה אם הטקסט לא ברור - הועברה לכאן
  // return !isUnclearText(message);
}

// פונקציה לקבלת שאלה הבאה - מצב רוח לא נשאל במפורש יותר
function getNextQuestion() {
  // בדיקה אם יש מספיק מידע להמלצות
  const allInfoCollected = Object.values(conversationMemory.collectedInfo).every(info => info === true);
  if (allInfoCollected) {
    return null;
  }

  // בדיקת סדר השאלות לפי עדיפות
  const questionOrder = ["genres", "age", "duration", "platforms"];
  
  for (const questionId of questionOrder) {
    if (!conversationMemory.collectedInfo[questionId]) {
      return interactiveQuestions.find(q => q.id === questionId);
    }
  }

  return null;
}

// פונקציה ליצירת תשובה חכמה - הבוט ינתח מצב רוח בכל הודעה ויעקוב אחרי איסוף המידע באופן גמיש יותר
function generateSmartResponse(message, movies) {
  const analysis = analyzeText(message);
  let response = "";

  console.log("Debug: generateSmartResponse - analysis from current message:", analysis);
  console.log("Debug: generateSmartResponse - conversationMemory before update:", { ...conversationMemory });

  // Reset offset if primary preferences are explicitly updated
  const primaryPreferencesUpdated = 
    (analysis.genres.length > 0 && conversationMemory.lastGenres.length === 0) || // New genre detected
    (analysis.genres.length > 0 && JSON.stringify(analysis.genres) !== JSON.stringify(conversationMemory.lastGenres)) || // Genre changed
    (analysis.ageRange && conversationMemory.userPreferences.age === null) || // New age detected
    (analysis.ageRange && analysis.ageRange !== conversationMemory.userPreferences.age) || // Age changed
    (analysis.duration && conversationMemory.userPreferences.duration === null) || // New duration detected
    (analysis.duration && analysis.duration !== conversationMemory.userPreferences.duration) || // Duration changed
    (analysis.platforms.length > 0 && conversationMemory.lastPlatforms.length === 0) || // New platform detected
    (analysis.platforms.length > 0 && JSON.stringify(analysis.platforms) !== JSON.stringify(conversationMemory.lastPlatforms)); // Platform changed

  if (primaryPreferencesUpdated) {
    conversationMemory.recommendationOffset = 0;
    console.log("Debug: generateSmartResponse - Primary preferences updated, resetting offset to 0.");
  } else if (analysis.command === "אחרים") {
    // If requesting 'other' recommendations, increment offset
    conversationMemory.recommendationOffset += 3; // Show next 3 movies
    console.log("Debug: generateSmartResponse - 'Other' command detected, incrementing offset to:", conversationMemory.recommendationOffset);
  }

  // עדכון זיכרון השיחה על פי כל המידע שנמצא באנליזה, ללא קשר לשאלה האחרונה
  if (analysis.genres.length > 0) {
    conversationMemory.lastGenres = analysis.genres;
    conversationMemory.collectedInfo.genres = true;
  }
  if (analysis.moods.length > 0) {
    conversationMemory.lastMoods = analysis.moods; // מצב רוח תמיד מתעדכן
  }
  if (analysis.platforms.length > 0) {
    conversationMemory.lastPlatforms = analysis.platforms;
    conversationMemory.collectedInfo.platforms = true;
  }
  if (analysis.ageRange) {
    conversationMemory.userPreferences.age = analysis.ageRange;
    conversationMemory.collectedInfo.age = true;
  }
  if (analysis.duration) {
    conversationMemory.userPreferences.duration = analysis.duration;
    conversationMemory.collectedInfo.duration = true;
  }
  // אין צורך לעדכן collectedInfo עבור שחקנים ובמאים כי הם לא חלק מתהליך איסוף המידע הבסיסי להמלצה ראשונית
  if (analysis.actors.length > 0) {
      conversationMemory.userPreferences.favoriteActors = analysis.actors;
  }
  if (analysis.directors.length > 0) {
      conversationMemory.userPreferences.favoriteDirectors = analysis.directors;
  }

  console.log("Debug: generateSmartResponse - conversationMemory after update:", { ...conversationMemory });

  // בדיקה אם יש מספיק מידע להמלצות (ז'אנרים, גיל, אורך, פלטפורמות)
  const infoTypesToCollect = ["genres", "age", "duration", "platforms"];
  const allRequiredInfoCollected = infoTypesToCollect.every(type => conversationMemory.collectedInfo[type] === true);

  console.log("Debug: generateSmartResponse - allRequiredInfoCollected:", allRequiredInfoCollected);

  if (allRequiredInfoCollected) {
    conversationMemory.conversationState = "recommending";
    // Analyze and find movies using the accumulated preferences in conversationMemory
    const foundMovies = analyzeAndFindMovies(message, movies);
    
    const moviesToRecommend = foundMovies.slice(conversationMemory.recommendationOffset, conversationMemory.recommendationOffset + 3);

    if (moviesToRecommend.length > 0) {
      response += "<br><br>הנה כמה המלצות בשבילך:<br><br>";
      
      moviesToRecommend.forEach((movie, index) => {
        response += `${index + 1}. ${formatMovieRecommendation(movie)}<br><br>`;
      });
      
      // Add a message if there are more movies
      if (foundMovies.length > (conversationMemory.recommendationOffset + 3)) {
        response += "<br>רוצה לראות המלצות נוספות? פשוט תגיד 'עוד' או 'אחרים'! 😉";
      }

      // הוספת תגובה מותאמת למצב רוח בסוף ההמלצות
      if (analysis.moods.length > 0) { // נשתמש במצב הרוח מהאנליזה הנוכחית
        const mood = analysis.moods[0];
        switch(mood) {
          case "עצוב":
            response += "💝 מקווה שהסרטים האלה יעזרו לשפר את מצב הרוח שלך!";
            break;
          case "מרגש":
            response += "💖 מקווה שתהנה מהסרטים המרגשים האלה!";
            break;
          case "רומנטי":
            response += "💕 מקווה שתהנה מהסרטים הרומנטיים האלה!";
            break;
          case "מעורר השראה":
            response += "✨ מקווה שהסרטים האלה יעוררו בך השראה!";
            break;
          case "נוסטלגי":
            response += "🌟 מקווה שהסרטים האלה יעירו זיכרונות נעימים!";
            break;
          case "משעשע":
            response += "😊 מקווה שהסרטים האלה יעלו לך חיוך!";
            break;
        }
      }
      
     /* response += "<br><br>💬 רוצה המלצות נוספות? אפשר להתחיל שיחה חדשה!";
      conversationMemory.lastQuestion = null;*/

    } else {
      // No more movies found for the current offset or initial search
      if (conversationMemory.recommendationOffset > 0) {
        response += "<br><br>זהו, נראה שאלו כל הסרטים שמצאתי עבור ההעדפות הנוכחיות שלך. אולי ננסה עם העדפות אחרות? 😉";
      } else {
        response += "<br><br>מצטער, לא מצאתי סרטים שמתאימים בדיוק להעדפות שלך.";
      }
      // Always reset collected info and offset if no movies are found to encourage new input
      conversationMemory.collectedInfo = {
          genres: false,
          age: false,
          mood: false,
          duration: false,
          platforms: false
      };
      conversationMemory.lastGenres = [];
      conversationMemory.lastPlatforms = [];
      conversationMemory.userPreferences.age = null;
      conversationMemory.userPreferences.duration = null;
      conversationMemory.userPreferences.favoriteActors = [];
      conversationMemory.userPreferences.favoriteDirectors = [];
      conversationMemory.recommendationOffset = 0; // Reset offset here too

      const nextQuestion = getNextQuestion();
       if (nextQuestion) {
        response += ` אולי ננסה שוב? ${nextQuestion.question}`;
        conversationMemory.lastQuestion = nextQuestion.id;
      } else {
          response += " אנא נסה לתאר את הסרט שאתה מחפש במילים אחרות.";
          conversationMemory.lastQuestion = null;
      }
    }
  } else {
    const nextQuestion = getNextQuestion();
    console.log("Debug: generateSmartResponse - nextQuestion:", nextQuestion ? nextQuestion.id : null);

    const providedInfo = [];
    if(analysis.genres.length > 0) providedInfo.push("ז'אנר");
    if(analysis.ageRange) providedInfo.push("גיל");
    if(analysis.duration) providedInfo.push("אורך סרט");
    if(analysis.platforms.length > 0) providedInfo.push("פלטפורמת צפייה");

    if(providedInfo.length > 0) {
        response += `תודה על המידע שסיפקת בנוגע ל${providedInfo.join(' ו-')}.`;
        if (analysis.moods.length > 0) {
            response += ` אני מבין שאתה מרגיש ${analysis.moods[0]}.`;
        }
        response += " <br><br>";
    } else {
         if (analysis.moods.length > 0) {
              response += `אני מבין שאתה מרגיש ${analysis.moods[0]}.`;
               response += " <br><br>";
         } else if (!isUnclearText(message)) {
            response += "תודה על המידע. ";
            response += " <br><br>";
         }
    }

    response += `${nextQuestion.question}`;
    conversationMemory.lastQuestion = nextQuestion.id;
  }

  console.log("Debug: generateSmartResponse - Final response length:", response.length);
  return response || "אשמח לעזור לך למצוא סרט מושלם! מה מעניין אותך?";
}

// פונקציה לחיפוש סרטים
function analyzeAndFindMovies(message, movies) {
  // analysis is for the current message, conversationMemory holds accumulated preferences
  const analysis = analyzeText(message);
  let filtered = [...movies];

  console.log("🔍 ניתוח הודעה:", message);
  console.log("📊 תוצאות ניתוח:", analysis);
  console.log("🧠 זיכרון שיחה נוכחי:", conversationMemory); // Added for debugging
    
  // סינון לפי ז'אנר (שימוש בזיכרון השיחה)
  if (conversationMemory.lastGenres.length > 0) {
    console.log("Debug: analyzeAndFindMovies - Filtering by genres:", conversationMemory.lastGenres);
    filtered = filtered.filter(movie => {
      const movieGenres = movie.Genres.toLowerCase().split(", ");
      // Ensure the movie includes ALL requested genres
      return conversationMemory.lastGenres.every(requestedGenre => {
        const englishGenre = getEnglishGenre(requestedGenre);
        // Split the English genre in case it contains multiple words (e.g., "Sci-Fi")
        const englishGenreWords = englishGenre.toLowerCase().split(/[\s-]+/);
        const genreMatch = movieGenres.some(movieGenre => {
          // Check if any of the English genre words are in the movie genre
          return englishGenreWords.some(word => movieGenre.includes(word));
        });
        console.log(`Debug: Checking if movie genres (${movieGenres.join(', ')}) include requested genre '${requestedGenre}' (English: '${englishGenre}'): ${genreMatch}`);
        return genreMatch;
      });
    });
    console.log("Debug: analyzeAndFindMovies - Movies after genre filtering:", filtered.map(m => m.Title));
  }

  // סינון לפי מצב רוח (שימוש בזיכרון השיחה)
  if (conversationMemory.lastMoods.length > 0) {
    console.log("Debug: analyzeAndFindMovies - Filtering by mood. Current movies:", filtered.map(m => m.Title));
    const mood = conversationMemory.lastMoods[0];
    switch(mood) {
      case "עצוב":
        filtered = filtered.filter(movie => 
          movie.Genres.toLowerCase().includes("comedy") || 
          movie.Genres.toLowerCase().includes("קומדיה")
        );
        break;
      case "מרגש":
        filtered = filtered.filter(movie => 
          movie.Genres.toLowerCase().includes("drama") || 
          movie.Genres.toLowerCase().includes("דרמה")
        );
        break;
      case "רומנטי":
        filtered = filtered.filter(movie => 
          movie.Genres.toLowerCase().includes("romance") || 
          movie.Genres.toLowerCase().includes("רומנטי")
        );
        break;
      case "מעורר השראה":
        filtered = filtered.filter(movie => 
          movie.Genres.toLowerCase().includes("drama") || 
          movie.Genres.toLowerCase().includes("דרמה") ||
          movie.Genres.toLowerCase().includes("biography") ||
          movie.Genres.toLowerCase().includes("ביוגרפי")
        );
        break;
      case "נוסטלגי":
        filtered = filtered.filter(movie => 
          movie.Release_Year < 2000
        );
        break;
      case "משעשע":
        filtered = filtered.filter(movie => 
          movie.Genres.toLowerCase().includes("comedy") || 
          movie.Genres.toLowerCase().includes("קומדיה")
        );
        break;
    }
    console.log("Debug: analyzeAndFindMovies - Movies after mood filtering:", filtered.map(m => m.Title));
  }

  // סינון לפי פלטפורמה (שימוש בזיכרון השיחה)
  if (conversationMemory.lastPlatforms.length > 0) {
    console.log("Debug: analyzeAndFindMovies - Filtering by platforms. Current movies:", filtered.map(m => m.Title));
    filtered = filtered.filter(movie => 
      conversationMemory.lastPlatforms.some(platform => movie[platform] === 1)
    );
    console.log("Debug: analyzeAndFindMovies - Movies after platform filtering:", filtered.map(m => m.Title));
  }

  // סינון לפי גיל (כבר תוקן לשימוש בזיכרון השיחה)
  if (conversationMemory.userPreferences.age) {
    console.log("Debug: analyzeAndFindMovies - Filtering by age. User preference:", conversationMemory.userPreferences.age, ". Current movies:", filtered.map(m => m.Title));
    filtered = filtered.filter(movie => {
      const movieAgeRange = parseInt(movie.ageRange);
      const userAgePreference = parseInt(conversationMemory.userPreferences.age);
      let isMatch = false;

      // Special handling for "16+" and now "17+" to exclude younger ratings
      if (userAgePreference >= 16) { // Changed from userAgePreference === 16
        // If user wants 16+ or 17+, only show movies with that age rating or higher
        isMatch = movieAgeRange >= userAgePreference;
      } else {
        // For 7+ or 13+, use the inclusive logic (suitable for this age or younger)
        isMatch = movieAgeRange <= userAgePreference;
      }
      
      console.log(`Debug: Checking movie '${movie.Title}' (age: ${movie.ageRange}) against user preference '${conversationMemory.userPreferences.age}'. Match: ${isMatch}`);
      return isMatch;
    });
    console.log("Debug: analyzeAndFindMovies - Movies after age filtering:", filtered.map(m => m.Title));
  }

  // סינון לפי אורך סרט (שימוש בזיכרון השיחה)
  if (conversationMemory.userPreferences.duration) {
    console.log("Debug: analyzeAndFindMovies - Filtering by duration. User preference:", conversationMemory.userPreferences.duration, ". Current movies:", filtered.map(m => m.Title));
    filtered = filtered.filter(movie => {
      const duration = movie.Duration || 0;
      if (conversationMemory.userPreferences.duration === "קצר") return duration <= 90;
      if (conversationMemory.userPreferences.duration === "בינוני") return duration > 90 && duration <= 120;
      if (conversationMemory.userPreferences.duration === "ארוך") return duration > 120;
      return true;
    });
    console.log("Debug: analyzeAndFindMovies - Movies after duration filtering:", filtered.map(m => m.Title));
  }

  // סינון לפי שחקנים (שימוש בזיכרון השיחה)
  if (conversationMemory.userPreferences.favoriteActors.length > 0) {
    filtered = filtered.filter(movie => 
      conversationMemory.userPreferences.favoriteActors.some(actor => 
        movie.Stars && movie.Stars.toLowerCase().includes(actor.toLowerCase())
      )
    );
  }

  // סינון לפי במאים (שימוש בזיכרון השיחה)
  if (conversationMemory.userPreferences.favoriteDirectors.length > 0) {
    filtered = filtered.filter(movie => 
      conversationMemory.userPreferences.favoriteDirectors.some(director => 
        movie.Director && movie.Director.toLowerCase().includes(director.toLowerCase())
      )
    );
  }

  // מיון לפי דירוג
  filtered.sort((a, b) => parseFloat(b.Rating) - parseFloat(a.Rating));

  // שמירת ההמלצות בזיכרון
  if (filtered.length > 0) {
    conversationMemory.lastRecommendations = filtered.slice(0, 3);
  }

  return filtered;
}

// פונקציה להמרת ז'אנר עברי לאנגלי
function getEnglishGenre(hebrewGenre) {
  const genreMap = {
    "אקשן": "Action",
    "קומדיה": "Comedy",
    "דרמה": "Drama",
    "רומנטי": "Romance",
    "אימה": "Horror",
    "מתח": "Thriller",
    "מדע בדיוני": "Sci-Fi",
    "פנטזיה": "Fantasy",
    "אנימציה": "Animation",
    "תיעודי": "Documentary",
    "ביוגרפיה": "Biography",
    "היסטוריה": "History",
    "מוזיקלי": "Musical",
    "מערבון": "Western",
    "פשע": "Crime",
    "מסתורין": "Mystery",
    "משפחה": "Family",
    "ספורט": "Sport",
    "מלחמה": "War"
  };
  console.log(`Debug: getEnglishGenre - Mapping '${hebrewGenre}' to '${genreMap[hebrewGenre] || hebrewGenre}'`);
  return genreMap[hebrewGenre] || hebrewGenre;
}

// פורמט הצגת סרט
function formatMovieRecommendation(movie) {
  const platforms = [];
  if (movie["נטפליקס"] === 1) platforms.push("נטפליקס");
  if (movie["יס"] === 1) platforms.push("יס");
  if (movie["הוט"] === 1) platforms.push("הוט");

  // יצירת קישור לטריילר - נשתמש בקישור ישיר אם קיים, אחרת בחיפוש
  let trailerLinkHTML = '';
  if (movie.trailer) {
      trailerLinkHTML = `<br>🎥 <a href="${movie.trailer}" target="_blank" class="movie-link">צפה בטריילר</a>`;
  } else {
      // יצירת קישור לחיפוש הטריילר ב-YouTube כגיבוי
      const searchQuery = encodeURIComponent(`${movie.Title} ${movie.Release_Year} trailer`);
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
      trailerLinkHTML = `<br>🎥 <a href="${youtubeSearchUrl}" target="_blank" class="movie-link">חפש טריילר ביוטיוב</a>`;
  }

  let html = `🎬 <strong>"${movie.Title}"</strong> (${movie.Release_Year})<br>
🎭 ז'אנר: ${movie.Genres}<br>
⭐ דירוג IMDb: <strong>${movie.Rating}</strong><br>
👥 גיל מומלץ: ${movie.ageRange}<br>
📺 זמין ב: ${platforms.join(", ") || "לא צוינה פלטפורמה"}`;

  // הוספת קישור הטריילר (או חיפוש) שיצרנו
  html += trailerLinkHTML;

  return html;
}

// 📨 הפונקציה הראשית לשליחת הודעה
async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  input.value = ""; // Clear input immediately at the very beginning

  const lowerMessage = message.toLowerCase();
  const greetings = ["היי", "שלום", "הי", "בוקר טוב"];
  const resetKeywords = ["התחל שיחה חדשה", "אפס", "חדש"];

  const convo = document.getElementById("conversation");

  // Handle explicit reset commands first
  if (resetKeywords.some(k => lowerMessage.includes(k))) {
    clearConversation(message); // clearConversation will handle displaying user message and new welcome.
    convo.scrollTop = convo.scrollHeight;
    return; // Exit function after handling reset
  }

  // Handle simple greetings without resetting the whole conversation
  if (greetings.some(g => lowerMessage.includes(g))) {
    convo.innerHTML += `<div class='bubble user'>${message}</div>`; // Display user's greeting
    // Display bot's welcome message without clearing history
    const welcomeResponse = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    convo.innerHTML += `<div class='bubble bot'>
      <img src="OSCARPIC.jpeg" alt="Oscar" class="bot-avatar">
      <div class="bot-message">${welcomeResponse}</div>
    </div>`;
    convo.scrollTop = convo.scrollHeight;
    // Do NOT reset conversationMemory here, just respond and continue
    return; // Exit after greeting response
  }

  // If not a reset or a simple greeting, proceed as usual:
  convo.innerHTML += `<div class='bubble user'>${message}</div>`; // Add user's message
  const loadingId = Date.now();
  convo.innerHTML += `<div class='bubble bot' id='loading-${loadingId}'>
    <img src="OSCARPIC.jpeg" alt="Oscar" class="bot-avatar">
    <div class="bot-message">🤔 חושב על התשובה הטובה ביותר...</div>
  </div>`;

  try {
    const movies = await loadMoviesDatabase();
    const smartResponse = generateSmartResponse(message, movies);

    document.getElementById(`loading-${loadingId}`).remove();
    convo.innerHTML += `<div class='bubble bot'>
      <img src="OSCARPIC.jpeg" alt="Oscar" class="bot-avatar">
      <div class="bot-message">${smartResponse}</div>
    </div>`;

  } catch (error) {
    const loadingElement = document.getElementById(`loading-${loadingId}`);
    if (loadingElement) loadingElement.remove();
    
    console.error("❌ שגיאה:", error);
    showError(error);
  }

  convo.scrollTop = convo.scrollHeight;
}

// פונקציה לטיפול בשגיאות
function showError(error) {
  const convo = document.getElementById("conversation");
  let errorMessage = "אופס! משהו השתבש. בוא ננסה שוב? 🔧";
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error.message) {
    if (error.message.includes("401") || error.message.includes("API")) {
      errorMessage = `⚠️ נראה שיש בעיה עם הטוקן של Hugging Face.<br>
        אנא בדוק שהטוקן תקין במשתנה HF_API_KEY.<br>
        אפשר לקבל טוקן חדש ב: https://huggingface.co/settings/tokens`;
    } else if (error.message.includes("Failed to load movies")) {
      errorMessage = `⚠️ לא הצלחתי לטעון את מאגר הסרטים.<br>
        אנא וודא שקובץ movies.json קיים ונגיש.`;
    }
  }
  
  convo.innerHTML += `<div class='bubble bot'>
    <img src="OSCARPIC.jpeg" alt="Oscar" class="bot-avatar">
    <div class="bot-message">${errorMessage}</div>
  </div>`;
}

// אירועי מקלדת ופתיחה
document.addEventListener('DOMContentLoaded', async function() {
  const input = document.getElementById("userInput");
  if (input) {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // בדיקת חיבור API ותצוגת הודעת פתיחה
  const convo = document.getElementById("conversation");
  
  // הודעת פתיחה
  const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  convo.innerHTML += `<div class='bubble bot'>
    <img src="OSCARPIC.jpeg" alt="Oscar" class="bot-avatar">
    <div class="bot-message">${randomWelcome}</div>
  </div>`;

  // בדיקת חיבור
  console.log("🔄 מתחיל בדיקת חיבור ל-API...");
  const apiWorking = await testHuggingFaceAPI();
  if (!apiWorking) {
    convo.innerHTML += `<div class='bubble bot'>
      <img src="OSCARPIC.jpeg" alt="Oscar" class="bot-avatar">
      <div class="bot-message">
      ⚠️ יש בעיה בחיבור ל-Hugging Face API.<br>
      אנא בדוק:<br>
      1. שהטוקן תקין<br>
      2. שיש חיבור לאינטרנט<br>
      3. שהמודל זמין<br>
      <br>
      אם הבעיה נמשכת, נסה לרענן את הדף.
      </div>
    </div>`;
  } else {
    console.log("✅ Hugging Face API מוכן לשימוש!");
  }
});

// פונקציה לניקוי השיחה - כעת מקבלת את הודעת המשתמש כארגומנט
function clearConversation(userMessage = null) {
  const convo = document.getElementById("conversation");
  convo.innerHTML = ''; // Always clear the conversation
  conversationMemory = {
    lastGenres: [],
    lastMoods: [],
    lastPlatforms: [],
    lastRecommendations: [],
    lastQuestion: null,
    userPreferences: {
      age: null,
      duration: null,
      favoriteActors: [],
      favoriteDirectors: []
    },
    conversationState: "collecting_info",
    collectedInfo: {
      genres: false,
      age: false,
      mood: false,
      duration: false,
      platforms: false
    },
    recommendationOffset: 0 // New property to track how many movies have been shown
  };
  
  // אם נשלחה הודעת משתמש, הוסף אותה ראשונה
  if (userMessage) {
    convo.innerHTML += `<div class='bubble user'>${userMessage}</div>`;
  }

  const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  convo.innerHTML += `<div class='bubble bot'>
    <img src="OSCARPIC.jpeg" alt="Oscar" class="bot-avatar">
    <div class="bot-message">${randomWelcome}</div>
  </div>`;
}

// פונקציה לבדיקת חיבור ל-Hugging Face API
async function testHuggingFaceAPI() {
  try {
    const response = await fetch(MODEL_URL, {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({ inputs: "שלום" }), // Small test input
    });
    return response.ok; // Returns true if status is 2xx
  } catch (error) {
    console.error("❌ שגיאה בבדיקת חיבור ל-API:", error);
    return false;
  }
}
