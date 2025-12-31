import { NextRequest } from "next/server";
import {
  jsonResponse,
  notFoundResponse,
  serverErrorResponse,
  validationErrorResponse
} from "../../../../server/api/response";
import { deleteTodoService, updateTodoService } from "../../../../server/todos/service";

export const PATCH = async (request: NextRequest, context: { params: { id: string } }) => {
  try {
    const payload = await request.json();
    const result = await updateTodoService(context.params.id, payload);
    if (result.errors) {
      return validationErrorResponse(result.errors);
    }
    if (result.notFound) {
      return notFoundResponse("Todo not found");
    }
    return jsonResponse(result.data, 200);
  } catch (error) {
    return serverErrorResponse();
  }
};

export const DELETE = async (_request: NextRequest, context: { params: { id: string } }) => {
  try {
    const result = await deleteTodoService(context.params.id);
    if (result.notFound) {
      return notFoundResponse("Todo not found");
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    return serverErrorResponse();
  }
};
