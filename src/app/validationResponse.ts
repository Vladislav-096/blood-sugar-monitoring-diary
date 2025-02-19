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
      throw new Error("Data is not found. Try again later");
    } else if (status >= 500 && status < 600) {
      throw new Error("Server error");
    } else {
      throw new Error("Unknown error, try again later");
    }
  }

  return response;
}
