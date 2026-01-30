import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Tab,
  Tabs,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useAuth, UserRole } from "@/context/AuthContext";
import { SITE_NAME } from "@/app/constants";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Auth() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole>("viewer");

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(loginEmail, loginPassword);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!signupName.trim()) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    const result = await signup(
      signupEmail,
      signupPassword,
      signupName,
      signupRole,
    );

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 8 }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            fontFamily='"Fraunces", serif'
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            {SITE_NAME}
          </Typography>
          <Typography color="text.secondary">
            Have a seat at the table.
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => {
              setTabValue(newValue);
              setError(null);
            }}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab label="Log In" />
            <Tab label="Sign Up" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Panel */}
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                <TextField
                  label="Email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  fullWidth
                  sx={{
                    bgcolor: "text.primary",
                    color: "background.default",
                    "&:hover": { bgcolor: "text.secondary" },
                  }}
                >
                  {loading ? "Logging in..." : "Log In"}
                </Button>
              </Stack>
            </form>

            <Box
              sx={{ mt: 3, p: 2, bgcolor: "secondary.main", borderRadius: 1 }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Demo accounts:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                Chef: chef@example.com / chef123
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                Viewer: viewer@example.com / viewer123
              </Typography>
            </Box>
          </TabPanel>

          {/* Signup Panel */}
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleSignup}>
              <Stack spacing={3}>
                <TextField
                  label="Full Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  fullWidth
                  helperText="Minimum 6 characters"
                />
                <FormControl fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={signupRole}
                    label="Account Type"
                    onChange={(e) => setSignupRole(e.target.value as UserRole)}
                  >
                    <MenuItem value="viewer">
                      <Box>
                        <Typography>Viewer</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Browse recipes and save favorites
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="chef">
                      <Box>
                        <Typography>Chef</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Create and share your own recipes
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  fullWidth
                  sx={{
                    bgcolor: "text.primary",
                    color: "background.default",
                    "&:hover": { bgcolor: "text.secondary" },
                  }}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </Stack>
            </form>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
