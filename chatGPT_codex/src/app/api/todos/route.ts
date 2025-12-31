import { NextRequest } from "next/server";
import { jsonResponse, serverErrorResponse, validationErrorResponse } from "../../../server/api/response";
import { createTodoService, listTodosService } from "../../../server/todos/service";

export const GET = async () => {
  try {
    const items = await listTodosService();
    return jsonResponse(items, 200);
  } catch (error) {
    return serverErrorResponse();
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const payload = await request.json();
    const result = await createTodoService(payload);
    if (result.errors) {
      return validationErrorResponse(result.errors);
    }
    return jsonResponse(result.data, 201);
  } catch (error) {
    return serverErrorResponse();
  }
};
