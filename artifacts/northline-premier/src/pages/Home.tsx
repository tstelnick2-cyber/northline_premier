import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  BarChart3, 
  Building2, 
  ChevronRight, 
  Globe2, 
  Layers, 
  LineChart, 
  ShieldCheck, 
  Users2 
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import imgHeroMeeting from "@assets/istockphoto-1057509614-1024x1024_1783877889700.jpg";
import imgMountainSummit from "@assets/istockphoto-1255203350-1024x1024_1783877889700.jpg";
import imgTeamHands from "@assets/istockphoto-1322842973-1024x1024(1)_1783877889700.jpg";
import imgDigitalGlobe from "@assets/istockphoto-1334575820-1024x1024_1783877889700.jpg";
import imgProfessionals from "@assets/istockphoto-1911521670-1024x1024_1783877889700.jpg";
import imgProcessWorkflow from "@assets/istockphoto-2232491782-1024x1024_1783877889700.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Home() {
  const { toast } = useToast();
  const [formLoading, setFormLoading] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We will get back to you shortly.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] flex items-center bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0 flex">
          <div className="w-full md:w-[55%] bg-primary"></div>
          <div className="hidden md:block w-[45%] relative">
            <div className="absolute inset-0 bg-primary/40 mix-blend-multiply z-10"></div>
            <img 
              src={imgHeroMeeting}
              alt="Northline Premier consulting team" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        {/* Diagonal overlap element */}
        <div className="absolute top-0 right-0 md:right-[40%] w-full md:w-[20%] h-full bg-primary transform origin-bottom-right md:-skew-x-12 z-10 hidden md:block"></div>

        <div className="container relative z-20 mx-auto px-6 md:px-12 pt-32 pb-20">
          <div className="max-w-2xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary mb-6 border border-secondary/30">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-sm font-semibold tracking-wide">Bay Area Based. Global Impact.</span>
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                Transformation <br/> Requires <span className="text-secondary">Precision.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed">
                Northline Premier provides elite management consulting and strategic advisory for mid-market companies navigating complexity, growth, and change.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => scrollTo("contact")}
                  className="rounded-full bg-secondary hover:bg-secondary/90 text-white font-semibold h-14 px-8 text-base shadow-lg shadow-secondary/20"
                >
                  Schedule a Consultation
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => scrollTo("services")}
                  className="rounded-full bg-transparent border-white/30 text-white hover:bg-white/10 font-semibold h-14 px-8 text-base"
                >
                  Explore Our Expertise
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 md:py-32 bg-slate-50 relative">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="max-w-2xl">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Core Offerings</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Our Expertise</h3>
            </div>
            <p className="text-slate-600 max-w-md text-lg">
              We bridge the gap between traditional consulting rigor and Silicon Valley agility.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 rounded-2xl overflow-hidden relative h-56 shadow-lg"
          >
            <img src={imgProcessWorkflow} alt="Our consulting process" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-primary/70"></div>
            <div className="absolute inset-0 flex items-center justify-center px-8">
              <p className="text-white text-xl md:text-2xl font-semibold text-center tracking-wide">
                From diagnosis to delivery — a structured process built for real-world outcomes.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <LineChart className="w-8 h-8 text-secondary" />,
                title: "Strategy & Planning",
                desc: "Data-driven roadmaps that align your vision with market realities. We help you identify growth levers and competitive advantages."
              },
              {
                icon: <Layers className="w-8 h-8 text-secondary" />,
                title: "Operations Excellence",
                desc: "Streamlining complex processes to improve margins, reduce friction, and build scalable operational infrastructure."
              },
              {
                icon: <Users2 className="w-8 h-8 text-secondary" />,
                title: "Leadership Advisory",
                desc: "Equipping executive teams with the frameworks and alignment needed to steer organizations through critical transitions."
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-secondary" />,
                title: "Growth Strategy",
                desc: "Identifying new revenue streams, optimizing go-to-market motions, and evaluating M&A opportunities."
              },
              {
                icon: <Globe2 className="w-8 h-8 text-secondary" />,
                title: "Digital Transformation",
                desc: "Modernizing legacy systems and workflows to ensure your technology stack accelerates rather than hinders growth."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-secondary" />,
                title: "Risk & Resilience",
                desc: "Building robust frameworks to anticipate market volatility, regulatory shifts, and structural risks."
              }
            ].map((service, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <Card className="h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h4 className="text-2xl font-bold text-primary mb-4">{service.title}</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {service.desc}
                    </p>
                    <div className="mt-8 flex items-center text-secondary font-semibold group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY NORTHLINE (Dark Section) */}
      <section className="py-24 md:py-32 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          {/* Abstract geometric patterns could go here */}
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-secondary blur-[120px]"></div>
          <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-400 blur-[150px]"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="lg:w-1/2"
            >
              <h2 className="text-secondary font-bold tracking-widest uppercase text-sm mb-3">The Northline Difference</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
                Silicon Valley ambition meets institutional rigor.
              </h3>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                We don't do off-the-shelf templates. The Bay Area demands more. We pair the analytical depth of a traditional consulting firm with the adaptive, fast-paced mindset of the tech ecosystem.
              </p>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                Our partners work directly on your business—you get seasoned operators and strategists, not junior analysts learning on your dime.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Boutique attention, enterprise capabilities",
                  "Deep Bay Area market intelligence",
                  "Outcomes-focused, not slide-deck-focused",
                  "Senior partners lead every engagement"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-slate-100">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <div className="lg:w-1/2 w-full">
              <div className="relative">
                <img 
                  src={imgMountainSummit}
                  alt="Partners helping clients reach the summit" 
                  className="w-full rounded-2xl shadow-2xl shadow-black/50 aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-semibold text-lg italic">"We don't just advise from the sidelines — we climb with you."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS / IMPACT */}
      <section id="impact" className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200"
          >
            {[
              { num: "200+", label: "Clients Advised" },
              { num: "$2B+", label: "Value Created" },
              { num: "95%", label: "Client Retention" },
              { num: "18", label: "Years Experience" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center pt-8 md:pt-0 px-4">
                <div className="text-5xl md:text-6xl font-extrabold text-primary mb-2 font-mono tracking-tighter">
                  {stat.num}
                </div>
                <div className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* INDUSTRIES SECTION */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Sectors We Serve</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Domain expertise across the Bay Area economy</h3>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
          >
            {[
              "Technology & Software",
              "Healthcare & Life Sciences",
              "Financial Services",
              "Commercial Real Estate",
              "Retail & Consumer",
              "Advanced Manufacturing"
            ].map((industry, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-center h-32">
                  <h4 className="font-semibold text-slate-800 text-lg">{industry}</h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 md:py-32 bg-white relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="md:w-1/2"
            >
              <div className="w-full aspect-square bg-slate-100 rounded-full relative">
                <div className="absolute inset-4 rounded-full overflow-hidden border-8 border-white shadow-xl">
                  <img src={imgProfessionals} alt="Northline Premier consultants" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary rounded-full flex items-center justify-center text-white text-center p-6 shadow-2xl">
                  <span className="font-bold text-lg leading-tight">Founded in SF<br/>2006</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="md:w-1/2"
            >
              <h2 className="text-secondary font-bold tracking-widest uppercase text-sm mb-3">Our Story</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6">Born from the need for practical strategy.</h3>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                Northline Premier was founded by former Big 3 consultants who saw a disconnect in the Bay Area market: mid-market companies were being underserved by rigid, theoretical consulting models that didn't survive first contact with reality.
              </p>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                We built our firm on a simple premise: strategy is only as good as its execution. Today, we partner with visionary leaders to navigate inflection points—whether that's scaling operations, integrating acquisitions, or transforming culture.
              </p>
              <div className="pt-6 border-t border-slate-200">
                <p className="font-semibold text-primary mb-2">Marcus Chen</p>
                <p className="text-slate-500 text-sm">Managing Partner & Founder</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={imgTeamHands} alt="" className="w-full h-full object-cover object-center opacity-10" aria-hidden="true" />
          <div className="absolute inset-0 bg-primary/90"></div>
        </div>
        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <h2 className="text-secondary font-bold tracking-widest uppercase text-sm mb-3">Client Impact</h2>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Don't just take our word for it.</h3>
            </div>
            <div className="hidden md:block w-48 h-32 rounded-xl overflow-hidden shadow-xl flex-shrink-0">
              <img src={imgDigitalGlobe} alt="Digital transformation" className="w-full h-full object-cover object-center" />
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              {
                quote: "Northline helped us completely restructure our global supply chain in 6 months. Their team wasn't just advisory—they were in the trenches with us.",
                author: "Sarah Jenkins",
                role: "COO, Series C Enterprise SaaS"
              },
              {
                quote: "The strategic clarity we gained from Northline's leadership workshop accelerated our post-merger integration by at least a year. Phenomenal partners.",
                author: "David Thorne",
                role: "CEO, Regional Health Network"
              }
            ].map((testimonial, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white/5 border border-white/10 p-10 rounded-2xl">
                <p className="text-xl md:text-2xl text-slate-200 font-serif italic leading-relaxed mb-8">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-secondary text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section id="contact" className="py-24 md:py-32 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-5/12 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-[10%] -right-[10%] w-64 h-64 bg-secondary/20 rounded-full blur-[60px] pointer-events-none"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Ready to Transform?</h3>
                <p className="text-slate-300 mb-8">
                  Connect with our partners to discuss your strategic challenges. We typically respond within 24 hours.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-secondary font-semibold text-sm mb-1 uppercase tracking-wider">Office</div>
                    <div className="text-slate-200">
                      100 Market Street<br/>
                      Suite 400<br/>
                      San Francisco, CA 94105
                    </div>
                  </div>
                  <div>
                    <div className="text-secondary font-semibold text-sm mb-1 uppercase tracking-wider">Contact</div>
                    <div className="text-slate-200">
                      partners@northlinepremier.com<br/>
                      (415) 555-0198
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-7/12 p-12">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">First Name</label>
                    <Input required placeholder="Jane" className="bg-slate-50 border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Last Name</label>
                    <Input required placeholder="Doe" className="bg-slate-50 border-slate-200 h-12" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Company</label>
                  <Input required placeholder="Acme Corp" className="bg-slate-50 border-slate-200 h-12" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <Input required type="email" placeholder="jane@example.com" className="bg-slate-50 border-slate-200 h-12" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Message</label>
                  <Textarea required placeholder="How can we help you?" className="bg-slate-50 border-slate-200 min-h-[120px]" />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={formLoading}
                  className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-white font-semibold h-14 text-base mt-4"
                >
                  {formLoading ? "Sending..." : "Submit Inquiry"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
