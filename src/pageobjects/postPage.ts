import { Page } from '@playwright/test';
import LoginPage from './loginPage';

export default class PostPage {
    private page: Page;
    private loginPage : LoginPage;

    constructor(page: Page, loginPage: LoginPage) {
        this.page = page;
        this.loginPage = loginPage;
    }

    async navigate() {
        await this.page.goto(this.loginPage.url);
        await this.page.locator('xpath=//*[@id="app"]/section/section[2]/section[1]/section[1]/span').click();   
        await this.page.getByText('Post').click();
        return this.page;
    }

    async createPost(publisherName: string, title: string, content: string, jNum: string, jString: string) {
        await this.page.getByText('Create new').click();
        await this.page.getByTestId('property-edit-title').click();
        await this.page.keyboard.type(title);
        await this.page.getByTestId('property-edit-content').click();
        await this.page.keyboard.type(content);
        await this.page.getByTestId('someJson-add').click();
        await this.page.getByTestId('property-edit-someJson.0.number').click();
        await this.page.keyboard.type(jNum);
        await this.page.getByTestId('property-edit-someJson.0.string').click();
        await this.page.keyboard.type(jString);
        await this.page.getByText("Some Json Boolean").click();
        await this.page.getByTestId('property-edit-someJson.0.date').click();
        await this.page.keyboard.type(new Date().toDateString());
        await this.page.getByTestId('property-edit-status').click();
        await this.page.getByText('ACTIVE', { exact: true }).click();
        await this.page.getByText("Published").click();
        await this.page.getByTestId('property-edit-publisher').click();
        await this.page.getByText(publisherName, { exact: true }).click();
        await this.page.getByTestId('button-save').click();
    }


    async editPostStatus(postTitle: string, newStatus: string) {
        await this.page.getByText(postTitle).click();
        await this.page.getByTestId('action-edit').click();
        await this.page.getByTestId('property-edit-status').click();
        await this.page.getByText(newStatus, { exact: true }).click();
        await this.page.getByTestId('button-save').click();
        // Validate post status was changed to Remove
        const row= await this.filterPost(postTitle);
        return row;
    }

    async filterPost(postTitle: string) {
        const row = await this.page.getByRole("row").filter({ hasText: postTitle }).getByText("REMOVED");
        return row;
    }

    async deletePost(postTitle: string) {
        const row= await this.filterPost(postTitle);
        row.click();
        await this.page.getByTestId('action-delete').click();
        await this.page.getByRole('button', { name: 'Confirm' }).click();
    }

    async deleteAllPosts() {
        // Implement logic to delete all 

        
    }




}


