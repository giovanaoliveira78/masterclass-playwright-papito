import { expect, APIRequestContext } from "playwright/test"
import { TaskModel } from "../fixtures/task.model"

export async function deletTaskByHelper(request: APIRequestContext, taskName: string) {
    await request.delete('Aqui deveria ser o link local da API do instrutor' + taskName)
}

export async function postTask(request: APIRequestContext, task: TaskModel) {
    const newTask = await request.post('Aqui deveria ser o endpoint', { data: task })
    expect(newTask.ok()).toBeTruthy()
}