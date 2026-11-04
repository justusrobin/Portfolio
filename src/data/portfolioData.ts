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
  github: "https://github.com/justusrobin",
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
    category: "Full-Stack Restaurant Experience",
    subtitle: "Ultra-Premium Pure-Veg Digital Platform",
    description: "Complete, production-ready full-stack digital experience for Raju Madras Cafe, a premium pure vegetarian South Indian brand located in Gujarat. Features modern motion design, smooth storytelling interactions, dynamic menu filters, and a clean database-backed takeaway ordering flow.",
    role: "Full-Stack Lead Developer",
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "MongoDB",
      "Node.js"
    ],
    year: "2026",
    status: "LIVE & DEPLOYED",
    liveUrl: "https://raju-food-court.vercel.app",
    githubUrl: "https://github.com/justusrobin/Raju-Food-Court",
    image: "/assets/raju_food_court_live.jpg",
    exhibitionType: "browser",
    highlights: [
      "Production-ready restaurant platform with seamless takeaway ordering and cart workflows",
      "Intuitive admin dashboard for live menu catalog management, pricing, and item status",
      "Dynamic search, multi-category filtering, and silky responsive motion interactions",
      "Ultra-responsive, mobile-first ordering interface optimized for on-the-go patrons"
    ]
  },
  {
    id: "ai-thermal-controller",
    number: "02",
    title: "AI ADAPTIVE THERMAL CONTROLLER",
    category: "Predictive ML & Hardware Telemetry",
    subtitle: "Intelligent Thermal Regulation Engine",
    description: "Windows-native performance and thermal optimization engine. Continuously samples CPU/GPU thermals and active game processes via WMI, forecasts thermal spikes 10 seconds ahead using Scikit-Learn Random Forest regression, and dynamically orchestrates Windows power plans to prevent thermal throttling.",
    role: "Systems & AI Developer",
    technologies: [
      "Python 3.11",
      "Scikit-Learn",
      "WMI System APIs",
      "psutil",
      "Streamlit",
      "Plotly"
    ],
    year: "2026",
    status: "SHIPPED & TESTED",
    githubUrl: "https://github.com/justusrobin/Thermo-Telemetry-AI",
    image: "/assets/thermal_controller.jpg",
    exhibitionType: "telemetry",
    highlights: [
      "Real-time hardware telemetry sampling (CPU temp, load, RAM, gaming processes)",
      "Random Forest ML predictor forecasting core temperature spikes 10 seconds in advance",
      "Automated Windows power plan and CPU frequency regulation under heavy gaming workloads",
      "Interactive analytical dashboard for live model telemetry visualization and thermal curves"
    ]
  },
  {
    id: "moxie-infratech",
    number: "03",
    title: "MOXIE INFRATECH",
    category: "Enterprise Infrastructure & EPC",
    subtitle: "Turnkey 11kV–765kV EPC Engineering Portal",
    description: "Official turnkey EPC web platform designed for Moxie Infratech Pvt Ltd, showcasing specialized capabilities across high-voltage electrical substations (11kV to 765kV), solar pooling bays, hyperscale data centre infrastructure, industrial electrification, and statutory CEIG approvals.",
    role: "Frontend & Architecture Engineer",
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Vercel",
      "Framer Motion"
    ],
    year: "2026",
    status: "LIVE & DEPLOYED",
    liveUrl: "https://moxie-brown.vercel.app",
    githubUrl: "https://github.com/justusrobin/Moxie",
    image: "/assets/moxie_infratech.jpg",
    exhibitionType: "browser",
    highlights: [
      "Engineered turnkey EPC showcase platform for 11kV-765kV substation and solar power projects",
      "High-performance responsive UI built with Next.js, TypeScript, and modern styling",
      "Showcases statutory CEIG approvals, hyperscale data centres, and industrial electrification solutions",
      "Interactive project showcase with filtering by voltage tiers, civil scope, and statutory compliance"
    ]
  },
  {
    id: "offline-rag-chatbot",
    number: "04",
    title: "OFFLINE RAG CONVERSATIONAL BOT",
    category: "Local AI & Private Intelligence",
    subtitle: "Zero-Leakage Local Knowledge Engine",
    description: "Local Retrieval-Augmented Generation (RAG) conversational bot designed for secure, private document question-answering with zero data leakage. Operates completely offline using quantized local LLMs, ChromaDB vector indexing, and LangChain orchestration without cloud API dependencies.",
    role: "AI & RAG Engineer",
    technologies: [
      "Python 3.11",
      "LangChain",
      "ChromaDB",
      "Ollama / Local LLMs",
      "HuggingFace",
      "Streamlit"
    ],
    year: "2026",
    status: "OPEN SOURCE",
    githubUrl: "https://github.com/justusrobin/Offline-Rag-Chat-Bot",
    image: "/assets/offline_rag_bot.jpg",
    exhibitionType: "telemetry",
    highlights: [
      "100% offline, local-first RAG pipeline ensuring absolute data privacy and zero cloud telemetry",
      "Vector semantic search and chunking engine using ChromaDB and local embedding models",
      "Conversational memory and context injection powered by LangChain and quantized local LLMs",
      "Intuitive chat interface with source citation and confidence metric inspection"
    ]
  },
  {
    id: "ark-kitchen",
    number: "05",
    title: "ARK KITCHEN",
    category: "Microservices & Distributed Food-Tech",
    subtitle: "High-Throughput Kitchen Dispatcher",
    description: "High-throughput restaurant management microservices system built to decouple ordering logic, kitchen queue management, real-time ticket dispatching, state synchronization, and analytical reporting across FastAPI microservices and PostgreSQL.",
    role: "Full-Stack System Architect",
    technologies: [
      "React.js",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "TypeScript",
      "WebSockets"
    ],
    year: "2025",
    status: "SYSTEM ARCHITECTED",
    githubUrl: "https://github.com/justusrobin2007/ark-kitchen",
    image: "/assets/ark_kitchen_ops.jpg",
    exhibitionType: "architecture",
    highlights: [
      "Decoupled RESTful API backend built with Python FastAPI and PostgreSQL relational schema",
      "Asynchronous WebSocket kitchen display queue dispatcher with sub-10ms ticket updates",
      "Isolated Docker container orchestration for database, message queue, and server services"
    ],
    architectureNodes: [
      { label: "FRONTEND UI", sub: "React.js / TypeScript / Tailwind" },
      { label: "FASTAPI ROUTER", sub: "Async API Dispatcher & Auth" },
      { label: "QUEUE ENGINE", sub: "WebSocket Real-Time Orders" },
      { label: "POSTGRES DB", sub: "Relational Schema & Event Log" }
    ]
  },
  {
    id: "recipe-fried-rice",
    number: "06",
    title: "AUTHENTIC RECIPE COMPANION",
    category: "Interactive Culinary Web App",
    subtitle: "Precision Ingredient Metric Scaling",
    description: "Interactive cooking companion and culinary measurement application featuring structured culinary guides, portion calculators, and dynamic step-by-step guides for signature dishes including authentic fried rice.",
    role: "Frontend Developer",
    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "UI/UX",
      "GitHub Pages"
    ],
    year: "2025",
    status: "OPEN SOURCE",
    githubUrl: "https://github.com/justusrobin/Recipe-Fried-Rice",
    image: "/assets/recipe_companion.jpg",
    exhibitionType: "browser",
    highlights: [
      "Dynamic ingredient portion calculator with real-time metric scaling based on serving count",
      "Step-by-step interactive cooking guides with visual progress markers",
      "Lightweight, responsive UI optimized for desktop and mobile kitchens"
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
