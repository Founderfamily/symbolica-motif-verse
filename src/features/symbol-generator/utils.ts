
import { supabase } from '@/integrations/supabase/client';

export const capitalize = (s: string) =>
  s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export const findOrCreateCollection = async (culture: string) => {
  let { data: collections, error } = await supabase
    .from('collections')
    .select(`
      id, slug, collection_translations (
        id, language, title, description
      )
    `);

  if (error) collections = [];

  if (collections && collections.length > 0) {
    const found = collections.find((c: any) => 
      c.collection_translations.some((tr: any) =>
        tr.language === 'fr' && tr.title && tr.title.toLowerCase().includes(culture.toLowerCase())
      ) ||
      (c.slug && c.slug.toLowerCase().includes(culture.toLowerCase())) ||
      c.collection_translations.some((tr: any) =>
        tr.language === 'en' && tr.title && tr.title.toLowerCase().includes(culture.toLowerCase())
      )
    );
    if (found) return found;
  }

  const slug = culture.toLowerCase().replace(/\s/g, '-').replace(/[^\w\-]+/g, '');
  const { data: newCollection, error: insertError } = await supabase
    .from('collections')
    .insert([{ slug: slug, is_featured: false }])
    .select();

  if (insertError || !newCollection?.[0]?.id) {
    throw new Error("Erreur de création de la collection : " + (insertError?.message || 'inconnue'));
  }

  await supabase.from('collection_translations').insert([
    {
      collection_id: newCollection[0].id,
      language: 'fr',
      title: capitalize(culture),
      description: `Collection automatique : symboles de la culture ${capitalize(culture)}.`,
    },
    {
      collection_id: newCollection[0].id,
      language: 'en',
      title: capitalize(culture),
      description: `Auto collection: symbols of ${capitalize(culture)} culture.`,
    },
  ]);

  return {
    id: newCollection[0].id,
    slug,
    collection_translations: [
      { language: 'fr', title: capitalize(culture) },
      { language: 'en', title: capitalize(culture) },
    ],
  };
};

