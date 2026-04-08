import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

type Testimonial = {
  name: string;
  title: string;
  image?: string;
  quote: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah M.",
    title: "Founder & Solopreneur",
    quote: "MetaHers made AI feel accessible for the first time. Within two weeks I had automated three parts of my business I'd been doing manually for years. The learning is practical, not theoretical.",
    rating: 5,
  },
  {
    name: "Jasmine K.",
    title: "Content Creator",
    quote: "I was completely overwhelmed by AI tools — there are hundreds of them. MetaHers cut through all of it. The Toolkit alone is worth joining for. I finally know what to use and why.",
    rating: 5,
  },
  {
    name: "Priya T.",
    title: "Marketing Consultant",
    quote: "Luna completely changed how I work with clients. I produce better content in half the time. MetaHers doesn't just teach you AI — it integrates it into the way you actually work.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background via-card/20 to-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary tracking-wide uppercase">
              Trusted by 500+ Women
            </span>
            <Star className="w-4 h-4 text-primary fill-primary" />
          </div>
          
          <h2 className="font-cormorant text-5xl md:text-6xl font-bold text-foreground mb-4">
            What Women Are Saying
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Real results from ambitious women building with AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="editorial-card h-full border-0 hover-elevate">
                <CardContent className="p-8 flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="flex-1 mb-6">
                    <Quote className="w-8 h-8 text-primary/20 mb-3" />
                    <p className="text-foreground/90 leading-relaxed font-light italic">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-cormorant text-lg font-bold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-foreground">
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-foreground">
            ⭐️ Rated 4.9/5 by 500+ women building with AI
          </p>
        </motion.div>
      </div>
    </section>
  );
}
