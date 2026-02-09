import { Link } from "react-router-dom";
import { Shield, Search, Brain, CheckCircle, Users, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className="relative container mx-auto px-4 py-32 text-center">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto space-y-6">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5 text-sm text-primary-foreground/80">
              <Shield className="h-4 w-4" /> AI-Powered Fraud Detection
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
              Verified Jobs.{" "}
              <span className="text-accent">Zero Scams.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mx-auto">
              JobNexis protects students from fake job postings using AI-based fraud detection and recruiter verification.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button size="lg" variant="hero" asChild>
                <Link to="/login">
                  <Search className="h-4 w-4 mr-1" /> Find Safe Jobs
                </Link>
              </Button>
              <Button size="lg" variant="hero-outline" asChild>
                <Link to="/register">
                  Recruiter Signup <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why JobNexis */}
      <section id="why" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Why JobNexis?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Thousands of students fall victim to job scams every year. We built JobNexis to change that.
            </motion.p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "Recruiter Verification", desc: "Every recruiter goes through a strict verification process before they can post jobs." },
              { icon: Brain, title: "AI Fraud Scanner", desc: "Our AI scans every job posting for red flags like payment requests and unrealistic promises." },
              { icon: Lock, title: "Zero Tolerance", desc: "Fraudulent postings are auto-blocked. Suspicious recruiters are flagged and reviewed." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-border"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground">
              How Fake Jobs Are Prevented
            </motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Recruiter Registers", desc: "Submits company details, LinkedIn, and business registration." },
              { step: "02", title: "Admin Verifies", desc: "Admin checks credentials and approves or rejects the recruiter." },
              { step: "03", title: "AI Scans Jobs", desc: "Every job description is analyzed for scam patterns and risk scored." },
              { step: "04", title: "Students Apply Safely", desc: "Only verified, AI-cleared jobs appear in the student dashboard." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center space-y-3"
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {item.step}
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Platform Features
            </motion.h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { icon: Search, title: "Smart Job Search", desc: "Filter by domain, type, and keywords to find the perfect opportunity." },
              { icon: CheckCircle, title: "Verified Badges", desc: "See at a glance which companies and jobs are verified and safe." },
              { icon: Brain, title: "AI Risk Scoring", desc: "Each job gets a risk score so you know exactly what's safe." },
              { icon: Shield, title: "Report System", desc: "Report suspicious jobs and let our team investigate." },
              { icon: Users, title: "Role-Based Access", desc: "Separate dashboards for students, recruiters, and admins." },
              { icon: Lock, title: "Secure Platform", desc: "End-to-end security with role-based access controls." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="h-9 w-9 shrink-0 rounded-lg bg-accent/10 flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-body text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready to Find Safe Opportunities?
          </h2>
          <p className="text-primary-foreground/70 max-w-md mx-auto">
            Join thousands of students who trust JobNexis for verified job and internship listings.
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" variant="hero-outline" asChild>
              <Link to="/login">Find Jobs</Link>
            </Button>
            <Button size="lg" variant="hero-outline" asChild>
              <Link to="/register">Post Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
