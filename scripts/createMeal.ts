/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://api.foodiary.arthurspace.com/meals';
const TOKEN = 'eyJraWQiOiJQR05cL2prR09tWkwwbEJVdlRNSGIzb0tORm9PeUx0ejVvcWJiRHVGZGErOD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3M2NjNWE5YS0wMGYxLTcwOWEtM2E5Ni1iY2JkM2E3MjFhOGYiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV9ZajByUmtlaUIiLCJjbGllbnRfaWQiOiIxZ3MzYWtwaGlubmlwMDIwbWQzcjloNTE1YSIsIm9yaWdpbl9qdGkiOiJkMjkyN2U0My04Njc3LTRmMDYtODhjOS0xNmNhOGVkMzE0NDEiLCJpbnRlcm5hbElkIjoiMzBUNWdLNG01ekJieU9IcFlob0lOMjRRbVNYIiwiZXZlbnRfaWQiOiJlZThmZjdmYy1jZmVkLTQ5OWQtOThiYS04MzVhNGRlNmRmMjkiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzYwMTU4MjI3LCJleHAiOjE3NjAyMDE0MjcsImlhdCI6MTc2MDE1ODIyNywianRpIjoiYzFkMjhiYTctYTVmNC00NDU5LTlmMjAtZmNiYjBmZTM3MGM2IiwidXNlcm5hbWUiOiI3M2NjNWE5YS0wMGYxLTcwOWEtM2E5Ni1iY2JkM2E3MjFhOGYifQ.sBMeukba-a8zE-m-dqHZarw_Z7Ida_YxDYPXWMGLbwwJOhAW6LbKlZ3DMHfSGdL0Pe9oG12iPSP7ZXH4t9Ixsdf_te2Rxu5IhxOK9TC4j6XhSAS-ghL9vV467iSlsgZAudHkydBG_0sku0RXzq6Yw9kpdtgH1Rf6MdX7MorO3FyZj22wTzWBAyrJ6lP2vE4qaTGeotSxVqDnQXzmKgFnxyJOgMcZerSJXhlrcS9SKJy9scm5Sp35koGihAbEByAQp6G2yxPUZiGXFFbbhabeI-b2qYq7Atze3S3P08zm0dj59RZ6TU2OaiG8x9qIRc1c9LSsJoiMqrhE-xhHTnuOXg';

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readFile(filePath: string, type: 'audio/m4a' | 'image/jpeg'): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type,
  };
}

async function createMeal(
  fileType: string,
  fileSize: number,
): Promise<IPresignDecoded> {
  console.log(`🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IPresignResponse;
  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, 'base64').toString('utf-8'),
  ) as IPresignDecoded;

  console.log('✅ Received presigned POST data');
  return decoded;
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(`📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  const blob = new Blob([fileData], { type: fileType });
  form.append('file', blob, filename);
  return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText} — ${text}`);
  }

  console.log('🎉 Upload completed successfully');
}

async function uploadFile(filePath: string, fileType: 'audio/m4a' | 'image/jpeg'): Promise<void> {
  try {
    const { data, size, type } = await readFile(filePath, fileType);
    const { url, fields } = await createMeal(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error('❌ Error during uploadFile:', err);
    throw err;
  }
}

uploadFile(
  path.resolve(__dirname, 'assets', 'refeicao.jpg'),
  'image/jpeg',
).catch(() => process.exit(1));
