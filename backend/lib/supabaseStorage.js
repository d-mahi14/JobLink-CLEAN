import { supabase } from './supabase.config.js';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert base64 to file buffer
const base64ToBuffer = (base64String) => {
  // Remove data URL prefix if present
  const base64Data = base64String.includes(',') 
    ? base64String.split(',')[1] 
    : base64String;
  
  return Buffer.from(base64Data, 'base64');
};

// Helper function to get file extension from base64 data URL
const getFileExtension = (base64String) => {
  if (base64String.startsWith('data:')) {
    const mimeType = base64String.split(';')[0].split(':')[1];
    const extension = mimeType.split('/')[1];
    return extension;
  }
  return 'bin'; // default extension
};

// Upload file to Supabase Storage
export const uploadToSupabase = async (base64File, folder = 'uploads', customFileName = null) => {
  try {
    // Get file extension
    const extension = getFileExtension(base64File);
    
    // Generate unique filename
    const fileName = customFileName || `${uuidv4()}.${extension}`;
    const filePath = `${folder}/${fileName}`;
    
    // Convert base64 to buffer
    const fileBuffer = base64ToBuffer(base64File);
    
    // Determine content type
    let contentType = 'application/octet-stream';
    if (base64File.startsWith('data:')) {
      contentType = base64File.split(';')[0].split(':')[1];
    }
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads') // bucket name
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: false
      });
    
    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);
    
    return {
      path: data.path,
      publicUrl,
      fileName,
      fileSize: fileBuffer.length
    };
  } catch (error) {
    console.error('Error in uploadToSupabase:', error);
    throw error;
  }
};

// Delete file from Supabase Storage
export const deleteFromSupabase = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('uploads')
      .remove([filePath]);
    
    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteFromSupabase:', error);
    throw error;
  }
};

// Get signed URL for private files (if needed)
export const getSignedUrl = async (filePath, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from('uploads')
      .createSignedUrl(filePath, expiresIn);
    
    if (error) {
      throw new Error(`Failed to get signed URL: ${error.message}`);
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error in getSignedUrl:', error);
    throw error;
  }
};