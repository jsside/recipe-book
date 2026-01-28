import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const mealPlans = [
  {
    id: '1',
    title: 'Budget-Friendly Week',
    description: 'Delicious meals that won\'t break the bank',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
    meals: 7,
    prepTime: '2 hours',
    servings: 4,
  },
  {
    id: '2',
    title: 'High Protein Week',
    description: 'Fuel your fitness goals with protein-packed meals',
    image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&q=80',
    meals: 7,
    prepTime: '3 hours',
    servings: 2,
  },
  {
    id: '3',
    title: 'Vegetarian Delights',
    description: 'A week of delicious meat-free meals',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    meals: 7,
    prepTime: '2.5 hours',
    servings: 4,
  },
  {
    id: '4',
    title: 'Quick & Easy',
    description: 'For busy weeknights when time is short',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    meals: 5,
    prepTime: '1 hour',
    servings: 2,
  },
];

export default function MealPlans() {
  return (
    <div className="min-h-screen py-8">
      <div className="container space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            Meal Plans & Batch Cooking
          </h1>
          <p className="text-lg text-muted-foreground">
            Take the stress out of meal planning with our curated weekly plans. Each plan includes a shopping list and batch cooking instructions.
          </p>
        </div>

        {/* CTA Banner */}
        <div className="hero-section rounded-3xl p-8 md:p-12">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Create Your Own Meal Plan
            </h2>
            <p className="text-muted-foreground mb-6">
              Drag and drop recipes to build your perfect week. Our smart system will generate a combined shopping list automatically.
            </p>
            <Button className="btn-primary gap-2">
              Start Planning
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Meal Plans Grid */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold">Pre-made Meal Plans</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mealPlans.map((plan, index) => (
              <Card
                key={plan.id}
                className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                    {plan.title}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{plan.meals} meals</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{plan.prepTime} prep</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>{plan.servings} servings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Batch Cooking Section */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold">Batch Cooking Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Prep Once, Eat All Week',
                description: 'Learn how to prep ingredients in bulk to save time during the week.',
              },
              {
                title: 'Smart Storage',
                description: 'Tips for storing prepped meals to maintain freshness and flavor.',
              },
              {
                title: 'Scale Your Recipes',
                description: 'Easily double or triple recipes with our batch cooking calculator.',
              },
            ].map((tip, index) => (
              <Card key={tip.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
