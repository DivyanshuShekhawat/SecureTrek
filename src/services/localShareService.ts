import { SharedFile, LocalFile, ShareSettings } from '../types';

export class LocalShareService {
  private generateShareCode(): string {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  async shareFile(
    file: File,
    settings: ShareSettings,
    onProgress?: (progress: number) => void
  ): Promise<SharedFile> {
    try {
      const shareCode = this.generateShareCode();
      
      // Simulate progress for file processing
      if (onProgress) {
        for (let i = 0; i <= 90; i += 10) {
          setTimeout(() => onProgress(i), i * 20);
        }
      }

      // Convert file to base64 for storage
      const base64Data = await this.fileToBase64(file);
      
      const sharedFile: SharedFile = {
        id: `${shareCode}_${Date.now()}`,
        fileName: settings.customFileName || file.name,
        fileSize: file.size,
        fileType: file.type,
        shareCode,
        password: settings.usePassword ? settings.password : undefined,
        hasPassword: settings.usePassword,
        uploadedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        downloadUrl: base64Data, // Store base64 data directly
        downloadCount: 0,
        maxDownloads: 100
      };

      // Store in localStorage with the share code as key
      const sharedFiles = this.getSharedFiles();
      sharedFiles[shareCode] = {
        ...sharedFile,
        uploadedAt: sharedFile.uploadedAt.toISOString(),
        expiresAt: sharedFile.expiresAt.toISOString()
      };
      
      localStorage.setItem('sharedFiles', JSON.stringify(sharedFiles));
      
      if (onProgress) {
        setTimeout(() => onProgress(100), 100);
      }

      return sharedFile;
    } catch (error) {
      console.error('Error sharing file:', error);
      throw new Error('Failed to share file. Please try again.');
    }
  }

  private getSharedFiles(): Record<string, any> {
    try {
      const stored = localStorage.getItem('sharedFiles');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  async downloadFile(shareCode: string, password?: string): Promise<void> {
    try {
      const sharedFiles = this.getSharedFiles();
      const fileData = sharedFiles[shareCode];
      
      if (!fileData) {
        throw new Error('File not found. Please check the share code.');
      }

      // Verify password if file has password protection
      if (fileData.hasPassword) {
        if (!password) {
          throw new Error('This file is password protected. Please enter the password.');
        }
        if (fileData.password !== password) {
          throw new Error('Invalid password. Please check your credentials.');
        }
      }

      // Check if file has expired
      const expiresAt = new Date(fileData.expiresAt);
      if (expiresAt < new Date()) {
        throw new Error('This file has expired and is no longer available.');
      }

      // Check download limit
      if (fileData.downloadCount >= fileData.maxDownloads) {
        throw new Error('Download limit reached for this file.');
      }

      // Convert base64 back to blob and download
      const blob = this.base64ToBlob(fileData.downloadUrl, fileData.fileType);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Update download count
      fileData.downloadCount += 1;
      sharedFiles[shareCode] = fileData;
      localStorage.setItem('sharedFiles', JSON.stringify(sharedFiles));

    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  getSharedFilesList(): SharedFile[] {
    const sharedFiles = this.getSharedFiles();
    return Object.values(sharedFiles).map(file => ({
      ...file,
      uploadedAt: new Date(file.uploadedAt),
      expiresAt: new Date(file.expiresAt)
    }));
  }

  deleteSharedFile(shareCode: string): void {
    const sharedFiles = this.getSharedFiles();
    delete sharedFiles[shareCode];
    localStorage.setItem('sharedFiles', JSON.stringify(sharedFiles));
  }

  cleanupExpiredFiles(): void {
    const sharedFiles = this.getSharedFiles();
    const now = new Date();
    let hasChanges = false;

    Object.keys(sharedFiles).forEach(shareCode => {
      const file = sharedFiles[shareCode];
      const expiresAt = new Date(file.expiresAt);
      if (expiresAt < now) {
        delete sharedFiles[shareCode];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      localStorage.setItem('sharedFiles', JSON.stringify(sharedFiles));
    }
  }
}

export const localShareService = new LocalShareService();