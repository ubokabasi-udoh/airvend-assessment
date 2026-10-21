import { isAxiosError } from "axios";

const readMessage = (value: unknown): string | undefined => {
  if (value && typeof value === "object" && "message" in value) {
    const message = (value as { message?: unknown }).message;

    if (typeof message === "string" && message.trim()) return message;
  }

  return undefined;
};

/** Message from a successful response body, or the fallback. */
export function getSuccessMessage(response: unknown, fallback: string) {
  return readMessage(response) ?? fallback;
}

/** Message from a failed request's response body, or the fallback. */
export function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    return readMessage(error.response?.data) ?? fallback;
  }

  return readMessage(error) ?? fallback;
}
