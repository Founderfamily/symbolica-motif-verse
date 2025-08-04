import { AIHistoricalFigure, AIInsight } from '@/services/AIDataExtractionService';

export const getMockHistoricalFigures = (questId: string): AIHistoricalFigure[] => {
  // Pour la quête Fontainebleau - François Ier
  if (questId === 'a0434f67-6a97-4510-b8a5-6ad80375438e') {
    return [
      {
        id: 'francois-ier',
        name: 'François Ier',
        period: '1515-1547',
        role: 'Roi de France',
        relevance: 0.95,
        connections: ['fontainebleau', 'renaissance-francaise'],
        description: 'François Ier a transformé Fontainebleau en un château Renaissance majeur. Il y a fait venir des artistes italiens et créé une cour brillante.'
      },
      {
        id: 'catherine-medicis',
        name: 'Catherine de Médicis',
        period: '1519-1589',
        role: 'Reine de France',
        relevance: 0.82,
        connections: ['fontainebleau', 'florence'],
        description: 'Catherine de Médicis a contribué aux transformations artistiques de Fontainebleau et introduit des influences italiennes.'
      },
      {
        id: 'henri-ii',
        name: 'Henri II',
        period: '1519-1559',
        role: 'Roi de France',
        relevance: 0.78,
        connections: ['fontainebleau', 'diane-poitiers'],
        description: 'Henri II a poursuivi les travaux de son père à Fontainebleau et y a développé la galerie Henri II.'
      },
      {
        id: 'primatice',
        name: 'Francesco Primaticcio',
        period: '1504-1570',
        role: 'Peintre et architecte',
        relevance: 0.89,
        connections: ['ecole-fontainebleau', 'italie'],
        description: 'Primaticcio, appelé "le Primatice", est l\'un des fondateurs de l\'École de Fontainebleau avec ses fresques exceptionnelles.'
      }
    ];
  }

  return [];
};

export const getMockAIInsights = (questId: string): AIInsight[] => {
  // Pour la quête Fontainebleau - François Ier
  if (questId === 'a0434f67-6a97-4510-b8a5-6ad80375438e') {
    return [
      {
        id: 'insight-salamandre',
        type: 'discovery',
        title: 'Symbole de la salamandre identifié',
        description: 'La salamandre, emblème de François Ier, apparaît dans 7 lieux différents du château, suggérant des passages secrets liés au roi.',
        confidence: 0.92,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 jours
        relatedEntities: ['francois-ier', 'salamandre-royale']
      },
      {
        id: 'insight-galerie-francois',
        type: 'connection',
        title: 'Connexion architecturale révélée',
        description: 'Les fresques de la Galerie François Ier contiennent des références géométriques qui correspondent aux mesures des jardins secrets.',
        confidence: 0.87,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 jours
        relatedEntities: ['galerie-francois-ier', 'jardins-secrets']
      },
      {
        id: 'insight-ecole-fontainebleau',
        type: 'theory',
        title: 'Théorie de l\'École de Fontainebleau',
        description: 'Les artistes italiens auraient caché des indices dans leurs œuvres, créant un parcours initiatique pour les initiés de la cour.',
        confidence: 0.74,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 semaine
        relatedEntities: ['primatice', 'rosso-fiorentino']
      },
      {
        id: 'insight-tresor-italien',
        type: 'discovery',
        title: 'Influence des trésors italiens',
        description: 'François Ier a ramené d\'Italie des objets précieux qui auraient été cachés dans des compartiments secrets du château.',
        confidence: 0.81,
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 jours
        relatedEntities: ['tresor-italien', 'compartiments-secrets']
      },
      {
        id: 'insight-leonard-vinci',
        type: 'connection',
        title: 'Lien avec Léonard de Vinci',
        description: 'Des éléments architecturaux suggèrent que Léonard de Vinci aurait influencé certains aménagements secrets avant sa mort.',
        confidence: 0.68,
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 semaines
        relatedEntities: ['leonard-vinci', 'clos-luce']
      }
    ];
  }

  return [];
};