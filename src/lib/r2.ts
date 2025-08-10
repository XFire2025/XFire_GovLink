
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
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
): Promise<{ success: boolean; message: string; url?: string; error?: unknown }> => {
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
    // Use the R2 public URL format
    const publicUrl = `${process.env.R2_ENDPOINT}/${fullPath}`;
    return {
      success: true,
      message: "File uploaded successfully",
      url: publicUrl,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, message: "Upload failed", error };
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
