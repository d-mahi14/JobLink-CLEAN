import { useState } from 'react';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadFile = async (file, callback) => {
    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      if (callback) {
        await callback(base64);
      }
      return base64;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadFile,
    fileToBase64,
  };
};