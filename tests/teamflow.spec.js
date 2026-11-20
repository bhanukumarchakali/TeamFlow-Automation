const { test, expect } = require("@playwright/test");
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

test("TF_001 - Verify TeamFlow homepage loads", async ({ page }) => {
  // Step 1: Open TeamFlow
  const response = await page.goto("/");

  // Step 2: Verify successful server response
  expect(response && response.ok()).toBeTruthy();

  // Step 3: Verify homepage is visible
  await expect(page.locator("body")).toBeVisible();

  // Step 4: Verify homepage contains content
  await expect(page.locator("body")).not.toBeEmpty();
});

test("TF_002 - Verify Login page loads", async ({ page }) => {
  // Step 1: Open Login page
  const response = await page.goto("/login");

  // Step 2: Verify successful response
  expect(response && response.ok()).toBeTruthy();

  // Step 3: Verify Login page is visible
  await expect(page.locator("body")).toBeVisible();

  // Step 4: Verify Login page contains content
  await expect(page.locator("body")).not.toBeEmpty();
});

test("TF_003 - Verify Login form elements", async ({ page }) => {
  await page.goto("/login");

  // Verify Email field
  await expect(page.getByLabel(/email/i)).toBeVisible();

  // Verify Password field
  await expect(page.getByLabel(/password/i)).toBeVisible();

  // Verify Login button
  await expect(
    page.getByRole("button", { name: /login|sign in/i }),
  ).toBeVisible();
});

test("TF_004 - Verify successful login", async ({ page }) => {
  // Step 1: Open Login page
  await page.goto("login");

  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);

  // Step 4: Click Login
  await page.getByRole("button", { name: /login|sign in/i }).click();

  // Step 5: Verify Dashboard URL
  await expect(page).toHaveURL("/dashboard");
});

test("TF_005 - Verify Dashboard loads after login", async ({ page }) => {
  page.on("console", (message) => {
    if (message.type() === "error") {
      console.log("CONSOLE ERROR:", message.text());
    }
  });

  page.on("requestfailed", (request) => {
    console.log("REQUEST FAILED:", request.url(), request.failure()?.errorText);
  });

  page.on("response", (response) => {
    if (response.url().includes("/api/")) {
      console.log("API:", response.status(), response.url());
    }
  });

  await page.goto("/login");

  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();

  // Wait for dashboard route
  await expect(page).toHaveURL(/\/dashboard$/);

  // Verify actual dashboard content
  await expect(
    page.getByText("Overview of your workspace activity."),
  ).toBeVisible({ timeout: 15000 });

  // Verify navigation
  await expect(page.getByRole("link", { name: "Projects" })).toBeVisible();
});

test("TF_006 - Verify logout functionality", async ({ page }) => {
  // Step 1: Open login page
  await page.goto("/login");

  // Step 2: Login
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();

  // Step 3: Verify dashboard
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByText("Overview of your workspace activity."),
  ).toBeVisible();

  // Step 4: Open profile dropdown
  await page
    .getByRole("button", {
      name: /Chakali Kumar/,
    })
    .click();

  // Step 5: Click Log out
  await page
    .getByRole("button", {
      name: "Log out",
    })
    .click();

  // Step 6: Verify redirect to login
  await expect(page).toHaveURL(/\/login$/);

  // Step 7: Try accessing dashboard again
  await page.goto("/dashboard");

  // Verify protected route redirects to login
  await expect(page).toHaveURL(/\/login$/);
});

