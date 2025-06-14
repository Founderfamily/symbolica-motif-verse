
import { MCPService, MCPSearchResponse } from './mcpService';
import { SymbolData } from '@/types/supabase';

// Prompt template to guide DeepSeek to output all fields for a new SymbolData object
function buildSymbolPrompt(themeIdea: string) {
  // The AI is instructed to output proper JSON for SymbolData creation.
  return `
Tu es un expert en symbolique culturelle. Génère un nouveau symbole culturel pour le projet Symbol Explorer.

Propose un symbole original et complet sur le thème suivant (génère un thème si vide): "${themeIdea ? themeIdea : 'Mystère'}".

Fournis TOUTES les propriétés requises au format JSON pour cette structure :
{
  "name": "Nom du symbole",
  "culture": "Culture/source principale",
  "period": "Période historique",
  "description": "Description détaillée du symbole",
  "function": ["fonction1","fonction2"],
  "tags": ["tag1","tag2"],
  "medium": ["matériau1","matériau2"],
  "technique": ["technique1"],
  "significance": "Signification profonde",
  "historical_context": "Contexte historique détaillé"
}

Respecte le format JSON exact et écris-le sans commentaire.
Réponds uniquement avec la structure JSON ci-dessus. Les champs tableaux ne doivent pas être vides.
`;
}

// Generate suggestion for a new symbol
export async function generateSymbolSuggestion(theme: string = ''): Promise<Partial<SymbolData> | null> {
  const prompt = buildSymbolPrompt(theme);

  const res: MCPSearchResponse = await MCPService.search(prompt, 'deepseek');
  if (!res.success || !res.content) {
    throw new Error(res.error || "Erreur de génération MCP");
  }

  try {
    // Expect the AI to reply with a single JSON blob
    const json = JSON.parse(res.content);
    return json;
  } catch (e) {
    // The AI may sometimes output code fences; try to fix that
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
