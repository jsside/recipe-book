import { X, Trash2, Check } from 'lucide-react';
import { useShoppingList } from '@/context/ShoppingListContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export function ShoppingListDrawer() {
  const { items, isOpen, setIsOpen, toggleItem, removeItem, clearList, clearChecked } = useShoppingList();

  // Group items by recipe
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.recipeTitle]) {
      acc[item.recipeTitle] = [];
    }
    acc[item.recipeTitle].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-2xl">Shopping List</SheetTitle>
            <span className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          {items.length > 0 && (
            <div className="flex gap-2">
              {checkedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChecked}
                  className="text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Clear checked ({checkedCount})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearList}
                className="text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium mb-2">Your list is empty</h3>
              <p className="text-sm text-muted-foreground">
                Add ingredients from recipes to build your shopping list
              </p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([recipeTitle, recipeItems]) => (
              <div key={recipeTitle} className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  {recipeTitle}
                </h4>
                <ul className="space-y-2">
                  {recipeItems.map((item) => (
                    <li
                      key={`${item.recipeId}-${item.id}`}
                      className={`flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-opacity ${
                        item.checked ? 'opacity-50' : ''
                      }`}
                    >
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(item.id, item.recipeId)}
                      />
                      <span
                        className={`flex-1 ${
                          item.checked ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {item.amount} {item.unit} {item.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id, item.recipeId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
