import { supabase } from '../lib/supabase';
import { SharedFile, ShareSettings } from '../types';

export class SupabaseShareService {
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

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async shareFile(
    file: File,
    settings: ShareSettings,
    onProgress?: (progress: number) => void
  ): Promise<SharedFile> {
    try {
      // Use custom share code if provided, otherwise generate one
      const shareCode = settings.customShareCode || this.generateShareCode();
      
      // Check if custom share code already exists
      if (settings.customShareCode) {
        const { data: existingFile } = await supabase
          .from('shared_files')
          .select('share_code')
          .eq('share_code', shareCode)
          .single();
        
        if (existingFile) {
          throw new Error('This share code is already in use. Please choose a different one.');
        }
      }
      
      // Simulate progress for file processing
      if (onProgress) {
        for (let i = 0; i <= 50; i += 10) {
          setTimeout(() => onProgress(i), i * 20);
        }
      }

      // Convert file to base64 for storage
      const base64Data = await this.fileToBase64(file);
      
      if (onProgress) onProgress(70);

      // Hash password if provided
      let passwordHash: string | null = null;
      if (settings.usePassword && settings.password) {
        passwordHash = await this.hashPassword(settings.password);
      }

      if (onProgress) onProgress(80);

      // Create shared file record
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      
      const { data, error } = await supabase
        .from('shared_files')
        .insert({
          share_code: shareCode,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_data: base64Data,
          password_hash: passwordHash,
          has_password: settings.usePassword,
          expires_at: expiresAt.toISOString(),
          max_downloads: 100
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to share file. Please try again.');
      }

      if (onProgress) onProgress(100);

      const sharedFile: SharedFile = {
        id: data.id,
        fileName: data.file_name,
        fileSize: data.file_size,
        fileType: data.file_type,
        shareCode: data.share_code,
        password: settings.usePassword ? settings.password : undefined,
        hasPassword: data.has_password,
        uploadedAt: new Date(data.uploaded_at),
        expiresAt: new Date(data.expires_at),
        downloadUrl: data.file_data,
        downloadCount: data.download_count,
        maxDownloads: data.max_downloads
      };

      return sharedFile;
    } catch (error) {
      console.error('Error sharing file:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to share file. Please try again.');
    }
  }

  async downloadFile(shareCode: string, password?: string): Promise<void> {
    try {
      // First cleanup expired files
      await this.cleanupExpiredFiles();

      const { data: fileData, error } = await supabase
        .from('shared_files')
        .select('*')
        .eq('share_code', shareCode.toUpperCase())
        .single();
      
      if (error || !fileData) {
        throw new Error('File not found. Please check the share code.');
      }

      // Check if file has expired
      const expiresAt = new Date(fileData.expires_at);
      if (expiresAt < new Date()) {
        throw new Error('This file has expired and is no longer available.');
      }

      // Check download limit
      if (fileData.download_count >= fileData.max_downloads) {
        throw new Error('Download limit reached for this file.');
      }

      // Verify password if file has password protection
      if (fileData.has_password) {
        if (!password) {
          throw new Error('This file is password protected. Please enter the password.');
        }
        
        const hashedPassword = await this.hashPassword(password);
        if (fileData.password_hash !== hashedPassword) {
          throw new Error('Invalid password. Please check your credentials.');
        }
      }

      // Convert base64 back to blob and download
      const blob = this.base64ToBlob(fileData.file_data, fileData.file_type);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Update download count
      await supabase
        .from('shared_files')
        .update({ download_count: fileData.download_count + 1 })
        .eq('id', fileData.id);

    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async getSharedFilesList(): Promise<SharedFile[]> {
    try {
      // First cleanup expired files
      await this.cleanupExpiredFiles();

      const { data, error } = await supabase
        .from('shared_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shared files:', error);
        return [];
      }

      return data.map(file => ({
        id: file.id,
        fileName: file.file_name,
        fileSize: file.file_size,
        fileType: file.file_type,
        shareCode: file.share_code,
        password: undefined, // Don't expose password in list
        hasPassword: file.has_password,
        uploadedAt: new Date(file.uploaded_at),
        expiresAt: new Date(file.expires_at),
        downloadUrl: file.file_data,
        downloadCount: file.download_count,
        maxDownloads: file.max_downloads
      }));
    } catch (error) {
      console.error('Error getting shared files list:', error);
      return [];
    }
  }

  async deleteSharedFile(shareCode: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('shared_files')
        .delete()
        .eq('share_code', shareCode);

      if (error) {
        console.error('Error deleting shared file:', error);
        throw new Error('Failed to delete file.');
      }
    } catch (error) {
      console.error('Error deleting shared file:', error);
      throw error;
    }
  }

  async cleanupExpiredFiles(): Promise<void> {
    try {
      const { error } = await supabase
        .from('shared_files')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Error cleaning up expired files:', error);
      }
    } catch (error) {
      console.error('Error cleaning up expired files:', error);
    }
  }
}

export const supabaseShareService = new SupabaseShareService();