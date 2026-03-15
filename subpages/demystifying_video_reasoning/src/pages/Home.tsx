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
        <h4 className="font-semibold text-gray-900 text-base mb-1.5">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        {caption && <p className="text-xs text-gray-400 mt-2 italic">{caption}</p>}
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
  {
    task: "Get the car running",
    prompt: "Get the car running.",
    description: "Early layers identify the car as the object of interest. Middle layers introduce motion planning. Late layers simulate physical interactions.",
  },
  {
    task: "Correct the incorrect parts of the house",
    prompt: "Correct the incorrect parts of the house.",
    description: "Early layers ground the door as the target object. Subsequent layers manipulate it to fix the structural error.",
  },
  {
    task: "Circle the bicycles in the image",
    prompt: "Please circle the bicycles in the image.",
    description: "First few layers focus on background. Middle layers (around L10–L21) shift attention to semantically relevant objects and encode decisive grounding information.",
  },
  {
    task: "Solve the maze",
    prompt: "Find a path from start to end.",
    description: "Early layers lay out the full maze structure. Middle layers propagate path hypotheses. Late layers converge on the correct traversal.",
  },
  {
    task: "Object reappearance",
    prompt: "Return the circle to its original position.",
    description: "The model preserves a persistent memory anchor of the initial object position across all layers throughout the denoising trajectory.",
  },
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
        <p className="text-gray-500 max-w-2xl mb-10 leading-relaxed">
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
              src={`${BASE}cos-diagram.png`}
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

          <div className="px-5 py-4 border-t border-white/10">
            <p className="text-sm text-gray-300 leading-relaxed">{slide.description}</p>
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
          </div>
        </nav>
      </header>

      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Demystifying<br />Video Reasoning
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Reasoning in video generation models happens along <em className="text-gray-800 font-medium not-italic">diffusion steps</em>, not frames.
            We discover <span className="font-semibold text-gray-800">Chain-of-Steps</span> &mdash; a new understanding of how video models think.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <span className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-100">Video Reasoning</span>
            <span className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">Diffusion Models</span>
            <span className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-100">Emergent Intelligence</span>
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
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gradient-to-b from-gray-950 to-gray-900 p-4 md:p-8">
            <img
              src={`${BASE}cos-diagram.png`}
              alt="Chain-of-Steps diagram showing how video reasoning emerges along diffusion denoising steps, illustrated with a maze-solving example"
              className="w-full h-auto rounded-lg"
            />
            <p className="text-center text-gray-400 text-sm mt-4 leading-relaxed max-w-3xl mx-auto">
              <strong className="text-gray-300">Chain-of-Steps.</strong> Video reasoning occurs along the diffusion steps: the model explores
              multiple possible solutions simultaneously at early steps, gradually prunes suboptimal choices,
              and reaches a final decision at late steps. Different random seeds lead to diverse reasoning trajectories.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section id="abstract" ref={abstractRef} className="pb-16 px-6 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-500 font-medium mb-4">Abstract</p>
          <div className="text-gray-600 leading-[1.85] text-[17px] space-y-4">
            <p>
              Recent advances in video generation have revealed an unexpected capability: diffusion-based video models
              can perform reasoning through <strong className="text-gray-800">Chain-of-Frame (CoF)</strong>, suggesting that reasoning
              unfolds sequentially across video frames. In this work, we revisit this assumption and uncover a different mechanism.
            </p>
            <p>
              Through systematic analysis, we show that video reasoning primarily develops along the
              <strong className="text-gray-800"> diffusion denoising steps</strong> instead, validated through qualitative
              analysis and probing tests. We term this mechanism <strong className="text-gray-800">Chain-of-Steps (CoS)</strong>.
            </p>
            <p>
              Our investigation reveals several intriguing emergent behaviors critical for video reasoning:
              models exhibit <strong className="text-gray-800">long-horizon memory</strong> for tasks like object permanence,
              can <strong className="text-gray-800">self-correct</strong> intermediate mistakes during generation, and show
              <strong className="text-gray-800"> layer-wise functional specialization</strong> within the Diffusion Transformer architecture.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section id="key-finding" className="pb-16 px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
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
          <p className="text-gray-500 max-w-2xl mb-16 leading-relaxed">
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
                caption="Early steps show dual pathways; final steps converge to optimal route"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path2.mp4"
                title="Tic-Tac-Toe Strategy"
                description="The model considers two possible placements of the 'O' piece simultaneously before committing to the winning move at later denoising steps."
                caption="Multiple candidate moves explored before final decision"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path3.mp4"
                title="Plant Placement"
                description="Multiple candidate end positions for the plant are considered in early steps, with the model converging on the correct shelf position."
                caption="Object placement with spatial reasoning"
              />
              <VideoCard
                videoSrc="sample_videos/multi_path4.mp4"
                title="Diamond Finding"
                description="The model simultaneously selects multiple diamond shapes in early steps before identifying and highlighting the correct one."
                caption="Visual search with elimination"
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
                title="Pattern Completion"
                description="Large and small circles overlap with each other in early steps as the model explores different sizes that could complete the pattern."
                caption="Overlapping candidate shapes resolve into correct answer"
              />
              <VideoCard
                videoSrc="sample_videos/superposition2.mp4"
                title="Rotation Prediction"
                description="All possible rotations of the L-shaped object are superimposed in early steps, with the correct 90-degree rotation emerging as the dominant answer."
                caption="Multiple rotation hypotheses simultaneously evaluated"
              />
            </CategorySection>

            <CategorySection
              id="memory"
              number="03"
              title="Memory"
              subtitle="Persistent State Across Denoising Steps"
              description="Reasoning requires maintaining memory or state. The diffusion process naturally establishes persistent anchors that preserve critical information across generation steps — crucial for tasks requiring long-horizon reference like object permanence."
            >
              <VideoCard
                videoSrc="sample_videos/memory1.mp4"
                title="Object Reappearance"
                description="The model preserves an object's initial position throughout diffusion steps, enabling a circle to return to its original location consistently."
                caption="Position memory retained across full denoising trajectory"
              />
              <VideoCard
                videoSrc="sample_videos/memory2.mp4"
                title="Teddy Bear Relocation"
                description="During movement, a large teddy bear temporarily occludes a smaller one. Despite this, early diffusion steps retain the state of the hidden bear to ensure consistent generation."
                caption="Object permanence maintained through occlusion"
              />
            </CategorySection>

            <CategorySection
              id="self-correction"
              number="04"
              title="Self-Correction & Enhancement"
              subtitle="Backtracking and Refinement During Generation"
              description='The model exhibits stochastic "aha moments" — initially selecting incorrect options but revising its reasoning after a few diffusion steps. This is analogous to internal backtracking in long-thinking LLMs. Corrections happen globally across all frames simultaneously, not sequentially.'
            >
              <VideoCard
                videoSrc="sample_videos/self_correction1.mp4"
                title="Ball Trajectory Prediction"
                description="Initially incomplete and ambiguous, the ball's trajectory is gradually completed as diffusion progresses, converging from four candidate landing points to the single correct one."
                caption="Progressive trajectory refinement through denoising"
              />
              <VideoCard
                videoSrc="sample_videos/self_correction2.mp4"
                title="3D Shape Rotation"
                description="At the first diffusion step, rotated cubes have incorrect quantities and arrangements. Over subsequent steps, the model self-corrects both the number and spatial configuration."
                caption="Structural error correction across multiple denoising steps"
              />
            </CategorySection>

            <CategorySection
              id="understanding"
              number="05"
              title="Understanding Before Reasoning"
              subtitle="Perception First, Then Logic"
              description="The diffusion trajectory first addresses 'what' and 'where' in a scene before determining 'how' and 'why'. Early layers focus on dense perceptual grounding (separating foreground from background), while middle layers carry out the bulk of reasoning. This reveals a universal understanding-to-reasoning transition."
            >
              <VideoCard
                videoSrc="sample_videos/understanding1.mp4"
                title="Car Repair Task"
                description="Early diffusion steps identify the car as the object of interest, while later steps introduce motion and simulate physical interactions to 'get the car running'."
                caption="Object identification precedes action reasoning"
              />
              <VideoCard
                videoSrc="sample_videos/understanding2.mp4"
                title="House Correction"
                description="Early steps recognize the door as the target object that is incorrect. Later steps then manipulate it to correct the structural error."
                caption="Scene understanding enables targeted correction"
              />
            </CategorySection>
          </div>
        </div>
      </section>

      <SectionDivider />

      <LayerVisualizationSection />

      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">Demystifying Video Reasoning</p>
          <p className="text-sm text-gray-400">Chain-of-Steps (CoS)</p>
        </div>
      </footer>
    </div>
  );
}
