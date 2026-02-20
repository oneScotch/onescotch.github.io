export const personalInfo = {
  name: "Ruisi Wang",
  affiliation: "SenseTime Research",
  university: "NTU Computer Science",
  email: "C200210@e.ntu.edu.sg",
  phone: "+65 91315875",
  tagline: "Computer Vision | Motion Capture | 3D Human Pose Estimation | High Performance Computing",
  bio: "I am a Researcher at SenseTime Research, interested in High Performance Computing, Motion Capture, 3D Human Pose Estimation, and Multimodal Models. I graduated with Honours (Highest Distinction) from Nanyang Technological University with a Bachelor of Engineering in Computer Science and a Minor in Mathematics. 🌟I am open for discussion/collaborations about spatial intelligence and looking for PhD opportunities (26 Fall). If you think there is anything interesting we can discuss, feel free to email me!",
  googleScholar: "https://scholar.google.com/citations?user=4r07QUQAAAAJ&hl=en",
  linkedin: "https://www.linkedin.com/in/ruisi-wang-105737220/",
  github: "https://github.com/open-mmlab/mmhuman3d",
};

export const news = [
  {
    id: 1,
    date: "2025-12",
    content: "Update on SenseNova-SI: ",
    inlineLink: {
      text: "SenseNova-SI-1.2-InternVL3-8B",
      url: "https://huggingface.co/sensenova/SenseNova-SI-1.2-InternVL3-8B",
    },
    contentAfter: ", larger-scale, achieve state-of-the-art performance among open-source models of comparable size across eight recent spatial intelligence benchmarks: VSI, MMSI, MindCube, ViewSpatial, SITE, BLINK, 3DSRBench, EmbSpatial-Bench.",
  },
  {
    id: 2,
    date: "2025-11",
    content: "Release of SenseNova-SI: Scaling Spatial Intelligence with Multimodal Foundation Models.",
    link: "https://www.arxiv.org/abs/2511.13719",
  },
  {
    id: 3,
    date: "2025-10",
    content: "SMPLest-X: Ultimate Scaling for Expressive Human Pose and Shape Estimation accepted to TPAMI 2025.",
    link: "https://arxiv.org/abs/2501.09782",
  },
  {
    id: 4,
    date: "2024-08",
    content: "Joined SenseTime Research as a full-time Researcher.",
    link: null,
  },
  {
    id: 5,
    date: "2024-07",
    content: "One paper (WHAC) accepted to ECCV 2024.",
    link: "https://arxiv.org/abs/2403.12959",
  },
  {
    id: 6,
    date: "2024-02",
    content: "One paper (Digital Life Project) accepted to CVPR 2024.",
    link: "https://arxiv.org/abs/2312.04547",
  },
  {
    id: 7,
    date: "2023-06",
    content: "Won 1st Place in the Virtual ",
    link: null,
    inlineLink: {
      text: "HPC ISC2023 Student Cluster Competition",
      url: "https://www.ntu.edu.sg/computing/news-events/news/detail/first-time-champions-in-the-virtual-isc-student-cluster-competition-in-the-isc23",
    },
    contentAfter: ", leading NTU team to beat 19 teams worldwide.",
  },
];

export const researchThemes = [
  {
    id: 1,
    title: "Computer Vision",
    description: "Deep learning approaches for visual understanding, object detection, and image analysis.",
    icon: "Eye",
  },
  {
    id: 2,
    title: "High Performance Computing",
    description: "Optimizing and scaling AI workloads on supercomputers and clusters.",
    icon: "Cpu",
  },
  {
    id: 3,
    title: "Human Modeling",
    description: "Estimating 3D human body pose and shape from 2D images and videos.",
    icon: "User",
  },
  {
    id: 4,
    title: "Motion Generation",
    description: "Generating realistic human motion sequences using generative models.",
    icon: "Zap",
  },
  {
    id: 5,
    title: "Multimodal Foundation Models",
    description: "Large-scale models that understand and reason across multiple modalities.",
    icon: "Brain",
  },
  {
    id: 6,
    title: "Video Reasoning",
    description: "Temporal understanding and reasoning over video content.",
    icon: "Video",
  },
];

