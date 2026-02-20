/**
 * Templates Page — Static config
 */
export const categories = [
    { id: "all", label: "All Templates", icon: "file" },
    { id: "contact", label: "Contact Forms", icon: "message" },
    { id: "registration", label: "Registration", icon: "clipboard" },
    { id: "survey", label: "Surveys", icon: "users" },
    { id: "booking", label: "Booking", icon: "calendar" },
    { id: "order", label: "Order Forms", icon: "cart" },
    { id: "feedback", label: "Feedback", icon: "heart" },
    { id: "lead", label: "Lead Generation", icon: "trending" },
];

export const templates = [
    { id: "t1", name: "Contact Form", description: "Simple contact form with name, email, and message", category: "contact", popular: true, uses: "12.5k", fields: ["Name", "Email", "Message", "Phone"] },
    { id: "t2", name: "Customer Survey", description: "Gather valuable feedback from your customers", category: "survey", popular: true, uses: "8.2k", fields: ["Rating", "Comments", "Suggestions"] },
    { id: "t3", name: "Event Registration", description: "Collect attendee information for events", category: "registration", popular: true, uses: "6.8k", fields: ["Name", "Email", "Attendees", "Dietary"] },
    { id: "t4", name: "Job Application", description: "Professional job application with resume upload", category: "registration", popular: true, uses: "5.4k", fields: ["Resume", "Cover Letter", "Experience"] },
    { id: "t5", name: "Product Feedback", description: "Collect detailed product feedback and suggestions", category: "feedback", popular: false, uses: "4.1k", fields: ["Product", "Rating", "Feedback"] },
    { id: "t6", name: "Order Form", description: "Accept orders with product selection and payment", category: "order", popular: false, uses: "3.8k", fields: ["Product", "Quantity", "Address"] },
    { id: "t7", name: "Newsletter Signup", description: "Build your email list with a simple signup form", category: "lead", popular: false, uses: "9.2k", fields: ["Email", "Name", "Preferences"] },
    { id: "t8", name: "Appointment Booking", description: "Let customers schedule appointments online", category: "booking", popular: false, uses: "4.5k", fields: ["Date", "Time", "Service", "Contact"] },
    { id: "t9", name: "NPS Survey", description: "Net Promoter Score survey to measure loyalty", category: "survey", popular: false, uses: "3.2k", fields: ["Score", "Reason", "Follow-up"] },
    { id: "t10", name: "Support Request", description: "Collect support tickets and bug reports", category: "feedback", popular: false, uses: "2.9k", fields: ["Issue", "Priority", "Screenshot"] },
    { id: "t11", name: "Quote Request", description: "Let customers request quotes for services", category: "lead", popular: false, uses: "2.4k", fields: ["Service", "Budget", "Timeline"] },
    { id: "t12", name: "Course Enrollment", description: "Accept applications for courses or programs", category: "registration", popular: false, uses: "2.1k", fields: ["Course", "Payment", "Background"] },
];

export const iconPaths: Record<string, string> = {
    file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    clipboard: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6v4H9V2z M12 11v6 M9 14h6",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    calendar: "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",
    cart: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6 M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    trending: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
};
