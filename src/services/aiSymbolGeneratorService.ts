import { MCPService, MCPSearchResponse } from './mcpService';
import { SymbolData } from '@/types/supabase';

// Enhanced prompt with a nonce/timestamp for more diversity/randomness
function buildSymbolPrompt(themeIdea: string, blacklist: string[]) {
  // Ajout d'un suffixe pour "forcer" l'IA à changer : timestamp + nombre pseudo-aléatoire
  const randomNonce = Date.now().toString() + '-' + Math.floor(Math.random() * 100000);
  return `
Tu es un expert en symbolique et en histoire des cultures. 
Génère uniquement un symbole culturel HISTORIQUE, AUTHENTIQUE et bien documenté, pour enrichir un projet éducatif (jamais un symbole inventé).

- Propose un symbole réel, jamais inventé, attesté historiquement.
- Ne propose PAS un symbole dont le nom figure dans cette liste noire (Blacklist): [${blacklist.join(", ")}]
- Évite absolument les symboles trop connus ou déjà proposés récemment (par exemple : Labrys, Triskèle, Fleur de Lys, Yin Yang, Croix, ou les symboles de la mythologie grecque très célèbre).
- Si pertinent, favorise la diversité culturelle (différents continents ou peuples) et temporelle (antique, médiéval, moderne).

Blacklist: [${blacklist.join(", ")}]

// Exception : forcer la diversité avec cette valeur unique "${randomNonce}"

Si possible, cite un exemple de source ou d’œuvre où il est attesté (${themeIdea ? "si pertinent, sur le thème : " + themeIdea : "sinon pioche dans les symboles universels."})

Formate la sortie UNIQUEMENT sous la forme d’un objet JSON conforme à :
{
  "name": "Nom réel du symbole",
  "culture": "Culture/source principale",
  "period": "Période historique",
  "description": "Description détaillée du symbole reconnu",
  "function": ["fonction1","fonction2"],
  "tags": ["tag1","tag2"],
  "medium": ["matériau1","matériau2"],
  "technique": ["technique1"],
  "significance": "Signification profonde",
  "historical_context": "Contexte historique ou anecdote (si possible, référence/rappel de l’origine ou rediffusion)"
}

IMPORTANT :
- Jamais de création ni d’invention : uniquement des symboles vérifiables et universellement connus ou documentés dans l’Histoire.
- Les tableaux ne doivent pas être vides.
- N’ajoute pas d’explications ou de commentaires hors du champ JSON.
- Pour ce prompt unique : ${randomNonce}
`;
}

// Generate suggestion for a new symbol, supporting a blacklist for diversity
export async function generateSymbolSuggestion(theme: string = '', blacklist: string[] = []): Promise<Partial<SymbolData> | null> {
  const prompt = buildSymbolPrompt(theme, blacklist);

  const res: MCPSearchResponse = await MCPService.search(prompt, 'deepseek');
  if (!res.success || !res.content) {
    throw new Error(res.error || "Erreur de génération MCP");
  }

  try {
    // Try parsing the main JSON blob
    const json = JSON.parse(res.content);
    return json;
  } catch (e) {
    // Sometimes the AI outputs code fences; try to extract the JSON
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
