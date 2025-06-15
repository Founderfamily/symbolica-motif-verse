import { MCPService, MCPSearchResponse } from './mcpService';
import { SymbolData } from '@/types/supabase';
import { Provider } from './aiProviders';

function buildSymbolPrompt(themeIdea: string, blacklist: string[], randomConstraint: string = '') {
  // On garde les 8 plus récents pour un prompt très court.
  const shortBlacklist = blacklist.slice(0, 8);

  return `
Génère UN symbole historique français authentique.
SUJET: France et ses régions/cultures.
BLACKLIST: [${shortBlacklist.join(", ")}]. Ne pas générer ces symboles.
CONTRAINTE: ${randomConstraint || "Symbole régional ou historique peu connu."}
THEME: ${themeIdea || "Aucun."}
FORMAT: Réponds avec un JSON unique, sans texte autour.
{
  "name": "Nom du symbole",
  "culture": "Culture/région française",
  "period": "Période historique",
  "description": "Description concise.",
  "tags": ["tag1", "tag2"],
  "significance": "Signification.",
  "historical_context": "Contexte historique."
}
`;
}

// Nouvelle signature : provider + randomConstraint (diversité forcée)
export async function generateSymbolSuggestion(
  theme: string = '',
  blacklist: string[] = [],
  provider: Provider = 'deepseek',
  randomConstraint: string = ""
): Promise<Partial<SymbolData> | null> {
  const prompt = buildSymbolPrompt(theme, blacklist, randomConstraint);

  const res: MCPSearchResponse = await MCPService.search(prompt, provider);
  if (!res.success || !res.content) {
    throw new Error(res.error || "Erreur de génération MCP");
  }

  try {
    // Try parsing the main JSON blob
    const json = JSON.parse(res.content);
    return json;
  } catch (e) {
    const match = res.content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {
        throw new Error('Le MCP n’a pas renvoyé un JSON valide.');
      }
    }
    throw new Error('Le MCP n’a pas renvoyé un JSON valide.');
  }
}
