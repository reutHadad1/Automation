import { Page } from '@playwright/test';

export default class LoginPage {
    private page: Page;
    private readonly loginUrl: string = 'http://localhost:3000/admin';
    

    constructor(page: Page) {
        this.page = page;
    }

    public get url() {
        return this.loginUrl;
    }

    async navigate() {
        await this.page.goto(this.loginUrl);
    }

    async login(email: string, password: string) {
        await this.page.getByPlaceholder('Email').fill(email);
        await this.page.getByPlaceholder('Password').fill(password);
        await this.page.getByText('Login').click();
        await this.page.waitForNavigation();
    }

    async logout(email: string) {
        await  this.page.getByText(email).click();
        await this.page.getByText('Log out').click();


    }
}

