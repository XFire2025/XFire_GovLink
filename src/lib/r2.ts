// lib/r2.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: "auto",
  // IMPORTANT: This endpoint comes from your R2 bucket settings.
  // It should be in the format: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  endpoint: "https://67ed7bdab3fd8706347809322d8ffbf0.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const uploadFileToR2 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folderPath?: string
): Promise<{ success: boolean; message: string; key?: string; error?: unknown }> => {
  // Create the full file path with folder if provided
  const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;
  
  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fullPath,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    // UPDATED: Return the key (path), NOT a public URL
    return {
      success: true,
      message: "File uploaded successfully",
      key: fullPath,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, message: "Upload failed", error };
  }
};

// NEW FUNCTION: Generates a temporary, secure download link (presigned URL)
export const getPresignedUrlForR2 = async (
  key: string,
  expiresIn: number = 900 // Default: 15 minutes in seconds
): Promise<{ success: boolean; message: string; url?: string; error?: unknown }> => {
  if (!key) {
    return { success: false, message: "A valid key must be provided." };
  }
  const downloadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(downloadParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return {
      success: true,
      message: "Presigned URL generated successfully",
      url: url,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return { success: false, message: "URL generation failed", error };
  }
};

export const downloadFileFromR2 = async (
  filePath: string
): Promise<{ success: boolean; message: string; fileBuffer?: Buffer; contentType?: string; error?: unknown }> => {
  const downloadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: filePath,
  };

  try {
    const command = new GetObjectCommand(downloadParams);
    const response = await s3Client.send(command);
    
    if (response.Body) {
      const fileBuffer = Buffer.from(await response.Body.transformToByteArray());
      return {
        success: true,
        message: "File downloaded successfully",
        fileBuffer,
        contentType: response.ContentType,
      };
    } else {
      return { success: false, message: "No file content found" };
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    return { success: false, message: "Download failed", error };
  }
};