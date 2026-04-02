/* ============================================================
   Portfolio Configuration — js/config.js
   ------------------------------------------------------------
   This file stores your permanent portfolio data. 
   When you deploy to Vercel, this is what the public sees.
   ============================================================ */

const CMS_CONFIG = {
    hero: {
        title: "Hello World",
        subtitle: "It's Thokala Kumar Reddy, a specialized design wizard."
    },
    about: {
        description: "I'm a visionary developer who blends striking visual design with robust engineering. Specializing in scroll-driven storytelling and immersive digital experiences, my focus is on crafting premium, interactive web applications that leave a lasting impression.",
        stats: [
            { val: "1+ Year", label: "Learning Journey" },
            { val: "10+", label: "Projects Completed" },
            { val: "100%", label: "Passionate Commitment" }
        ]
    },
    skills: [
        "UI/UX Architecture",
        "Frontend Development",
        "Vanilla JavaScript",
        "HTML5 & CSS3",
        "Motion Engineering",
        "Performance Optimization",
        "Responsive Design"
    ],
    projects: [
        {
            title: "Aura FinTech Dashboard",
            desc: "A next-generation financial interface for high-frequency traders, featuring real-time data visualization.",
            img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
            link: "#"
        },
        {
            title: "Lumina E-Commerce",
            desc: "An elite headless e-commerce experience for a luxury fashion brand with blazing-fast checkout flows.",
            img: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop",
            link: "#"
        },
        {
            title: "Nexus Web3 Platform",
            desc: "A decentralized portal with premium visual design, integrating Web3 authentication and smart contracts.",
            img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
            link: "#"
        }
    ],
    experience: [
        {
            date: "2024 – Present",
            role: "Junior Developer Intern",
            org: "Thokala Kumar Reddy Projects",
            desc: "Leading the development of a premium personal portfolio CMS, focusing on architectural integrity and minimalist aesthetics."
        }
    ],
    education: [
        {
            date: "2010 – 2014",
            role: "BSc in Computer Science",
            org: "University of Technology",
            desc: "Graduated with Honors. Specialized in Human-Computer Interaction and Advanced Web Technologies.",
            grade: "8.5 CGPA"
        },
        {
            date: "2015",
            role: "Advanced UI/UX Certification",
            org: "Design Institute",
            desc: "Intensive program focused on user-centered design, wireframing, and interactive prototyping.",
            grade: "90%"
        }
    ],
    resume: {
        description: "Interested in the finer details of my career? Download my full digital resume below.",
        buttonText: "Download Resume v2.0",
        fileData: "", // Base64 data if available
        fileName: "Resume.pdf"
    },
    socials: {
        linkedin: "#",
        github: "#",
        leetcode: "#",
        instagram: "#"
    },
    portrait: {
        src: "https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=900&auto=format&fit=crop"
    }
};

window.CMS_CONFIG = CMS_CONFIG;
