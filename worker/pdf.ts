import "https://deno.land/x/dotenv/load.ts";
import { S3Client, PutObjectCommand, GetObjectCommand} from "npm:@aws-sdk/client-s3";
import puppeteer from "npm:puppeteer";
import ejs from "npm:ejs";


const s3 = new S3Client({
  region: Deno.env.get("AWS_REGION"),
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  },
  forcePathStyle: true,
});

async function uploadPDFToS3(fileBuffer: Uint8Array, bucketName: string, key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: "application/pdf",
  });
   // @ts-ignore don't worry it works
  await s3.send(command);
  return `https://${bucketName}.s3.${Deno.env.get("AWS_REGION")}.amazonaws.com/${key}`;
}

async function fetchFileFromS3(fileUrl: string): Promise<string> {
  try {
    const url = new URL(fileUrl);
    const parts = url.pathname.substring(1).split("/");
    const bucketName = Deno.env.get("AWS_S3_BUCKET")!;
    const key = parts.join("/");

    const command = new GetObjectCommand({ 
      Bucket: bucketName, 
      Key: key 
    });
    // @ts-ignore Deno compatiblity issue
    const response = await s3.send(command);
    
    // @ts-ignore could use Output type
    if (!response.Body) {
      throw new Error("No body found in S3 response");
    }

    // Convert AWS SDK stream to Deno ReadableStream
    // @ts-ignore could use Output type
    const readableStream = response.Body.transformToWebStream();
    
    return await streamToString(readableStream);
  } catch (error) {
    console.error("Error fetching file from S3:", error);
    throw error;
  }
}

// Updated stream handler
async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    
    return new TextDecoder().decode(concatUint8Arrays(chunks));
  } finally {
    reader.releaseLock();
  }
}

function concatUint8Arrays(chunks: Uint8Array[]): Uint8Array {
  const size = chunks.reduce((total, arr) => total + arr.length, 0);
  const result = new Uint8Array(size);
  let offset = 0;
  
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  
  return result;
}



async function generatePDFBuffer(htmlContent: string): Promise<Uint8Array> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "load" });
  const pdfBuffer = await page.pdf();
  await browser.close();
  return pdfBuffer;
}

export async function generateUserResume(templateRecord_url:string, resumeData: object): Promise<string> {
  const ejsTemplateContent = await fetchFileFromS3(templateRecord_url);
  const htmlContent = ejs.render(ejsTemplateContent, { resume: resumeData });
  const pdfBuffer = await generatePDFBuffer(htmlContent);
  
  const bucketName = Deno.env.get("AWS_S3_BUCKET")!;
  const key = `user-resumes/${Date.now()}-resume`;
  return await uploadPDFToS3(pdfBuffer, bucketName, key);
}
