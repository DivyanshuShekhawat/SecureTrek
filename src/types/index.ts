export interface SharedFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  shareCode: string;
  password: string;
  uploadedAt: Date;
  expiresAt: Date;
  downloadUrl: string;
  downloadCount: number;
  maxDownloads: number;
}

export interface LocalFile {
  id: string;
  file: File;
  uploadedAt: Date;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}