export const publications = [
  {
    id: 1,
    title: "SenseNova-SI: Scaling Spatial Intelligence with Multimodal Foundation Models",
    authors: ["Z Cai", "R Wang", "C Gu", "F Pu", "J Xu", "Y Wang", "W Yin", "Z Yang", "C Wei", "Q Sun", "et al."],
    venue: "arXiv 2025",
    year: 2025,
    citations: 7,
    type: "preprint",
    description: "State-of-the-art multimodal foundation model for spatial intelligence benchmarks.",
    image: "/attached_assets/paper_teasers/2025_sensenova-si.png",
    arxiv: "https://arxiv.org/abs/2511.13719",
  },
  {
    id: 2,
    title: "The Quest for Generalizable Motion Generation: Data, Model, and Evaluation",
    authors: ["J Lin", "R Wang", "J Lu", "Z Huang", "G Song", "A Zeng", "X Liu", "C Wei", "W Yin", "et al."],
    venue: "arXiv 2025",
    year: 2025,
    citations: 5,
    type: "preprint",
    description: "Comprehensive study on generalizable motion generation including data, model architecture, and evaluation methods.",
    image: "/attached_assets/paper_teasers/2025_ViMoGen.jpg",
    arxiv: "https://arxiv.org/abs/2510.26794",
  },
  {
    id: 3,
    title: "Holistic Evaluation of Multimodal LLMs on Spatial Intelligence (Previously: Has GPT-5 Achieved Spatial Intelligence? An Empirical Study)",
    authors: ["Z Cai", "Y Wang", "Q Sun", "R Wang", "C Gu", "W Yin", "Z Lin", "Z Yang", "C Wei", "X Shi", "et al."],
    venue: "arXiv 2025",
    year: 2025,
    citations: 2,
    type: "preprint",
    description: "Comprehensive evaluation of spatial reasoning capabilities in large language models and multimodal systems.",
    image: "/attached_assets/paper_teasers/2025_easi.png",
    arxiv: "https://arxiv.org/abs/2508.13142",
  },
  {
    id: 4,
    title: "SMPLest-X: Ultimate Scaling for Expressive Human Pose and Shape Estimation",
    authors: ["W Yin", "Z Cai", "R Wang", "A Zeng", "C Wei", "Q Sun", "H Mei", "Y Wang", "HE Pang", "et al."],
    venue: "TPAMI 2025",
    year: 2025,
    citations: 20,
    type: "journal",
    description: "Scaling expressive human pose and shape estimation with large-scale training data and improved architectures.",
    image: "/attached_assets/paper_teasers/2025_smplestx.png",
    arxiv: "https://arxiv.org/abs/2501.09782",
  },
  {
    id: 5,
    title: "Digital Life Project: Autonomous 3D Characters with Social Intelligence",
    authors: ["Z Cai", "J Jiang", "Z Qing", "X Guo", "M Zhang", "Z Lin", "H Mei", "C Wei", "R Wang", "et al."],
    venue: "CVPR 2024",
    year: 2024,
    citations: 47,
    type: "conference",
    description: "Creating autonomous 3D digital humans with social intelligence capabilities for realistic virtual interactions.",
    image: "/attached_assets/paper_teasers/2024_digitallifeproject.png",
    doi: "https://openaccess.thecvf.com/content/CVPR2024/papers/Cai_Digital_Life_Project_Autonomous_3D_Characters_with_Social_Intelligence_CVPR_2024_paper.pdf",
    arxiv: "https://arxiv.org/abs/2312.04547",
    github: "https://github.com/opendigitallife/digital_life_project",
  },
  {
    id: 6,
    title: "WHAC: World-Grounded Humans and Cameras",
    authors: ["W Yin", "Z Cai", "R Wang", "F Wang", "C Wei", "H Mei", "W Xiao", "Z Yang", "Q Sun", "et al."],
    venue: "ECCV 2024",
    year: 2024,
    citations: 29,
    type: "conference",
    description: "A framework for jointly estimating human models (SMPL-X) and camera poses from monocular video, using depth cues from human motion.",
    image: "/attached_assets/paper_teasers/2024_whac.jpg",
    arxiv: "https://arxiv.org/abs/2403.12959",
    github: "https://github.com/wangelin/WHAC",
  }
];

