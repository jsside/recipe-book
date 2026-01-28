import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useShoppingList } from '@/context/ShoppingListContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setIsOpen, itemCount } = useShoppingList();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { label: 'All Recipes', href: '/recipes' },
    { label: 'Weeknight Dinner', href: '/recipes?category=Dinner' },
    { label: 'Easy Lunches', href: '/recipes?category=Easy lunches' },
    { label: 'Ingredients', href: '/ingredients' },
    { label: 'Plan & Batch', href: '/meal-plans' },
  ];

  return (
    <>
      {/* Top banner */}
      <div className="bg-foreground text-background text-center py-2 text-sm font-medium">
        Start Your Free Trial
      </div>

      {/* Main navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="font-serif text-2xl font-bold text-foreground">mob</span>
              <span className="hidden sm:inline text-muted-foreground">|</span>
              <span className="hidden sm:inline text-muted-foreground text-sm">Love cooking</span>
            </Link>

            {/* Search bar - desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for recipes, ingredients, etc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-full pl-10"
                />
              </div>
            </form>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Button>

              <Button variant="ghost" className="hidden sm:flex gap-2">
                <User className="h-4 w-4" />
                Log In
              </Button>

              <Button className="hidden sm:flex btn-primary">
                Join the Mob
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Navigation links - desktop */}
          <div className="hidden md:flex items-center gap-6 pb-3">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className="nav-link text-sm">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border animate-slide-up">
            <div className="container py-4 space-y-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input w-full pl-10"
                  />
                </div>
              </form>
              
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="nav-link py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1">Log In</Button>
                <Button className="flex-1 btn-primary">Join</Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
