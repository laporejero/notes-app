export async function login(page:any) {
    await page.getByLabel('Username').fill('testuser')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
}

export async function createNote(page:any, title:string, body:string) {
    await page.getByPlaceholder('Title').fill(title)
    await page.getByPlaceholder('Take a note...').fill(body)
    await page.getByRole('button', { name: 'Add Note' }).click()
}