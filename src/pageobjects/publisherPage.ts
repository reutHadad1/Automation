import { Page, Locator } from '@playwright/test';

export default class PublisherPage {
    private page: Page;
    private readonly url: string = 'http://localhost:3000/admin';
    

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto(this.url);
        await this.page.locator('xpath=//*[@id="app"]/section/section[2]/section[1]/section[1]/span').click();   
        await this.page.getByText('Happy Folder').click();
        await this.page.getByText('Publisher').click();
        return this.page;
    }

    async createPublisher(name: string, email: string) {
        await this.page.getByText('Create new').click();
        await this.page.getByTestId('property-edit-name').click();
        await this.page.keyboard.type(name);
        await this.page.getByTestId('property-edit-email').click();
        await this.page.keyboard.type(email);
        await this.page.getByTestId('button-save').click();
        return email; // Return the name for further usage if needed
    }

    async deletePuplisher(name: string) {
        await this.page.getByText("Home").click();
        await this.page.locator('xpath=//*[@id="app"]/section/section[2]/section[1]/section[1]/span').click();   
        await this.page.getByText('Publisher').click();
        await this.page.getByText(name).click();
        await this.page.getByTestId('action-delete').click();
        await this.page.getByRole('button', { name: 'Confirm' }).click();
    }
    async deleteAllPublishers() {
        // Implement logic to delete all publishers if needed
    }


}
