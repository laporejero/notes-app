import { test, expect } from '@playwright/test'
import { login, createNote } from './helpers'

test.beforeEach(async ({ request }) => {
    await request.post('http://localhost:3001/api/testing/reset')

    await request.post('http://localhost:3001/api/users', {
        data: {
            name: 'Test User',
            username: 'testuser',
            password: 'password123'
        }
    })
})

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

test('user can log in', async ({ page }) => {
    await page.goto('/')

    await login(page)

    await expect(
        page.getByRole('button', { name: 'Logout' })
    ).toBeVisible()

    await expect(
        page.getByRole('button', { name: 'Add Note' })
    ).toBeVisible()
})

test('logged in user can create a note', async ({ page }) => {
    await page.goto('/')

    await login(page)

    await expect(
        page.getByRole('button', { name: 'Logout' })
    ).toBeVisible()

    await createNote(page, 'Playwright Test', 'This note was created by Playwright.')

    await expect(page.getByText('Playwright Test')).toBeVisible()

    await expect(
        page.getByText('This note was created by Playwright.')
    ).toBeVisible()
})

test('logged in user can edit a note', async ({ page }) => {
    await page.goto('/')

    await login(page)

    await expect(
        page.getByRole('button', { name: 'Logout' })
    ).toBeVisible()

    await createNote(page, 'Playwright Test', 'This note was created by Playwright.')

    await expect(page.getByText('Playwright Test')).toBeVisible()

    await page.getByText('Playwright Test', { exact: true }).click()

    await expect(page.getByTitle('Edit')).toBeVisible()

    await page.getByTitle('Edit').click()

    await page.locator('.edit-title-input').fill('Updated Playwright Test')

    await page.locator('.edit-note-input').fill('This note was updated by Playwright.')

    await page.getByTitle('Save Edit').click()

    const modal = page.locator('[class*="modalContent"]')
    await modal.getByRole('button', { name: 'Close modal' }).click()

    await expect(page.getByText('Updated Playwright Test')).toBeVisible()

    await expect(page.getByText('This note was updated by Playwright.')).toBeVisible()
})

test('logged in user can delete a note', async ({ page }) => {
    await page.goto('/')

    await login(page)

    await expect(
        page.getByRole('button', { name: 'Logout' })
    ).toBeVisible()

    await createNote(page, 'Playwright Test', 'This note was created by Playwright.')
    
    await expect(page.getByText('Playwright Test')).toBeVisible()
    await page.getByText('Playwright Test').click()

    await expect(page.getByTitle('Delete note', { exact: true })).toBeVisible()
    await page.getByTitle('Delete note', { exact: true }).click()

    await expect(page.getByText('Playwright Test')).not.toBeVisible()
})

test('login fails with wrong credentials', async ({ page }) => {
    await page.goto('/')

    await page.getByLabel('Username').fill('testuser')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Invalid username and password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
})

test('logged in user can pin a note', async ({ page }) => {
    await page.goto('/')

    await login(page)

    await expect(
        page.getByRole('button', { name: 'Logout' })
    ).toBeVisible()

    // 1st note
    await createNote(page, 'Playwright Test', 'This note was created by Playwright.')

    await expect(page.getByText('Playwright Test')).toBeVisible()

    // 2nd note
    await createNote(page, 'Second note', 'This second note was created by Playwright.')

    await expect(page.getByText('Second note', { exact: true })).toBeVisible()

    await page.getByText('Playwright Test').click()

    const modal = page.locator('[class*="modalContent"]')

    await expect(modal.getByTitle('Pin')).toBeVisible()
    await modal.getByTitle('Pin').click()
    await modal.getByRole('button', { name: 'Close modal' }).click()

    const firstNote = page.locator('li.note').first()
    await expect(firstNote).toContainText('Playwright Test')
})

test('logged in user can favorite a note', async ({ page }) => {
    await page.goto('/')

    await login(page)

    await expect(
        page.getByRole('button', { name: 'Logout' })
    ).toBeVisible()

    // 1st note
    await createNote(page, 'Playwright Test', 'This note was created by Playwright.')

    await expect(page.getByText('Playwright Test')).toBeVisible()

    // 2nd note
    await createNote(page, 'Second note', 'This second note was created by Playwright.')

    await expect(page.getByText('Second note', { exact: true })).toBeVisible()

    await page.getByText('Second note', { exact: true }).click()

    const modal = page.locator('[class*="modalContent"]')

    await expect(modal.getByTitle('Favorite')).toBeVisible()
    await modal.getByTitle('Favorite').click()
    await modal.getByRole('button', { name: 'Close modal' }).click()

    await page.getByLabel('Show notes:').selectOption({ label: 'Favorites' })

    await expect(
        page.getByText('Second note', { exact: true })
    ).toBeVisible()

    await expect(
        page.getByText('First note', { exact: true })
    ).toHaveCount(0)
})