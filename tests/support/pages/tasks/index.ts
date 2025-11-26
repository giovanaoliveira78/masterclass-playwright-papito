import { Page, expect, Locator } from "@playwright/test"
import { TaskModel } from "../../../fixtures/task.model"

export class TasksPage {
    readonly page: Page
    readonly inputTaskName: Locator

    constructor(page: Page) {
        this.page = page
        this.inputTaskName = page.locator('input[class*=InputNewTask]')
    }

    async go() {
        await this.page.goto('http://192.168.15.7:8080/')
    }

    async create(task: TaskModel) {
        await this.inputTaskName.fill(task.name)

        await this.page.click('css=button >> text=Create')
    }
    async shouldHaveText(taskName: string) {
        const target = this.page.locator(`ncss=.task-item p >> text=${taskName}`)
        await expect(target).toBeVisible()
    }
    async alertHaveText(text: string) {
        const target = this.page.locator('.swal2-html-container')
        await expect(target).toHaveText(text)
    }
}