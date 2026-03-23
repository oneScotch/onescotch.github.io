import { useRef, useEffect, useCallback, useState } from "react";

const BASE = import.meta.env.BASE_URL;

function SectionDivider() {
  return <div className="w-full max-w-[120px] mx-auto h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16" />;
}

function VideoCard({ videoSrc, title, description, caption }: { videoSrc: string; title: string; description: string; caption?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (videoRef.current) {
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      }
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.25 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="aspect-video bg-black relative">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src={`${BASE}${videoSrc}`} type="video/mp4" />
        </video>
      </div>
      <div className="p-5">
        <h4 className="font-semibold text-gray-900 text-base mb-1">{title}</h4>
        {caption && <p className="text-xs text-gray-400 mb-1.5 italic">{caption}</p>}
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function CategorySection({ id, number, title, subtitle, description, children }: {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-sm font-mono text-purple-500 font-semibold tracking-wide">{number}</span>
        <h3 className="font-serif text-2xl md:text-3xl text-gray-900 font-bold">{title}</h3>
      </div>
      <p className="text-sm uppercase tracking-widest text-purple-500 font-medium mb-4">{subtitle}</p>
      <p className="text-gray-600 leading-relaxed max-w-3xl mb-8">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </section>
  );
}

const LAYER_VIZ_SLIDES = [
  { task: "Sorting Bookshelf", prompt: "Insert the blue rectangle on the left, keeping it in ascending order as much as possible.", image: "features/task1.png" },
  { task: "Return to correct bin", prompt: "Move each item into the bin that matches its color.", image: "features/task2.png" },
  { task: "Object Packing", prompt: "The scene shows objects on the left side and a container on the right side. Place the objects into the container one by one.", image: "features/task3.png" },
  { task: "Traverse the Tree", prompt: "Traverse from the root to find the red node.", image: "features/task4.png" },
  { task: "Solve the maze", prompt: "Move the agent from blue start square to the red end square along the shortest path without entering any cells marked with black X obstacles.", image: "features/task5.png" },
  { task: "Hit Target After Bounce", prompt: "Predict where the ball will bounce.", image: "features/task6.png" },
];

function LayerVisualizationSection() {
  const [current, setCurrent] = useState(0);
  const total = LAYER_VIZ_SLIDES.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const slide = LAYER_VIZ_SLIDES[current];

  return (
    <section id="layer-viz" className="pb-20 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm uppercase tracking-[0.2em] text-purple-500 font-medium mb-4">Layer-wise Analysis</p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Layer-wise Token-Level Visualization
        </h2>
        <p className="text-gray-500 max-w-5xl mb-10 leading-relaxed">
          We register forward hooks on the DiT transformer blocks and compute the L2 norm of hidden states
          at each spatial-temporal coordinate. Rows represent DiT layers (L0, L10 … L39); columns represent
          video frames. Each cell is a heatmap of activation energy, revealing how reasoning attention
          shifts from global background structure in early layers to task-relevant objects in middle layers.
        </p>

        <div className="relative rounded-2xl border border-gray-200 bg-gray-950 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Task</p>
              <p className="text-sm text-white font-medium truncate mt-0.5">{slide.prompt}</p>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <span className="text-xs text-gray-500 tabular-nums">{current + 1} / {total}</span>
              <button
                onClick={prev}
                aria-label="Previous visualization"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 11L5 7l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next visualization"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="relative select-none">
            <img
              key={current}
              src={`${BASE}${slide.image}`}
              alt={`Layer-wise token activation heatmap for: ${slide.task}`}
              className="w-full h-auto block"
              draggable={false}
            />

            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 14L6 9l5-5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l5 5-5 5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

        </div>

        <div className="flex gap-1.5 justify-center mt-4">
          {LAYER_VIZ_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-purple-500" : "w-1.5 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const abstractRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="font-serif text-lg font-bold text-gray-900 tracking-tight">Demystifying Video Reasoning</span>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <a href="#abstract" className="hover:text-gray-900 transition-colors">Abstract</a>
            <a href="#key-finding" className="hover:text-gray-900 transition-colors">Key Finding</a>
            <a href="#examples" className="hover:text-gray-900 transition-colors">Examples</a>
            <a href="#layer-viz" className="hover:text-gray-900 transition-colors">Visualization</a>
            <a href="#citation" className="hover:text-gray-900 transition-colors">Citation</a>
          </div>
        </nav>
      </header>

      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src={`${BASE}logo.jpg`}
            alt="Institution logos"
            className="w-full max-w-[600px] mx-auto mb-6 select-none"
            draggable={false}
          />
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Demystifying Video Reasoning
          </h1>

          <div className="mb-6">
            <div className="flex flex-wrap justify-center gap-x-1 gap-y-1 text-[15px] text-gray-700 max-w-3xl mx-auto">
                <span><a href="https://www.wruisi.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Ruisi Wang</a><sup className="text-[10px] text-gray-400 ml-[1px]">1</sup>,</span>
                <span><a href="https://caizhongang.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Zhongang Cai</a><sup className="text-[10px] text-gray-400 ml-[1px]">✉,1</sup>,</span>
                <span><a href="https://pufanyi.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Fanyi Pu</a><sup className="text-[10px] text-gray-400 ml-[1px]">1,2</sup>,</span>
                <span><a href="https://sg.linkedin.com/in/junxiang-xu-324812328" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Junxiang Xu</a><sup className="text-[10px] text-gray-400 ml-[1px]">1</sup>,</span>
                <span><a href="https://scholar.google.com/citations?view_op=list_works&hl=en&user=zlIJwBEAAAAJ" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Wanqi Yin</a><sup className="text-[10px] text-gray-400 ml-[1px]">1</sup>,</span>
                <span><a href="https://mjxwang.github.io/Maijunxian-Wang-s-Personal-Website-1-/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Maijunxian Wang</a><sup className="text-[10px] text-gray-400 ml-[1px]">3</sup>,</span>
                <span><a href="https://sarajir.github.io/Ranji-s-Personal-Website/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Ran Ji</a><sup className="text-[10px] text-gray-400 ml-[1px]">4</sup>,</span>
                <span><a href="https://sg.linkedin.com/in/rheallyc" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Chenyang Gu</a><sup className="text-[10px] text-gray-400 ml-[1px]">1</sup>,</span>
                <span><a href="https://www.brianboli.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Bo Li</a><sup className="text-[10px] text-gray-400 ml-[1px]">2</sup>,</span>
                <span><a href="https://ziqihuangg.github.io/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Ziqi Huang</a><sup className="text-[10px] text-gray-400 ml-[1px]">2</sup>,</span>
                <span><a href="https://hokindeng.github.io/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Hokin Deng</a><sup className="text-[10px] text-gray-400 ml-[1px]">5</sup>,</span>
                <span><a href="https://dahua.site/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Dahua Lin</a><sup className="text-[10px] text-gray-400 ml-[1px]">1</sup>,</span>
                <span><a href="https://liuziwei7.github.io/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Ziwei Liu</a><sup className="text-[10px] text-gray-400 ml-[1px]">2</sup>,</span>
                <span><a href="https://yanglei.me/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors underline decoration-gray-300 hover:decoration-purple-400">Lei Yang</a><sup className="text-[10px] text-gray-400 ml-[1px]">1</sup></span>
              </div>
            <div className="mt-3 text-xs text-gray-400 leading-relaxed">
              <span>✉ Corresponding Author</span>
            </div>
            <div className="mt-1.5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <span><sup className="text-gray-400">1</sup> SenseTime Research</span>
              <span><sup className="text-gray-400">2</sup> Nanyang Technological University</span>
              <span><sup className="text-gray-400">3</sup> UC Berkeley</span>
              <span><sup className="text-gray-400">4</sup> UC San Diego</span>
              <span><sup className="text-gray-400">5</sup> Carnegie Mellon University</span>
            </div>
          </div>

          <p className="text-lg md:text-xl text-gray-500 max-w-4xl mx-auto leading-relaxed mb-10">
            Reasoning in video generation models happens along <em className="text-gray-800 font-medium not-italic">diffusion steps</em>, not frames.
            We discover <span className="font-semibold text-gray-800">Chain-of-Steps</span> &mdash; a new understanding of how video models think.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <span className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-100">Video Reasoning</span>
            <span className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">Diffusion Models</span>
            <span className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-100">Emergent Intelligence</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-12">
            <a
              href="https://arxiv.org/abs/2603.16870"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-white text-purple-700 border border-purple-300 rounded-full hover:bg-purple-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 2h5l3 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Paper
            </a>
            <a
              href="https://huggingface.co/papers/2603.16870"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-white text-purple-700 border border-purple-300 rounded-full hover:bg-purple-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.3 7.7c-.4 0-.7.3-.7.7s.3.7.7.7.7-.3.7-.7-.3-.7-.7-.7zm5.4 0c-.4 0-.7.3-.7.7s.3.7.7.7.7-.3.7-.7-.3-.7-.7-.7z"/>
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.7 9.3a3.7 3.7 0 01-7.4 0 .5.5 0 01.5-.5h6.4a.5.5 0 01.5.5zM4.6 7.2c0-.2.1-.4.2-.5.2-.2.4-.2.6-.1l.7.5.7-.5c.2-.1.4-.1.6.1.1.1.2.3.2.5l-.3 1c-.1.2-.2.3-.4.3h-1c-.2 0-.3-.1-.4-.3l-.3-1zm5 0c0-.2.1-.4.2-.5.2-.2.4-.2.6-.1l.7.5.7-.5c.2-.1.4-.1.6.1.1.1.2.3.2.5l-.3 1c-.1.2-.2.3-.4.3h-1c-.2 0-.3-.1-.4-.3l-.3-1z"/>
              </svg>
              Hugging Face
            </a>
            <a
              href="https://youtu.be/Gs9TPZmzo-s"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-white text-purple-700 border border-purple-300 rounded-full hover:bg-purple-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14.2 4.5a1.8 1.8 0 00-1.3-1.3C11.8 3 8 3 8 3s-3.8 0-4.9.2a1.8 1.8 0 00-1.3 1.3C1.5 5.7 1.5 8 1.5 8s0 2.3.3 3.5c.2.7.7 1.1 1.3 1.3C4.2 13 8 13 8 13s3.8 0 4.9-.2c.6-.2 1.1-.6 1.3-1.3.3-1.2.3-3.5.3-3.5s0-2.3-.3-3.5zM6.5 10.2V5.8L10.2 8l-3.7 2.2z"/>
              </svg>
              Video
            </a>
            <a
              href="https://github.com/OpenSenseNova/Demystifying_Video_Reasoning"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-white text-purple-700 border border-purple-300 rounded-full hover:bg-purple-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
          </div>
          <a
            href="#abstract"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              abstractRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>Scroll to learn more</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-bounce">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gradient-to-b from-gray-950 to-gray-900 p-3 md:p-5">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/Gs9TPZmzo-s?vq=hd1080"
                title="Chain-of-Steps: Demystifying Video Reasoning"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-center text-gray-400 text-sm mt-4 leading-relaxed max-w-7xl mx-auto">
              <strong className="text-gray-300">Chain-of-Steps.</strong> Video reasoning occurs along the diffusion steps: the model explores
              multiple possible solutions simultaneously at early steps, gradually prunes suboptimal choices,
              and reaches a final decision at late steps. Different random seeds lead to diverse reasoning trajectories.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section id="abstract" ref={abstractRef} className="pb-16 px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-500 font-medium mb-4">Abstract</p>
          <div className="text-gray-600 leading-[1.85] text-[17px] space-y-4">
            <p>
              Recent advances in video generation have revealed an unexpected phenomenon: diffusion-based video models
              exhibit non-trivial reasoning capabilities. Prior work attributes this to a Chain-of-Frames (CoF) mechanism,
              where reasoning is assumed to unfold sequentially across video frames. In this work, we challenge this
              assumption and uncover a fundamentally different mechanism. We show that reasoning in video models instead primarily emerges along the <em className="text-gray-800 not-italic font-medium">diffusion
              denoising steps</em>. Through qualitative analysis and targeted probing experiments, we find that models explore
              multiple candidate solutions in early denoising steps and progressively converge to a final answer, a process
              we term <strong className="text-gray-800">Chain-of-Steps (CoS)</strong>. Beyond this core mechanism, we identify several emergent reasoning behaviors critical to model performance:
              (1) <strong className="text-gray-800">working memory</strong>, enabling persistent reference;
              (2) <strong className="text-gray-800">self-correction and enhancement</strong>, allowing recovery from incorrect
              intermediate solutions; and (3) <strong className="text-gray-800">perception before action</strong>, where early
              steps establish semantic grounding and later steps perform structured manipulation. During a diffusion step, we further uncover self-evolved <strong className="text-gray-800">functional
              specialization</strong> within Diffusion Transformers, where early layers encode dense perceptual structure,
              middle layers execute reasoning, and later layers consolidate latent representations. Motivated by these insights, we present a simple training-free strategy as a proof-of-concept, demonstrating
              how reasoning can be improved by ensembling latent trajectories from identical models with different random seeds.
              Overall, our work provides a systematic understanding of how reasoning emerges in video generation models,
              offering a foundation to guide future research in better exploiting the inherent reasoning dynamics of video
              models as a new substrate for intelligence.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section id="key-finding" className="pb-16 px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-500 font-medium mb-4">Key Finding</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            Chain-of-Steps, not Chain-of-Frames
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="#ef4444" strokeWidth="1.5"/>
                  <path d="M7 7l6 6M13 7l-6 6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-sm font-semibold text-red-700 uppercase tracking-wide">Previous Hypothesis</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Chain-of-Frame (CoF)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Reasoning unfolds <em>sequentially across frames</em> &mdash; later frames build conclusions
                conditioned on earlier frames, similar to an autoregressive chain.
              </p>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50/50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="#22c55e" strokeWidth="1.5"/>
                  <path d="M6 10l3 3 5-5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">Our Discovery</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Chain-of-Steps (CoS)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Reasoning unfolds <em>along diffusion denoising steps</em> &mdash; the model reasons over
                all frames simultaneously at each step, refining hypotheses as denoising progresses.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 md:p-8">
            <h4 className="font-semibold text-gray-900 mb-4">Evidence</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">1</span>
                <p>Model performance is tightly coupled with specific denoising steps, while reducing temporal resolution (fewer frames) has only minor effects.</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">2</span>
                <p>Noise perturbations at specific denoising steps significantly degrade performance, whereas frame-wise perturbations have much weaker impact.</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">3</span>
                <p>Early steps explore multiple possibilities (multi-path or superposition), then progressively collapse onto the final solution in later steps.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section id="examples" className="pb-16 px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-500 font-medium mb-4">Video Examples</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Emergent Reasoning Behaviors
          </h2>
          <p className="text-gray-500 max-w-5xl mb-16 leading-relaxed">
            Through systematic analysis, we uncover several surprising emergent behaviors in video reasoning models
            that are critical for the success of video reasoning.
          </p>

          <div className="space-y-20">
            <CategorySection
              id="multi-path"
              number="01"
              title="Multi-Path Exploration"
              subtitle="Breadth-First Search in Latent Space"
              description="In high-complexity tasks, the diffusion process resembles Breadth-First Search: the model explores multiple solution paths simultaneously, gradually pruning incorrect branches until a single valid outcome remains. This is analogous to Tree of Thoughts in LLMs, but arises naturally during diffusion."
            >
              <VideoCard
                videoSrc="sample_videos/multi_path1.mp4"
                title="Robot Navigation"
                description="The robot simultaneously explores both upper and lower routes through the maze. As denoising proceeds, the lower path becomes dominant while the alternative gradually disappears."
                caption="The robot drives to the white paper area"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path2.mp4"
                title="Object Movement"
                description="Multiple candidate end positions for the plant are considered in early steps, with the model converging on the correct shelf position."
                caption="Place the green plant on the far left of the same tier to left"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path3.mp4"
                title="Tic-Tac-Toe Strategy"
                description="The model considers two possible placements of the 'O' piece simultaneously before committing to the final decision at later denoising steps."
                caption="Modify one 'O' to 'X' in Tic-Tac-Toe to secure a win"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path4.mp4"
                title="Diamond Detection"
                description="The model initially marks two candidate shapes that might satisfy the query. Through iterative refinement, the incorrect candidate fades."
                caption="Find the diamond in the figure"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path5.mp4"
                title="Swap shapes"
                description="The model initially considers whether the blue circle should move left or right."
                caption="Swap the third and fourth shapes"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path6.mp4"
                title="Remove shapes"
                description="For the topmost square, the model initially plan three routes: up, left, and right, and gradually eliminate them in the later diffusion steps, converging to a single path."
                caption="Remove the shapes one by one from top to bottom"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path7.mp4"
                title="Traverse the tree"
                description="The model initially performs an explicit BFS on the tree, eventually converging to a single path."
                caption="Traverse from the root to find the red node"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path8.mp4"
                title="Choose the largest sector"
                description="The model initially choose the two larger sectors below, but ultimately compare and choose the left sector to be larger."
                caption="Choose the largest sector of the pie chart"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path9.mp4"
                title="Choose the rectangle with max red points"
                description="The model first selects the rectangle with more dots, and subsequently eliminate the wrong one in later diffusion steps. It is worth noting that the circle drawn by the model initially was significantly different from the final one."
                caption="Choose the rectangle containing the maximum number of red points"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path10.mp4"
                title="Select the largest number"
                description="The model initially selects the two largest numbers, both starting with 9. After comparison, it selects the larger one."
                caption="Select the largest number"
              />
            </CategorySection>

            <CategorySection
              id="superposition"
              number="02"
              title="Superposition-Based Exploration"
              subtitle="Quantum-Like Superposition of Hypotheses"
              description="For pattern completion and transformation tasks, the model overlays multiple candidate outcomes on top of each other in early denoising steps — a visual superposition. As the process continues, one hypothesis gradually dominates and the others fade away."
            >
              <VideoCard
                videoSrc="sample_videos/superposition1.mp4"
                title="Size Pattern Completion"
                description='The size-pattern follows a repeating "large-medium-small" pattern. When predicting the next element, the model initially generates overlapping circles of different sizes, representing competing hypotheses about the correct continuation of the sequence.'
                caption="Complete the box according to the pattern"
              />
              <VideoCard
                videoSrc="sample_videos/superposition2.mp4"
                title="Rotation Prediction"
                description="All possible rotations of the L-shaped object are superimposed in early steps, with the correct 90-degree rotation emerging as the dominant answer."
                caption="Imitate the rotation pattern"
              />
              <VideoCard
                videoSrc="sample_videos/superposition3.mp4"
                title="Rotation Prediction"
                description="The arrow gradually converged from a blurred rotational superposition state to a clear direction."
                caption="Imitate the rotation pattern"
              />
              <VideoCard
                videoSrc="sample_videos/superposition4.mp4"
                title="Rotate and Move"
                description="The model initially turned the two shapes on the left into a superposition state, and then moved the state to the right. Only then did it gradually clarify how they should rotate."
                caption="Move and rotate the shapes on the left into the dashed frame on the right"
              />
            </CategorySection>

            <CategorySection
              id="working memory"
              number="03"
              title="Working Memory"
              subtitle="Persistent State Across Denoising Steps"
              description="Reasoning requires maintaining working memory or state. The diffusion process naturally establishes persistent anchors that preserve critical information across generation steps — crucial for tasks requiring reference like object permanence."
            >
              <VideoCard
                videoSrc="sample_videos/memory1.mp4"
                title="Object Reappearance"
                description="The model preserves an object's initial position throughout diffusion steps, enabling a circle to return to its original location consistently."
                caption="Move the center object out of the frame and back"
              />
              <VideoCard
                videoSrc="sample_videos/memory2.mp4"
                title="Teddy Bear Relocation"
                description="During movement, a large teddy bear temporarily occludes a smaller one. Despite this, early diffusion steps retain the state of the hidden bear to ensure consistent generation."
                caption="Move the largest teddy bear to the left"
              />
              {/* <VideoCard
                videoSrc="sample_videos/memory3.mp4"
                title="Shape Alignment"
                description="The model initially preserves the initial shape locations and the movement trajectories."
                caption="Move the shapes on the left into the dashed frame on the right"
              />
              <VideoCard
                videoSrc="sample_videos/memory4.mp4"
                title="Sorting Bookshelf"
                description="While sorting the books, the model keeps the orignal height information."
                caption="Insert the blue rectangle on the left, keeping it in ascending order as much as possible"
              />
              <VideoCard
                videoSrc="sample_videos/memory5.mp4"
                title="Circle Tangency"
                description="The model keeps the original radius information."
                caption="Align the two circles centrally until they are mutually tangent"
              />
              <VideoCard
                videoSrc="sample_videos/memory6.mp4"
                title="Sorting Stars"
                description="During sorting, all initial size and location information is preserved."
                caption="Sort the stars by size in non-descending order"
              /> */}
            </CategorySection>

            <CategorySection
              id="self-correction"
              number="04"
              title="Self-Correction & Enhancement"
              subtitle="Backtracking and Refinement During Generation"
              description='The model exhibits stochastic "aha moments" — initially selecting incorrect options or incomplete information but revising its reasoning after a few diffusion steps. This is analogous to internal backtracking in long-thinking LLMs. Corrections happen globally across all frames simultaneously, not sequentially.'
            >
              <VideoCard
                videoSrc="sample_videos/self_correction1.mp4"
                title="Hit Target After Bounce"
                description="Initially incomplete and ambiguous, the ball's trajectory is gradually completed as diffusion progresses, converging from four candidate landing points to the single correct one."
                caption="Predict where the ball will bounce"
              />
              <VideoCard
                videoSrc="sample_videos/self_correction2.mp4"
                title="3D Shape Rotation"
                description="At the first diffusion step, rotated cubes have incorrect quantities and arrangements. Over subsequent steps, the model self-corrects both the number and spatial configuration."
                caption="Rotate the shape 180° clockwise in the top view"
              />
              <VideoCard
                videoSrc="sample_videos/self_correction3.mp4"
                title="Maximize Path Sum in Maze"
                description="The model initially performs a BFS-like exploration. From the early outputs, it appears to prefer moving right first and then down, but it gradually discovers the correct path over time."
                caption="Maximize path sum for the yellow circle from green to red via the shortest route"
              />
              <VideoCard
                videoSrc="sample_videos/self_correction4.mp4"
                title="Solve the Maze"
                description="The yellow dot clearly moves upward in the 0th step, but by the 4th step the model revises its decision and instead moves right and then up, passing through the yellow square."
                caption="Move the yellow circle from green to red via three intermediate yellow cells"
              />
              <VideoCard
                videoSrc="sample_videos/self_correction5.mp4"
                title="Color Pattern Completion"
                description="As the diffusion steps progress, the model gradually changes the color of the answer."
                caption="Infer the fifth square based on color pattern"
              />
              <VideoCard
                videoSrc="sample_videos/self_correction6.mp4"
                title="Mirror Reflection"
                description="The path for placing the cup initially appears to emerge from the mirror; however, in later steps it instead appears from the top."
                caption="Place a glass of water in front of the mirror"
              />
              <VideoCard
                videoSrc="sample_videos/self_correction7.mp4"
                title="Ball Bounce Prediction"
                description="As time progresses, the trajectory of the small ball becomes increasingly clear, more definite, and also longer."
                caption="Predict the trajectory of the pinball"
              />
              <VideoCard
                videoSrc="sample_videos/self_correction8.mp4"
                title="Group Integration"
                description="At the beginning, the model only plans the path and the number of groups remains fixed at four. However, as the diffusion process continues, the model is no longer satisfied with merely finding a correct path and begins to consider increasing the number of circles."
                caption="Integrate red, orange, green, and blue groups in sequence"
              />
            </CategorySection>

            <CategorySection
              id="perception before action"
              number="05"
              title="Perception Before Action"
              subtitle="Perception First, Then Logic"
              description="The diffusion trajectory first addresses 'what' and 'where' in a scene before determining 'how' and 'why'. Early denoising steps focus on dense perceptual grounding (separating foreground from background), while subsequent steps carry out the bulk of reasoning or action. This reveals a universal 'perception before action' transition."
            >
              <VideoCard
                videoSrc="sample_videos/understanding1.mp4"
                title="Door Correction"
                description="Early steps recognize the door as the target object that is incorrect. Later steps then manipulate it to correct the structural error."
                caption="Correct the incorrect parts of the house"
              />
              <VideoCard
                videoSrc="sample_videos/understanding2.mp4"
                title="Car Movement"
                description="Early diffusion steps identify the car as the object of interest, while later steps introduce motion and simulate physical interactions to 'get the car running'."
                caption="Get the car running"
              />
            </CategorySection>
          </div>
        </div>
      </section>

      <SectionDivider />

      <LayerVisualizationSection />

      <SectionDivider />

      <section id="citation" className="pb-16 px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-500 font-medium mb-4">Citation</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            BibTeX
          </h2>
          <p className="text-gray-500 mb-6 leading-relaxed text-sm">
            If you find this work useful, please cite our paper:
          </p>
          <div className="relative group">
            <pre className="bg-white text-gray-700 text-xs md:text-sm leading-relaxed rounded-xl p-5 md:p-6 overflow-x-auto border border-gray-200 font-mono">
{`@article{wang2026demystifing,
  title={Demystifing Video Reasoning},
  author={Wang, Ruisi and Cai, Zhongang and Pu, Fanyi and Xu, Junxiang and Yin, Wanqi and Wang, Maijunxian and Ji, Ran and Gu, Chenyang and Li, Bo and Huang, Ziqi and Deng, Hokin and Lin, Dahua and Liu, Ziwei and Yang, Lei},
  journal={arXiv preprint arXiv:2603.16870},
  year={2026}
}`}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
`@article{wang2026demystifing,
  title={Demystifing Video Reasoning},
  author={Wang, Ruisi and Cai, Zhongang and Pu, Fanyi and Xu, Junxiang and Yin, Wanqi and Wang, Maijunxian and Ji, Ran and Gu, Chenyang and Li, Bo and Huang, Ziqi and Deng, Hokin and Lin, Dahua and Liu, Ziwei and Yang, Lei},
  journal={arXiv preprint arXiv:2603.16870},
  year={2026}
}`
                );
              }}
              className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">Demystifying Video Reasoning</p>
          <p className="text-sm text-gray-400">Chain-of-Steps (CoS)</p>
        </div>
      </footer>
    </div>
  );
}
