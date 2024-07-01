import { test, expect } from '@playwright/test';
import LoginPage from '../pageobjects/loginPage';
import PublisherPage from '../pageobjects/publisherPage';
import PostPage from '../pageobjects/postPage';

test('Create Publisher, Create Post, Edit Post Status, Validate Status Change', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('admin@example.com', 'password');

    // Create Publisher
    const publisher = new PublisherPage(page);
    const publisherPage= await publisher.navigate();
    const publisherName = await publisher.createPublisher("myPublisher", "reutbenl@gmail.com");
    await expect(publisherPage.getByText(publisherName)).toBeVisible();

    // Create Post
    const post = new PostPage(page, loginPage);
    const postPage= await post.navigate();
    await post.createPost(publisherName, "testTitle", "contentTest", "23", "string");
    await expect(postPage.getByText("testTitle")).toBeVisible();


    // Edit Post - Change status to Remove
    const row = await post.editPostStatus("testTitle", "REMOVED");
    await expect(row.getByText("REMOVED")).toBeVisible();

    //delete post
    await post.deletePost("testTitle");
    await expect(postPage.getByText("testTitle")).toHaveCount(0);
    await postPage.waitForTimeout(3000)

    //delete publisher
    await publisher.deletePuplisher("myPublisher");
    await expect(publisherPage.getByText("myPublisher")).toHaveCount(0);

    await loginPage.logout("admin@example.com");





});
