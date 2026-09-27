// (C) 2026 GoodData Corporation

export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    const sdkError = error as Error & {
      seType?: string;
      cause?: unknown;
      getErrorCode?: () => string;
      getCause?: () => unknown;
    };
    const cause = sdkError.getCause?.() ?? sdkError.cause;
    const causeText = cause ? `\nCause: ${formatError(cause)}` : "";
    const code = sdkError.getErrorCode?.() ?? sdkError.seType;
    return `${code ? `${code}: ` : ""}${error.message}${causeText}`;
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
};
