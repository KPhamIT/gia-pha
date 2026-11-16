export const BLANK_BOOK_PATH = "/sach-gia-pha-trong";

export const blankBookOrderPath = (accessToken: string) => `${BLANK_BOOK_PATH}/don/${encodeURIComponent(accessToken)}`;
