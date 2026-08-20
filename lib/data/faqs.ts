import { connectDB } from "@/lib/db/connect";
import { FAQ } from "@/models/FAQ";
import { serializeDocs } from "@/lib/data/serialize";

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
}

const fallbackFaqs: FAQItem[] = [
  {
    _id: "1",
    question: "What does Netbrandit do?",
    answer:
      "Netbrandit brings websites, apps, AI automation, social media, advertising, SEO, competitor research, and broader marketing strategy together around the needs of a small business.",
    category: "general",
    sortOrder: 1,
  },
  {
    _id: "2",
    question: "Who do you work with?",
    answer:
      "Netbrandit is designed for small-business owners who want practical help improving their brand, digital presence, lead generation, or internal workflows.",
    category: "general",
    sortOrder: 2,
  },
  {
    _id: "3",
    question: "Do custom websites really start at $99?",
    answer:
      "Yes, website projects can start from CAD 99. The final price depends on scope, pages, functionality, content, integrations, and timeline. A clear quote is provided after discovery.",
    category: "pricing",
    sortOrder: 3,
  },
  {
    _id: "4",
    question: "How long will my project take?",
    answer:
      "Timing depends on scope, feedback, content readiness, and required functionality. A realistic delivery plan is provided before work begins.",
    category: "process",
    sortOrder: 4,
  },
  {
    _id: "5",
    question: "Do you guarantee ad results or Google rankings?",
    answer:
      "No responsible agency can guarantee a specific ranking, lead volume, revenue result, or return. Netbrandit focuses on sound setup, strategy, testing, optimisation, and transparent reporting.",
    category: "marketing",
    sortOrder: 5,
  },
  {
    _id: "6",
    question: "How do I get started?",
    answer:
      "Submit the growth-plan form or book a discovery call. Netbrandit will review your goals, challenges, timeline, and priorities before recommending next steps.",
    category: "general",
    sortOrder: 6,
  },
];

export async function getPublishedFaqs(limit?: number): Promise<FAQItem[]> {
  try {
    await connectDB();
    let query = FAQ.find({ status: "published" }).sort({ sortOrder: 1 });
    if (limit) query = query.limit(limit);
    const faqs = await query.lean();
    if (faqs.length) return serializeDocs<FAQItem>(faqs);
  } catch {
    // fall through
  }
  return limit ? fallbackFaqs.slice(0, limit) : fallbackFaqs;
}

export async function getFaqCategories(): Promise<string[]> {
  const faqs = await getPublishedFaqs();
  return [...new Set(faqs.map((f) => f.category ?? "general"))];
}
