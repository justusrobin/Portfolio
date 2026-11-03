export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  role: string;
  technologies: string[];
  year: string;
  status: string;
  liveUrl?: string;
  githubUrl?: string;
  image: string;
  exhibitionType: 'browser' | 'architecture' | 'telemetry' | 'hardware';
  highlights: string[];
  architectureNodes?: { label: string; sub: string }[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  code: string;
  image: string;
  category: string;
  details: string;
}

export interface TechCategory {
  category: string;
  skills: { name: string; level: string; desc: string }[];
}

export interface JourneyMilestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface Internship {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  cgpa: string;
  status: string;
}

export const PERSONAL_INFO = {
  fullName: "J JUSTUS ROBIN",
  displayName: "JUSTUS ROBIN",
  title: "FULL-STACK DEVELOPER",
  phone: "+91 94866 33017",
  email: "justusrobin2007@gmail.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  location: "Coimbatore, India",
  cgpa: "8.14",
  institution: "Karunya Institute of Technology and Sciences, Coimbatore",
  degree: "B.Tech — Computer Science & Engineering (2025 – 2029 Expected)",
  summary: "Second-year B.Tech student with hands-on experience building full-stack web applications using React, Node.js, Express, and MongoDB, and a demonstrated ability to design responsive, database-driven interfaces from the ground up. Completed an internship in solar system operations, gaining practical exposure to renewable energy technologies, system monitoring, and structured troubleshooting. Combines a strong technical foundation with an 8.14 CGPA and a track record of independently shipping functional web projects.",
  statement: "I build digital experiences where engineering, interaction and design meet.",
  heroStatement: "I build digital experiences at the intersection of technology, interaction and design.",
  machineModel: "ASUS ROG STRIX G17",
  machineSpecs: {
    cpu: "AMD Ryzen 7 6800H Processor",
    gpu: "NVIDIA GeForce RTX 3060 Laptop GPU",
    ram: "16GB DDR5 4800MHz RAM",
    storage: "1TB PCIe 4.0 NVMe M.2 SSD",
    display: "17.3-inch WQHD 240Hz Display",
    cooling: "ROG Intelligent Cooling with Liquid Metal"
  }
};

export const INTERNSHIPS: Internship[] = [
  {
    role: "System Operator Intern",
    company: "DAR Solar Solutions",
    period: "June 2026 (1 Month)",
    highlights: [
      "Monitored and managed real-time solar power system operations, ensuring consistent energy output and system reliability.",
      "Supported preventive maintenance and performance-tracking activities, helping identify and address operational inefficiencies.",
      "Diagnosed and resolved basic technical faults through structured troubleshooting, minimizing system downtime.",
      "Gained practical, hands-on exposure to renewable energy technologies and industrial operational workflows."
    ]
  }
];

export const EDUCATION_DETAILS: Education = {
  degree: "B.Tech — Computer Science & Engineering",
  institution: "Karunya Institute of Technology and Sciences, Coimbatore",
  period: "2025 – 2029 (Expected)",
  cgpa: "8.14",
  status: "Second-Year B.Tech Student"
};

