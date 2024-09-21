// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import zxcvbn from "zxcvbn";
import {
  Grid,
  Box,
  Card,
  Typography,
  Stack,
  Button,
  LinearProgress,
} from "@mui/material";
import Link from "next/link";
import PageContainer from "../components/container/PageContainer";
import Logo from "@/app/layout/shared/logo/Logo";
import CustomTextField from "../components/forms/theme-elements/CustomTextField";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordScore, setPasswordScore] = useState<number>(0);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If the password field is updated, evaluate its strength
    if (name === "password") {
      const result = zxcvbn(value);
      setPasswordScore(result.score);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const passwordResult = zxcvbn(form.password);
    if (passwordResult.score < 0) {
      newErrors.password =
        "Password is too weak. Please choose a stronger password.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const res = await fetch(`${API}/Register`, {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        username: form.username,
        password: form.password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/Login");
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  // Updated function to render the password strength meter using MUI components
  const renderPasswordStrengthMeter = () => {
    if (!form.password) {
      return null;
    }

    // Calculate the percentage for the LinearProgress component
    const progress = (passwordScore / 4) * 100; // zxcvbn score ranges from 0 to 4

    // Determine the color based on password strength
    let color: "error" | "warning" | "success" = "error";
    if (passwordScore <= 1) {
      color = "error";
    } else if (passwordScore === 2) {
      color = "warning";
    } else if (passwordScore >= 3) {
      color = "success";
    }

    return (
      <Box mt={2}>
        <LinearProgress variant="determinate" value={progress} color={color} />
      </Box>
    );
  };

  return (
    <PageContainer title="Register" description="this is Register page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>

              <Typography
                variant="subtitle1"
                textAlign="center"
                color="textSecondary"
                mb={1}
              >
                Your Social Campaigns
              </Typography>
              
                <Box>
                <form onSubmit={handleSubmit}>
                  <Stack mb={3}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="name"
                      mb="5px"
                    >
                      Name
                    </Typography>
                    <CustomTextField
                      id="name"
                      name="name"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                    />

                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="username"
                      mb="5px"
                      mt="25px"
                    >
                      Username
                    </Typography>
                    <CustomTextField
                      id="username"
                      name="username"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                    />

                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="password"
                      mb="5px"
                      mt="25px"
                    >
                      Password
                    </Typography>
                    <CustomTextField
                      type="password"
                      id="password"
                      name="password"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                    />
                    {renderPasswordStrengthMeter()}
                    {errors.password && (
                      <Typography color="error" variant="body2" mt={1}>
                        {errors.password}
                      </Typography>
                    )}

                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="confirmPassword"
                      mb="5px"
                      mt="25px"
                    >
                      Confirm Password
                    </Typography>
                    <CustomTextField
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                      <Typography color="error" variant="body2" mt={1}>
                        {errors.confirmPassword}
                      </Typography>
                    )}
                  </Stack>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                  >
                    Register
                  </Button>
                  </form>
                </Box>
             
              <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  Already have an Account?
                </Typography>
                <Typography
                  component={Link}
                  href="/Login"
                  fontWeight="500"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  Login
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
