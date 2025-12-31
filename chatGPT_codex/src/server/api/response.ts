import { NextResponse } from "next/server";
import { ValidationError } from "../../lib/validation/todo";

export const jsonResponse = <T>(data: T, status = 200) => {
  return NextResponse.json(data, { status });
};

export const validationErrorResponse = (errors: ValidationError[]) => {
  return NextResponse.json(
    { message: "Validation failed", errors },
    { status: 400 }
  );
};

export const notFoundResponse = (message = "Not found") => {
  return NextResponse.json({ message }, { status: 404 });
};

export const serverErrorResponse = (message = "Unexpected error") => {
  return NextResponse.json({ message }, { status: 500 });
};