export const PROJECTS: Project[] = [
  {
    id: "raju-food-court",
    number: "01",
    title: "RAJU MADRAS CAFE",
    category: "Full-Stack Restaurant Web Application",
    subtitle: "Digital Restaurant Platform",
    description: "Developed a full-stack restaurant web application delivering a smooth, intuitive browsing experience for customers. Built a dedicated admin panel enabling real-time menu management (adding, updating, deleting items), implemented dynamic search and filter functionality, and integrated frontend with MongoDB backend for structured data handling.",
    role: "Full-Stack Developer",
    technologies: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "HTML5 / CSS3",
      "Tailwind CSS"
    ],
    year: "2026",
    status: "LIVE & DEPLOYED",
    liveUrl: "https://raju-madras-cafe.vercel.app",
    githubUrl: "https://github.com/justus-robin/raju-madras-cafe",
    image: "/assets/raju_food_court.jpg",
    exhibitionType: "browser",
    highlights: [
      "Developed a full-stack restaurant web application delivering a smooth, intuitive browsing experience for customers.",
      "Built a dedicated admin panel enabling real-time menu management, including adding, updating, and deleting menu items.",
      "Implemented dynamic search and filter functionality, allowing users to quickly locate menu items by category and keyword.",
      "Designed a fully responsive, user-friendly interface optimized for both desktop and mobile viewing.",
      "Integrated the frontend with a backend database, enabling efficient, structured data handling for menu content."
    ]
  },
  {
    id: "ai-thermal-controller",
    number: "02",
    title: "AI ADAPTIVE THERMAL CONTROLLER",
    category: "Hardware & Telemetry Engine",
    subtitle: "Predictive Thermal Management System",
    description: "Windows-native performance and thermal optimization engine. Monitors CPU/GPU temperatures and active game processes, predicts thermal spikes 10 seconds ahead using Scikit-Learn ML models, and dynamically adjusts Windows power plans to prevent thermal throttling.",
    role: "Systems & AI Developer",
    technologies: [
      "Python 3.11",
      "WMI / psutil",
      "Scikit-Learn",
      "Streamlit",
      "OpenHardwareMonitor API",
      "Windows Power API"
    ],
    year: "2026",
    status: "COMPLETE",
    githubUrl: "https://github.com/justus-robin/thermal-controller",
    image: "/assets/thermal_controller.jpg",
    exhibitionType: "telemetry",
    highlights: [
      "Real-time hardware telemetry sampling (CPU temp, load, RAM, gaming processes)",
      "Machine learning predictor forecasting heat 10 seconds in advance",
      "Automated Windows power plan and CPU state adjustments under heavy load",
      "Interactive Streamlit analytical dashboard for live model telemetry visualization"
    ]
  },
  {
    id: "ark-kitchen",
    number: "03",
    title: "ARK KITCHEN",
    category: "Architecture & System Engineering",
    subtitle: "Full-Stack Microservice Ecosystem",
    description: "High-throughput restaurant management microservices system built to decouple ordering logic, kitchen queue management, state synchronization, and analytical reporting.",
    role: "Full-Stack System Architect",
    technologies: [
      "React.js",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "TypeScript",
      "Tailwind CSS"
    ],
    year: "2025",
    status: "ARCHITECTED & SHIPPED",
    image: "/assets/raju_food_court.jpg",
    exhibitionType: "architecture",
    highlights: [
      "Decoupled RESTful API backend built with Python FastAPI",
      "Asynchronous WebSocket kitchen display queue dispatcher",
      "Isolated Docker container orchestration for database and server"
    ],
    architectureNodes: [
      { label: "FRONTEND UI", sub: "React.js / JavaScript / Tailwind" },
      { label: "FASTAPI ROUTER", sub: "Async API Dispatcher & Auth" },
      { label: "QUEUE ENGINE", sub: "WebSocket Real-Time Orders" },
      { label: "POSTGRES DB", sub: "Prisma Schema & Relational Storage" }
    ]
  }
];

export const CERTIFICATES: Certificate[] = [
  {
    id: "microsoft-ai900",
    title: "Microsoft Certified — Azure AI Fundamentals",
    issuer: "Microsoft Corporation",
    date: "2026",
    code: "AI-900",
    image: "/assets/certificate_ai900.jpg",
    category: "Artificial Intelligence & Cloud",
    details: "Verifies fundamental knowledge of machine learning, computer vision, natural language processing, and Azure AI workload solutions."
  },
  {
    id: "google-cloud-leader",
    title: "Google Certified — Cloud Digital Leader",
    issuer: "Google Cloud",
    date: "2026",
    code: "GCP-CDL",
    image: "/assets/certificate_ai900.jpg",
    category: "Cloud Computing & Architecture",
    details: "Validates foundational knowledge of cloud products, digital transformation, Google Cloud core services, security, and infrastructure capabilities."
  }
];

