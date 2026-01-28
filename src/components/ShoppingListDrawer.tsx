import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Stack,
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useShoppingList } from '@/context/ShoppingListContext';

export function ShoppingListDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    toggleItem,
    removeItem,
    clearList,
    clearChecked,
  } = useShoppingList();

  // Group items by recipe
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.recipeId]) {
      acc[item.recipeId] = {
        recipeTitle: item.recipeTitle,
        items: [],
      };
    }
    acc[item.recipeId].items.push(item);
    return acc;
  }, {} as Record<string, { recipeTitle: string; items: typeof items }>);

  const checkedCount = items.filter((item) => item.checked).length;

  return (
    <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
      <Box sx={{ width: { xs: '100vw', sm: 380 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontFamily='"Fraunces", serif'>
            Shopping List
          </Typography>
          <IconButton onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {items.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Your list is empty
              </Typography>
              <Typography variant="body2">
                Add ingredients from recipes to get started
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3}>
              {Object.entries(groupedItems).map(([recipeId, { recipeTitle, items: recipeItems }]) => (
                <Box key={recipeId}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      mb: 1,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: 0.5,
                    }}
                  >
                    {recipeTitle}
                  </Typography>
                  <List dense disablePadding>
                    {recipeItems.map((item) => (
                      <ListItem
                        key={`${item.recipeId}-${item.id}`}
                        disablePadding
                        sx={{
                          py: 0.5,
                          opacity: item.checked ? 0.5 : 1,
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => removeItem(item.id, item.recipeId)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                      >
                        <Checkbox
                          checked={item.checked}
                          onChange={() => toggleItem(item.id, item.recipeId)}
                          size="small"
                        />
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: item.checked ? 'line-through' : 'none',
                              }}
                            >
                              {item.amount} {item.unit} {item.name}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Stack spacing={1}>
              {checkedCount > 0 && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearChecked}
                  size="small"
                >
                  Clear {checkedCount} checked item{checkedCount > 1 ? 's' : ''}
                </Button>
              )}
              <Button
                fullWidth
                variant="text"
                color="error"
                onClick={clearList}
                size="small"
              >
                Clear all
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
