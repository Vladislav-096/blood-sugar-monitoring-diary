// class CustomError extends Error {
//   constructor(public code: number, message: string) {
//     super(message);
//     this.name = this.constructor.name;
//   }
// }

class CustomError extends Error {
  public readonly code: string; // Явно объявляем как string

  constructor(code: number, message: string) {
    super(message);
    this.code = code.toString(); // Конвертируем number в string

    // Важно для корректной работы instanceof
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export async function validateResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response;
}

export async function validateGetResponse(
  response: Response
): Promise<Response> {
  if (!response.ok) {
    const status = response.status;
    if (status === 404) {
      throw new CustomError(404, "Data is not found. Try again later");
    } else if (status >= 500 && status < 600) {
      throw new CustomError(500, "Server error");
    } else {
      throw new CustomError(status, "Unknown error, try again later");
    }
  }
  return response;
}