export const TECH_CATEGORIES: TechCategory[] = [
  {
    category: "FRONTEND",
    skills: [
      { name: "Next.js 15", level: "Expert", desc: "App Router, SSR, Server Components" },
      { name: "React 19", level: "Expert", desc: "Hooks, Context, State Architecture" },
      { name: "TypeScript", level: "Expert", desc: "Strict Type Safety, Interfaces, Generics" },
      { name: "Tailwind CSS", level: "Expert", desc: "Utility Styling, Layout Grids, Modern CSS" }
    ]
  },
  {
    category: "BACKEND",
    skills: [
      { name: "Node.js", level: "Advanced", desc: "Asynchronous APIs, Server Runtime" },
      { name: "FastAPI", level: "Advanced", desc: "Python Async Endpoints, OpenAPI Schemas" },
      { name: "Prisma ORM", level: "Advanced", desc: "Schema Modeling, Migrations, Type-Safe Queries" }
    ]
  },
  {
    category: "DATABASE",
    skills: [
      { name: "PostgreSQL", level: "Advanced", desc: "Relational Queries, Indexing, Supabase DB" },
      { name: "Supabase", level: "Advanced", desc: "Auth, Storage Buckets, Database Hosting" }
    ]
  },
  {
    category: "LANGUAGES",
    skills: [
      { name: "TypeScript / JS", level: "Expert", desc: "Core Language Runtimes & ESNext" },
      { name: "Python", level: "Advanced", desc: "Data Science, Machine Learning, WMI Systems" },
      { name: "C / C++", level: "Proficient", desc: "Embedded IoT Programming, Microcontrollers" }
    ]
  },
  {
    category: "3D & MOTION",
    skills: [
      { name: "Three.js", level: "Advanced", desc: "3D Scenes, Materials, Lighting, WebGL" },
      { name: "React Three Fiber", level: "Advanced", desc: "Declarative R3F Canvas & Drei Components" },
      { name: "GSAP & ScrollTrigger", level: "Expert", desc: "Cinematic Scroll Sequences, Timelines" },
      { name: "Lenis", level: "Expert", desc: "Silky Smooth Inertial Scroll" }
    ]
  },
  {
    category: "TOOLS & INFRA",
    skills: [
      { name: "Git & GitHub", level: "Expert", desc: "Version Control, Branching, Actions" },
      { name: "Vercel", level: "Expert", desc: "Edge Deployment & Continuous Integration" },
      { name: "Docker", level: "Proficient", desc: "Containerized Development Envs" }
    ]
  }
];

export const JOURNEY: JourneyMilestone[] = [
  {
    year: "2024",
    title: "FOUNDATIONS & HARDWARE EXPLORATION",
    subtitle: "Computer Science & Embedded Logic",
    description: "Deep dive into algorithms, Python system utilities, C++ embedded microcontrollers, and initial web development architectures."
  },
  {
    year: "2025",
    title: "SYSTEM ARCHITECTURES & AI TELEMETRY",
    subtitle: "Building Thermal Engines & Microservices",
    description: "Created the AI Adaptive Thermal Controller for Windows performance optimization and architected multi-tiered web application backends."
  },
  {
    year: "2026",
    title: "PRODUCTION SHIPPING & ACADEMIC EXCELLENCE",
    subtitle: "Full-Stack Deployment & High Academic Standing",
    description: "Shipped Raju Food Court full-stack web platform on Vercel, maintained a strong 8.14 CGPA in B.Tech Computer Science, and designed interactive 3D digital experiences."
  },
  {
    year: "NEXT",
    title: "BOUNDLESS CREATIVE ENGINEERING",
    subtitle: "Next-Generation Web & Hardware Solutions",
    description: "Pushing the limits of modern interaction design, performant computing, and continuous innovation."
  }
];