test("TF_007 - Verify unauthorized users cannot access dashboard", async ({
  page,
}) => {
  // Step 1: Directly access dashboard without logging in
  await page.goto("/dashboard");

  // Step 2: Verify user is redirected to login
  await expect(page).toHaveURL(/\/login$/);

  // Step 3: Verify login form is visible
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test("TF_008 - Verify login with invalid password", async ({ page }) => {
  // Step 1: Open login page
  await page.goto("/login");

  // Step 2: Enter valid email and incorrect password
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill("WrongPassword123!");

  // Step 3: Click Sign in
  await page.getByRole("button", { name: /sign in/i }).click();

  // Step 4: Verify invalid password error
  await expect(page.getByText(/invalid password/i)).toBeVisible();

  // Step 5: Verify user remains on login page
  await expect(page).toHaveURL(/\/login$/);
});

test("TF_009 - Verify login with empty fields", async ({ page }) => {
  // Step 1: Open Login page
  await page.goto("/login");

  // Step 2: Verify email and password are empty
  await expect(page.getByLabel(/email/i)).toHaveValue("");
  await expect(page.getByLabel(/password/i)).toHaveValue("");

  // Step 3: Click Sign in without entering credentials
  await page.getByRole("button", { name: /sign in/i }).click();

  // Step 4: Verify user remains on Login page
  await expect(page).toHaveURL(/\/login$/);

  // Step 5: Verify login form is still visible
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test("TF_010 - Verify login with invalid email format", async ({ page }) => {
  // Step 1: Open Login page
  await page.goto("/login");

  // Step 2: Enter invalid email and valid password
  await page.getByLabel(/email/i).fill("invalidemail");
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);

  // Step 3: Click Sign in
  await page.getByRole("button", { name: /sign in/i }).click();

  // Step 4: Verify user remains on Login page
  await expect(page).toHaveURL(/\/login$/);
});

test("TF_011 - Verify login with unregistered email", async ({ page }) => {
  // Step 1: Open Login page
  await page.goto("/login");

  // Step 2: Enter an unregistered email
  await page.getByLabel(/email/i).fill("unregistered@example.com");

  // Step 3: Enter a password
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);

  // Step 4: Click Sign in
  await page.getByRole("button", { name: /sign in/i }).click();

  // Step 5: Verify user remains on Login page
  await expect(page).toHaveURL(/\/login$/);

  // Step 6: Verify an error message appears
  await expect(
    page.getByText(/no account found.*please register/i),
  ).toBeVisible();
});

test("TF_012 - Verify password is masked", async ({ page }) => {
  // Step 1: Open Login page
  await page.goto("/login");

  // Step 2: Enter password
  await page.getByLabel(/password/i).fill("TestPassword123!");

  // Step 3: Verify password field is masked
  await expect(page.getByLabel(/password/i)).toHaveAttribute(
    "type",
    "password",
  );
});

test("TF_013 - Verify password visibility toggle", async ({ page }) => {
  await page.goto("/login");

  const passwordField = page.getByLabel(/password/i);

  // Enter password
  await passwordField.fill("TestPassword123!");

  // Verify password is hidden
  await expect(passwordField).toHaveAttribute("type", "password");

  // Click eye icon to show password
  await page.getByRole("button", { name: "👁️" }).click();

  // Verify password is visible
  await expect(passwordField).toHaveAttribute("type", "text");

  // Click changed icon to hide password
  await page.getByRole("button", { name: "🙈" }).click();

  // Verify password is hidden again
  await expect(passwordField).toHaveAttribute("type", "password");
});

test("TF_014 - Verify Remember Me checkbox", async ({ page }) => {
  // Step 1: Open Login page
  await page.goto("/login");

  // Step 2: Locate Remember Me checkbox
  const rememberMe = page.getByRole("checkbox", {
    name: /remember me/i,
  });

  // Step 3: Verify checkbox is initially unchecked
  await expect(rememberMe).not.toBeChecked();

  // Step 4: Select checkbox
  await rememberMe.check();

  // Step 5: Verify checkbox is checked
  await expect(rememberMe).toBeChecked();

  // Step 6: Uncheck checkbox
  await rememberMe.uncheck();

  // Step 7: Verify checkbox is unchecked
  await expect(rememberMe).not.toBeChecked();
});

test("TF_015 - Verify Forgot Password navigation", async ({ page }) => {
  // Step 1: Open Login page
  await page.goto("/login");

  // Step 2: Click Forgot password
  await page
    .getByRole("button", {
      name: /forgot password/i,
    })
    .click();

  // Step 3: Verify navigation
  await expect(page).toHaveURL(/\/forgot-password$/);
});

test("TF_016 - Verify Create Account navigation", async ({ page }) => {
  // Step 1: Open Login page
  await page.goto("/login");

  // Step 2: Click Create account
  await page
    .getByRole("button", {
      name: /create account/i,
    })
    .click();

  // Step 3: Verify navigation to registration page
  await expect(page).toHaveURL(/\/register$/);
});

test("TF_017 - Verify Registration page loads", async ({ page }) => {
  // Step 1: Open Registration page
  const response = await page.goto("/register");

  // Step 2: Verify successful page response
  expect(response && response.ok()).toBeTruthy();

  // Step 3: Verify registration form elements
  await expect(page.getByLabel("First name")).toBeVisible();
  await expect(page.getByLabel("Last name")).toBeVisible();
  await expect(page.getByLabel(/email address/i)).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Confirm password")).toBeVisible();

  // Step 4: Verify Create Account button
  await expect(
    page.getByRole("button", { name: "Create account" }),
  ).toBeVisible();
});

test("TF_018 - Verify Registration form field attributes", async ({ page }) => {
  // Step 1: Open Registration page
  await page.goto("/register");

  // Step 2: Verify First name field
  const firstName = page.getByLabel("First name");
  await expect(firstName).toHaveAttribute("type", "text");
  await expect(firstName).toHaveValue("");

  // Step 3: Verify Last name field
  const lastName = page.getByLabel("Last name");
  await expect(lastName).toHaveAttribute("type", "text");
  await expect(lastName).toHaveValue("");

  // Step 4: Verify Email field
  const email = page.getByLabel(/email address/i);
  await expect(email).toHaveAttribute("type", "email");
  await expect(email).toHaveValue("");

  // Step 5: Verify Password field
  const password = page.getByLabel("Password", { exact: true });
  await expect(password).toHaveAttribute("type", "password");
  await expect(password).toHaveValue("");

  // Step 6: Verify Confirm Password field
  const confirmPassword = page.getByLabel("Confirm password");
  await expect(confirmPassword).toHaveAttribute("type", "password");
  await expect(confirmPassword).toHaveValue("");
});

test("TF_019 - Verify Registration password visibility toggle", async ({
  page,
}) => {
  // Step 1: Open Registration page
  await page.goto("/register");

  // Step 2: Locate both password fields
  const password = page.getByLabel("Password", { exact: true });
  const confirmPassword = page.getByLabel("Confirm password");

  // Step 3: Enter passwords
  await password.fill("TestPassword123!");
  await confirmPassword.fill("TestPassword123!");

  // Step 4: Verify both fields are initially hidden
  await expect(password).toHaveAttribute("type", "password");
  await expect(confirmPassword).toHaveAttribute("type", "password");

  // Step 5: Show first password
  const eyeButtons = page.getByRole("button", { name: "👁️" });
  await eyeButtons.nth(0).click();

  // Step 6: Verify first password is visible
  await expect(password).toHaveAttribute("type", "text");
  await expect(confirmPassword).toHaveAttribute("type", "password");

  // Step 7: Show confirm password
  await page.getByRole("button", { name: "👁️" }).click();

  // Step 8: Verify both passwords are visible
  await expect(password).toHaveAttribute("type", "text");
  await expect(confirmPassword).toHaveAttribute("type", "text");

  // Step 9: Hide both passwords
  await page.getByRole("button", { name: "🙈" }).nth(0).click();
  await page.getByRole("button", { name: "🙈" }).click();

  // Step 10: Verify both passwords are hidden
  await expect(password).toHaveAttribute("type", "password");
  await expect(confirmPassword).toHaveAttribute("type", "password");
});

test("TF_020 - Verify Registration with empty fields", async ({ page }) => {
  // Step 1: Open Registration page
  await page.goto("/register");

  // Step 2: Click Create account without entering details
  await page
    .getByRole("button", {
      name: "Create account",
    })
    .click();

  // Step 3: Verify user remains on Registration page
  await expect(page).toHaveURL(/\/register$/);

  // Step 4: Verify required fields are still empty
  await expect(page.getByLabel("First name")).toHaveValue("");
  await expect(page.getByLabel("Last name")).toHaveValue("");
  await expect(page.getByLabel(/email address/i)).toHaveValue("");
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Confirm password")).toHaveValue("");
});
