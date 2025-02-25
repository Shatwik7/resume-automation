import "https://deno.land/x/dotenv/load.ts";
import { S3Client, PutObjectCommand ,DeleteObjectCommand} from "npm:@aws-sdk/client-s3";

// ------------------ AWS S3 Setup ------------------
const s3 = new S3Client({
  region: Deno.env.get("AWS_REGION"),
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  },
});

/**
 * Uploads a file to S3 using AWS SDK v3.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} key - The S3 key (file path).
 * @param {Uint8Array} fileData - File data as Uint8Array.
 * @param {string} contentType - MIME type.
 * @returns {Promise<string>} - Resolves with the S3 file URL.
 */
export async function uploadToS3(bucketName: string, key: string, fileData: Uint8Array, contentType: string): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileData,
      ContentType: contentType,
    });

    await s3.send(command);
    console.log("✅ Upload successful:", key);
    return `https://${bucketName}.s3.${Deno.env.get("AWS_REGION")}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("❌ Upload Failed:", error);
    throw error;
  }
}


/**
 * Deletes a file from S3.
 */
export async function deleteFromS3(bucketName: string, key: string) {
  try {
    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
    await s3.send(command);
  } catch (error) {
    console.error("❌ Error deleting from S3:", error);
  }
}