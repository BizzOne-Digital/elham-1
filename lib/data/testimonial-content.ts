import type { TestimonialItem } from "@/lib/data/testimonials";

/** Default published testimonials when the database is empty or unavailable. */
export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    _id: "t1",
    name: "Sarah Chen",
    role: "Owner",
    company: "Maple & Main Café",
    content:
      "We needed a website that actually brings in reservations, not just looks nice. Netbrandit rebuilt our site, tightened our Google listing, and gave us a simple way to track inquiries. Calls from the website started picking up within the first month.",
    rating: 5,
    sortOrder: 1,
    isFeatured: true,
  },
  {
    _id: "t2",
    name: "Marcus Reid",
    role: "Founder",
    company: "Reid Home Services",
    content:
      "I was juggling quotes in my inbox and losing follow-ups. They set up a clean site with a contact flow and helped me understand what to post locally. It feels professional now—and I spend less time chasing paperwork.",
    rating: 5,
    sortOrder: 2,
    isFeatured: true,
  },
  {
    _id: "t3",
    name: "Priya Sharma",
    role: "Co-owner",
    company: "Bloom Studio Marketing",
    content:
      "We wanted help with social content without hiring a full in-house team. The planning was structured, the creative direction was clear, and we finally had a calendar we could stick to.",
    rating: 5,
    sortOrder: 3,
    isFeatured: false,
  },
  {
    _id: "t4",
    name: "James Okafor",
    role: "Director",
    company: "Okafor Legal Support Services",
    content:
      "The discovery call was straightforward—no pressure, just honest scope talk. Our new pages explain what we do in plain language, and clients mention the site when they reach out.",
    rating: 5,
    sortOrder: 4,
    isFeatured: false,
  },
];
