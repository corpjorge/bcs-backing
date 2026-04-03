type EncryptedPayload = {
  iv: string;
  tag: string;
  data: string;
};

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

async function loadKey() {
  const encodedKey = process.env.NEXT_PUBLIC_APPENCKEY;

  if (!encodedKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_APPENCKEY environment variable for client encryption.",
    );
  }

  const keyBytes = base64ToBytes(encodedKey);

  if (keyBytes.length !== 32) {
    throw new Error(
      "Invalid NEXT_PUBLIC_APPENCKEY. It must be a base64-encoded 32-byte key.",
    );
  }

  return window.crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
}

export async function encryptClientPayload(data: unknown): Promise<EncryptedPayload> {
  const key = await loadKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128,
    },
    key,
    encodedData,
  );

  const encryptedBytes = new Uint8Array(encryptedBuffer);
  const tag = encryptedBytes.slice(encryptedBytes.length - 16);
  const cipherData = encryptedBytes.slice(0, encryptedBytes.length - 16);

  return {
    iv: bytesToBase64(iv),
    tag: bytesToBase64(tag),
    data: bytesToBase64(cipherData),
  };
}
