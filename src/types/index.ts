export interface SharedFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  shareCode: string;
  password?: string; // Made optional
  uploadedAt: Date;
  expiresAt: Date;
  downloadUrl: string;
  downloadCount: number;
  maxDownloads: number;
  hasPassword: boolean; // Track if file has password protection
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

export interface ShareSettings {
  customFileName?: string;
  password?: string;
  usePassword: boolean;
}