import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroImages = [
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
  'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80',
];

const features = [
  'Unlimited access to 3000+ recipes',
  'Plan your meals with ease',
  'Organise and save your favourite recipes',
];

export function HeroSection() {
  return (
    <section className="hero-section py-12 md:py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Your home for easy, delicious meal prep recipes
            </h1>
            
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground/80">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="btn-primary text-base">
              Start Your Free Trial
            </Button>
          </div>

          {/* Right image collage */}
          <div className="relative grid grid-cols-2 gap-4 animate-slide-up">
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src={heroImages[0]}
                  alt="Delicious food"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <img
                  src={heroImages[1]}
                  alt="Delicious food"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <img
                  src={heroImages[2]}
                  alt="Delicious food"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src={heroImages[3]}
                  alt="Delicious food"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
