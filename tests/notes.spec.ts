import { test, expect } from '@playwright/test'

test('front page can be opened', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Sign in to access your notes.')).toBeVisible()
})

test('login form is shown', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByLabel('Username')).toBeVisible()

    await expect(page.getByLabel('Password')).toBeVisible()
    
    await expect(
        page.getByRole('button', { name: 'Sign In' })
    ).toBeVisible()
})