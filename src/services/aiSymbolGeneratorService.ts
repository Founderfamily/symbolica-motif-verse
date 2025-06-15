import { MCPService, MCPSearchResponse } from './mcpService';
import { SymbolData } from '@/types/supabase';
import { Provider } from './aiProviders';

function buildSymbolPrompt(themeIdea: string, blacklist: string[], randomConstraint: string = '') {
  // La blacklist peut devenir très longue. On ne garde que les 15 plus récents pour alléger le prompt.
  const shortBlacklist = blacklist.slice(0, 15);

  return `
Expert en symbolique et histoire de France. Génère UN symbole culturel français, historique et authentique.

Règles strictes :
- SUJET : France uniquement (métropole, régions, périodes historiques françaises). Exclus toute autre culture.
- AUTHENTICITÉ : Symbole réel et documenté, jamais inventé.
- BLACKLIST : Ne PAS générer de symbole listé ici : [${shortBlacklist.join(", ")}].
- DIVERSITÉ : Éviter les clichés (Fleur de Lys, Coq Gaulois, Tour Eiffel).
- CONTRAINTE SPÉCIFIQUE : ${randomConstraint || "Aucune. Choisir un symbole régional ou historique peu connu."}
- THÈME : ${themeIdea || "Aucun."}

Format de sortie : JSON valide et complet, sans texte extérieur.
{
  "name": "Nom du symbole",
  "culture": "Culture/région française",
  "period": "Période historique",
  "description": "Description concise du symbole.",
  "function": ["fonction1", "fonction2"],
  "tags": ["tag1", "tag2"],
  "medium": ["matériau1", "matériau2"],
  "technique": ["technique1"],
  "significance": "Signification profonde.",
  "historical_context": "Contexte historique et source si possible."
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
