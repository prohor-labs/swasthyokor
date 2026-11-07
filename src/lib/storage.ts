import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const region = process.env.AWS_REGION || "us-east-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const bucketName =
  process.env.S3_BUCKET || process.env.STORAGE_BUCKET || "uploads";

export const s3 = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

export function isS3Configured(): boolean {
  return Boolean(endpoint && accessKeyId && secretAccessKey);
}

export function extractKeyFromUrl(urlOrKey: string): string | null {
  if (!urlOrKey) return null;
  const trimmed = urlOrKey.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return trimmed.replace(/^\/+/, "");
  }
  try {
    const parsed = new URL(trimmed);
    const path = parsed.pathname.replace(/^\/+/, "");
    if (bucketName && path.startsWith(`${bucketName}/`)) {
      return path.slice(bucketName.length + 1);
    }
    return path;
  } catch {
    return trimmed;
  }
}

export async function uploadObject({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
}): Promise<string> {
  const cleanKey = key.replace(/^\/+/, "");
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: cleanKey,
    Body: body,
    ContentType: contentType,
  });

  await s3.send(command);

  const s3PublicUrl = process.env.S3_PUBLIC_URL;
  if (s3PublicUrl) {
    return `${s3PublicUrl.replace(/\/$/, "")}/${cleanKey}`;
  }

  const baseEndpoint = (endpoint || "").replace(/\/$/, "");
  return `${baseEndpoint}/${bucketName}/${cleanKey}`;
}

export async function deleteObject(keyOrUrl: string): Promise<boolean> {
  const key = extractKeyFromUrl(keyOrUrl);
  if (!key) return false;

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await s3.send(command);
    return true;
  } catch (error) {
    console.error(`Failed to delete object from S3 (${key}):`, error);
    return false;
  }
}