export const competitions = [
  {
    id: 1,
    title: "ISC2023 Student Cluster Competition",
    achievement: "1st Place",
    date: "Jun 2023",
    description: "Led the NTU team to beat 19 teams worldwide. Built, maintained, and utilized supercomputers; applied optimization techniques to complete real-world scientific workloads.",
    type: "hpc",
    category: "hpc",
    images: ["/attached_assets/competition_awards/2023_ISC_team_1.jpeg", "/attached_assets/competition_awards/2023_ISC_team_2.jpg", "/attached_assets/competition_awards/2023_ISC_all.jpg"],
  },
  {
    id: 2,
    title: "HPC AI Innovation Challenge 2023",
    achievement: "1st Place",
    date: "Jul 2024",
    description: "Competed in high performance computing AI innovation challenge. We also presented our winning solution at SCA2025 Supercomputing Asia.",
    type: "hpc",
    category: "ai",
    images: ["/attached_assets/competition_awards/2023_hpcaic_sca25.jpg"],
  },
  {
    id: 3,
    title: "Hack For Cities 2023",
    achievement: "1st Place",
    date: "Sep 2023",
    description: "Proposed innovative solution to tackle mobility issues using quantum computing.",
    type: "hackathon",
    category: "quantum",
    images: ["/attached_assets/competition_awards/2023_HFC_presentation.jpg"],
  },
  {
    id: 4,
    title: "SC2022 Student Cluster Competition",
    achievement: "Overall Runner-up & Best Poster",
    date: "Nov 2022",
    description: "Achieved second place overall and won best poster award at the international supercomputing competition.",
    type: "hpc",
    category: "hpc",
    images: ["/attached_assets/competition_awards/2022_SC_team_1.jpg", "/attached_assets/competition_awards/2022_SC_team_2.jpg", "/attached_assets/competition_awards/2022_SC_all.jpg"],
  },
  {
    id: 5,
    title: "ISC2022 Student Cluster Competition",
    achievement: "6th Overall",
    date: "Jun 2022",
    description: "Competed in the International Supercomputing Conference for HPC, Networking, and Storage.",
    type: "hpc",
    category: "hpc",
    images: [],
  },
  {
    id: 6,
    title: "35th Chinese Physics Olympiad",
    achievement: "National 2nd Prize & Provincial 1st Prize",
    date: "2018",
    description: "Awarded first prize in province and second prize at national level.",
    type: "academic",
    category: "physics",
    images: [],
  },
];

export const professionalService = {
  talks: [
    {
      id: 1,
      title: "SCA 2025 - HPCIC Winners Showcase Track session",
      description: "Presented winning solutions at the HPC Innovation Challenge showcase.",
    },
  ],
  eventOrganizer: [
    {
      id: 1,
      title: "TEDxNTU Main Organizer - Communications Department",
      description: "Organized events to expose potential change-makers to innovative speakers with creative and inspiring ideas.",
    },
    {
      id: 2,
      title: "OneArena 2022 Vice-President of Technical Department",
      description: "Hosted competitions and developed codes/games with RoboMaster EP. Mentored participants through workshops.",
    },
    {
      id: 3,
      title: "IET NTU On Campus Club Event Director",
      description: "Organized seminars and workshops to share technical knowledge with the NTU community.",
    },
  ],
  teaching: [
    {
      id: 1,
      title: "NTU School of Computer Science and Engineering (Now CCDS) Peer Coach",
      description: "Helped peer students overcome academic challenges and uplift them from 'Academically At-Risk' status.",
    },
  ],
};

export const education = [
  {
    id: 1,
    degree: "Bachelor of Engineering (Computer Science)",
    institution: "Nanyang Technological University, Singapore",
    period: "Aug 2020 - June 2024",
    honors: "Honours (Highest Distinction)",
    minor: "Minor in Mathematics",
    scholarship: "NTU Science and Engineering Undergraduate Scholarship",
    specialization: "Artificial Intelligence, High-Performance Computing, Data Science & Analytics",
  },
];

export const experience = [
  {
    id: 1,
    title: "Researcher",
    company: "SenseTime International Pte. Ltd.",
    period: "August 2024 - Present",
    responsibilities: [
      "Research on multimodal foundation models and spatial intelligence",
      "Development of SenseNova-SI achieving state-of-the-art on spatial benchmarks",
      "Video reasoning and 3D human pose estimation research",
    ],
  },
  {
    id: 2,
    title: "Research Internship",
    company: "SenseTime International Pte. Ltd.",
    period: "Dec 2023 - August 2024",
    responsibilities: [
      "SMPLest-X Human Pose and Shape Estimation base model development",
      "Research on expressive human pose and shape estimation",
      "Contributed to ECCV 2024 publication (WHAC)",
    ],
  },
  {
    id: 3,
    title: "Research Engineer Intern",
    company: "SenseTime International Pte. Ltd.",
    period: "May 2022 - Dec 2022",
    responsibilities: [
      "Post-processed data for better model training",
      "Investigated pruning techniques to reduce model size for faster inference",
      "Supported basketball and human body key points detection models",
      "Trained skiing posture detection models with 98% accuracy",
    ],
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "Variantz Asia Pacific Pte. Ltd.",
    period: "Dec 2021 - Jan 2022",
    responsibilities: [
      "Built medical certificate system for issuing MC, keeping records and reports",
      "Enabled connection between system and health-related devices",
      "Backend: Nest.js, TypeORM; Frontend: Nuxt.js (Vue), Axios",
    ],
  },
];

export const awards = [
  { title: "Dean's List - Computer Science", date: "Aug 2022", description: "Top 5% of cohort in academic performance" },
  { title: "NTU President Research Scholar", date: "Jun 2022", description: "Accomplished with Merit in Undergraduate Research Programme (URECA)." },
];
