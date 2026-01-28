import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import { CategoryChips } from '@/components/CategoryChips';
import { RecipeCard } from '@/components/RecipeCard';
import { IngredientCard } from '@/components/IngredientCard';
import { recipes, ingredientCategories } from '@/data/recipes';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('Dinner, sorted');

  const filteredRecipes = useMemo(() => {
    if (activeCategory === 'Dinner, sorted') {
      return recipes.filter(r => r.category.includes('Dinner'));
    }
    return recipes.filter(r => 
      r.category.some(cat => 
        cat.toLowerCase().includes(activeCategory.toLowerCase().replace(', sorted', ''))
      )
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Recipe Section */}
      <section className="py-8 md:py-12">
        <div className="container space-y-6">
          <CategoryChips
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredRecipes.slice(0, 10).map((recipe, index) => (
              <div
                key={recipe.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link to="/recipes">
              <Button variant="outline" className="btn-outline">
                View all recipes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="py-12 md:py-16 bg-card">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Browse by Ingredient
              </h2>
              <p className="text-muted-foreground">
                Find recipes based on what you have in your kitchen
              </p>
            </div>
            <Link to="/ingredients" className="hidden md:block">
              <Button variant="ghost" className="gap-2">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ingredientCategories.slice(0, 8).map((ingredient, index) => (
              <div
                key={ingredient.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <IngredientCard ingredient={ingredient} />
              </div>
            ))}
          </div>

          <div className="text-center pt-6 md:hidden">
            <Link to="/ingredients">
              <Button variant="ghost" className="gap-2">
                View all ingredients
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 hero-section">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to transform your meal prep?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of home cooks who save time and eat better with our meal planning tools.
          </p>
          <Button className="btn-primary text-base">
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
