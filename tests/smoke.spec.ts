import { test, expect } from '@playwright/test';

test.describe('motiondynamics.ai smoke', () => {
  test('home page loads with hero, headline, and CTAs', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    // Hero section is in the DOM
    const hero = page.locator('#hero-video');
    await expect(hero).toBeVisible();

    // Either the R3F canvas or the fallback video should render
    const canvasOrVideo = page.locator('#hero-video canvas, #hero-video video').first();
    await expect(canvasOrVideo).toBeAttached({ timeout: 10_000 });

    // New kinetic headline copy should be present
    await expect(page.getByText(/Movement/).first()).toBeVisible();
    await expect(page.getByText(/Intelligence/).first()).toBeVisible();

    // CTAs
    const bookDemo = page.getByRole('link', { name: /book a demo/i });
    await expect(bookDemo).toBeVisible();
    const exploreServices = page.getByRole('link', { name: /explore services/i });
    await expect(exploreServices).toBeVisible();

    // No console errors above the noise floor (filter out R3F dev warnings).
    const filtered = consoleErrors.filter((line) => !/R3F|three\.js dev/i.test(line));
    expect(filtered, filtered.join('\n')).toEqual([]);
  });

  test('Book a demo CTA scrolls to the contact form', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /book a demo/i });
    await cta.click();

    // The contact form lives at #contact and contains an email field
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport({ timeout: 5_000 });

    const emailInput = page.locator('#contact input[type="email"], #contact input[name="email"]').first();
    await expect(emailInput).toBeVisible();
  });

  test('Accuracy section is reachable', async ({ page }) => {
    await page.goto('/#accuracy');
    const accuracy = page.locator('#accuracy');
    await expect(accuracy).toBeInViewport({ timeout: 5_000 });
    await expect(page.getByText(/Physics-Informed Neural Networks/i)).toBeVisible();
  });
});
