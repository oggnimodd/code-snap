import type { ApiKeyIdentifier } from "$lib/models/api-key";
import LocalStorageManager from "./local-storage";

export const getApiKey = (identifier: ApiKeyIdentifier) => {
  return LocalStorageManager.get("apiKeys")[identifier];
};

export const getApiKeys = () => {
  return LocalStorageManager.get("apiKeys");
};

export const setApiKeys = (identifier: ApiKeyIdentifier, value: string) => {
  return LocalStorageManager.set("apiKeys", {
    ...getApiKeys(),
    [identifier]: value,
  });
};
