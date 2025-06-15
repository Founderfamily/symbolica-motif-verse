
export type Provider = 'deepseek' | 'openai' | 'anthropic';

const providers: Provider[] = ['deepseek', 'openai', 'anthropic'];
let lastProviderIndex: number = -1;

export function getNextAIProvider(lastUsed?: Provider): Provider {
  if (lastUsed) {
    const idx = providers.indexOf(lastUsed);
    lastProviderIndex = idx >= 0 ? (idx + 1) % providers.length : 0;
  } else {
    lastProviderIndex = (lastProviderIndex + 1) % providers.length;
  }
  return providers[lastProviderIndex];
}

export function resetAIProviderRotation() {
  lastProviderIndex = -1;
}

export const providerDisplayNames: Record<Provider, string> = {
  deepseek: "DeepSeek",
  openai: "OpenAI GPT-4o",
  anthropic: "Claude 3 Haiku"
};
