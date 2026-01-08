
export type getFileType = (fileName: string) => Blob
export type setFileType = (randomName: string, file: File) => Promise<string | null>
export type getFileNameType = (url: string) => string | null;