import { MCPService, MCPSearchResponse } from './mcpService';
import { SymbolData } from '@/types/supabase';
import { Provider } from './aiProviders';

function buildSymbolPrompt(themeIdea: string, blacklist: string[], randomConstraint: string = '') {
  // Contrainte random additionnelle (période/culture/thème) injectée si présente
  const nonce = Date.now().toString() + '-' + Math.floor(Math.random() * 100000);
  return `
Tu es un expert en symbolique et histoire de France.
Génère uniquement un symbole culturel HISTORIQUE, AUTHENTIQUE et bien documenté, lié à la France, pour enrichir un projet éducatif.

- SUJET EXCLUSIF : Le symbole doit OBLIGATOIREMENT provenir de l'histoire de France (incluant ses régions, ses périodes historiques comme l'époque gallo-romaine, le Moyen Âge, la Renaissance, etc.). N'accepte AUCUN symbole d'une autre culture (pas de symbole celte non-gaulois, pas de symbole viking, etc.).
- Propose un symbole réel, jamais inventé, attesté historiquement en France.
- Ne propose PAS un symbole dont le nom figure dans cette liste noire (Blacklist): [${blacklist.join(", ")}]
- Évite les symboles français trop évidents ou déjà proposés récemment (ex : Fleur de Lys, Coq Gaulois, Croix de Lorraine, Tour Eiffel, Triskèle breton trop commun).
- La culture doit être une région ou un groupe culturel français (ex: "Alsace", "Gallo-romain", "Royauté française").

${randomConstraint ? `
⚠️ Pour cette fois, le symbole doit ABSOLUMENT être associé à ce contexte français spécifique : ${randomConstraint}
` : ''}

Blacklist: [${blacklist.join(", ")}]
// Exception : forcer la diversité avec cette valeur unique "${nonce}"

Si possible, cite une source ou œuvre où il est attesté (${themeIdea ? "si pertinent, sur le thème : " + themeIdea : "sinon pioche dans les symboles régionaux ou historiques peu connus."})

Formate la sortie UNIQUEMENT sous la forme d’un objet JSON conforme à :
{
  "name": "Nom réel du symbole",
  "culture": "Culture/source principale (région française, période...)",
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
- Jamais de création ni d’invention : uniquement des symboles vérifiables et documentés dans l’Histoire de France.
- Les tableaux ne doivent pas être vides.
- N’ajoute pas d’explications ou de commentaires hors du champ JSON.
- Pour ce prompt unique : ${nonce}
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
