import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { insertIf } from "@/features/isFeatureEnabled";
import { Features } from "@/features";
import { SITE_NAME } from "@/app/constants";
import RenderComponent from "@/components/helpers/renderComponent";
import { useShoppingList } from "@/context/ShoppingListContext/utils";
import { useAuth } from "@/context/AuthContext/utils";
import { useI18n } from "@/i18n/useI18n";

//todo if chef, can create profile.
// should b e able to change avatar and add a banner maybe ?

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "All recipes", href: "/recipes" },
  { label: "Chefs", href: "/chefs" },
  ...(insertIf(Features["feature-recipe-by-ingredient"], [
    { label: "Ingredients", href: "/ingredients" },
  ]) as NavLink[]),
  ...(insertIf(Features["feature-plan-batch"], [
    { label: "Plan & Batch", href: "/meal-plans" },
  ]) as NavLink[]),
].flat();

export function Navbar() {
  const i18n = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setIsOpen, itemCount } = useShoppingList();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate("/");
  };

  return (
    <>
      {/* Main navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "background.default",
          border: "none",
        }}
      >
        <Toolbar sx={{ gap: 2, py: 1 }}>
          {/* Logo */}
          <Typography
            component={Link}
            to="/"
            sx={{
              fontSize: "1.25rem",
              fontWeight: 500,
              color: "text.primary",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            {SITE_NAME}
          </Typography>

          {/* Search bar - desktop */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: { xs: "none", md: "flex" },
              flex: 1,
              maxWidth: 400,
            }}
          >
            <TextField
              size="small"
              placeholder={i18n.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 6,
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                  "& fieldset": { border: "none" },
                },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Add Recipe button for chefs */}
            {user?.role === "chef" && (
              <Button
                component={Link}
                to="/add-recipe"
                startIcon={<AddIcon />}
                size="small"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  color: "text.primary",
                }}
              >
                {i18n.addRecipe}
              </Button>
            )}

            {/* Shopping cart */}
            <IconButton onClick={() => setIsOpen(true)}>
              <Badge badgeContent={itemCount} color="primary">
                <CartIcon />
              </Badge>
            </IconButton>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleUserMenuOpen}>
                  <Avatar
                    src={user?.avatar}
                    alt={user?.name}
                    sx={{ width: 32, height: 32 }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem disabled>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {user?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.role === "chef" ? i18n.chef : i18n.viewer}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <RenderComponent
                    if={user?.role === "chef"}
                    then={
                      <MenuItem
                        onClick={() => {
                          handleUserMenuClose();
                          navigate(`/chef/${encodeURIComponent(user?.name)}`);
                        }}
                      >
                        Profile
                      </MenuItem>
                    }
                  />

                  <Divider />
                  <RenderComponent
                    if={user?.role === "chef"}
                    then={
                      <MenuItem
                        onClick={() => {
                          handleUserMenuClose();
                          navigate("/add-recipe");
                        }}
                      >
                        {i18n.addRecipe}
                      </MenuItem>
                    }
                  />
                  <MenuItem onClick={handleLogout}>{i18n.logout}</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/auth"
                size="small"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  color: "text.primary",
                }}
              >
                {i18n.login}
              </Button>
            )}

            {/* Mobile menu button */}
            <IconButton
              sx={{ display: { md: "none" } }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Navigation links - desktop */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
            px: 3,
            pb: 1.5,
          }}
        >
          <RenderComponent
            if={Features["feature-nav-links"]}
            then={navLinks.map((link) => (
              <Typography
                key={link.href}
                component={Link}
                to={link.href}
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": { color: "text.primary" },
                }}
              >
                {link.label}
              </Typography>
            ))}
          />
        </Box>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            size="small"
            placeholder="Search recipes..."
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <List>
            {navLinks.map((link, idx) => (
              <ListItem key={`${idx}.${link.href}`} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <RenderComponent
              if={isAuthenticated}
              then={
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  {i18n.logout}
                </Button>
              }
              else={
                <>
                  <Button
                    component={Link}
                    to="/auth"
                    fullWidth
                    variant="outlined"
                    onClick={() => setMobileOpen(false)}
                  >
                    {i18n.login}
                  </Button>
                  <Button
                    component={Link}
                    to="/auth"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => setMobileOpen(false)}
                  >
                    {i18n.join}
                  </Button>
                </>
              }
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
