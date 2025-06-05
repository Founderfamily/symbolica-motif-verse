Audit du Système de Collections – Problèmes et Solutions Proposées
Stabilité du Système de Collections (Affichage, Catégorisation, Chargement, Collections en Vedette)
Problèmes identifiés : Le module de collections souffre de comportements instables à l’affichage et au chargement. En particulier, la logique de catégorisation des collections est fragile : elle repose sur la détection de mots-clés dans les slugs (identifiants) plutôt que sur des données structurées. Cela rend le classement imprécis et dépendant de conventions de nommage. Par exemple, la fonction useCollectionCategories filtre les collections par mots-clés dans le slug (ex : « egyptien », « grec », « médiéval », etc.) pour les classer en catégories cultures, périodes, sciences, etc.
GitHub
GitHub
. Cette approche peut entraîner des recoupements : une collection dont le slug contient plusieurs mots-clés peut apparaître dans plusieurs catégories. Par exemple, un slug "mysteres-anciens" contient à la fois "ancien" (période) et "mystere" (science/ésotérisme), la collection serait classée en Périodes et en Sciences, potentiellement dupliquée à l’écran. De plus, si les slugs ne respectent pas exactement les motifs attendus, la collection sera classée par défaut dans “Autres”
GitHub
, même si elle devrait appartenir à une catégorie existante. Ceci indique une dépendance fragile aux conventions de nommage
GitHub
. En ce qui concerne l’affichage des collections en vedette, le système utilise deux approches différentes. Sur la page d’accueil, le composant FeaturedCollections tente de charger les collections en vedette depuis l’API, mais utilise un fallback statique si aucune collection n’est disponible ou en cas d’échec silencieux
GitHub
GitHub
. Quatre collections « en dur » sont codées dans StaticCollections avec des titres/descriptions FR et EN prédéfinis
GitHub
GitHub
. Cela masque les problèmes de chargement : en cas d’erreur ou de réponse vide, l’utilisateur voit ces collections factices sans indication qu’il s’agit d’un contenu par défaut. Sur la page Collections principale, au contraire, le composant FeaturedCollectionsSection affiche simplement les collections marquées is_featured si elles existent, ou rien sinon
GitHub
GitHub
. Il n’y a pas de contenu statique de repli dans cette section. Ce comportement incohérent peut déstabiliser l’UX : l’accueil affiche toujours quelque chose (même si la source est vide), alors que la page Collections peut ne rien montrer du tout si aucune collection réelle n’est en vedette. Par ailleurs, le chargement initial des collections peut rencontrer un problème de cache React Query. Le code indique qu’au montage du composant CollectionCategories (page Collections), le cache des collections est explicitement invalidé pour forcer un rafraîchissement
GitHub
GitHub
. Ce reset forcé peut entraîner un cycle de rechargements multiples du hook useCollections, provoquant un loading prolongé ou répété (« rechargement permanent, états instables »
GitHub
). Ce symptôme se traduit potentiellement par un écran vide ou un indicateur de chargement infini si la requête se répète en boucle. Sources probables :
– Catégorisation par slug : choix d’implémentation rapide sans champ de catégorie dédié, manquant de robustesse aux variations de données
GitHub
.
– Collections en vedette statiques : stratégie de secours mise en place pour combler l’absence de données réelles, ce qui cache les erreurs de fetch au lieu de les afficher.
– Invalidation du cache au démarrage : tentative de corriger un problème de stale data en vidant le cache, mais causant un nouvel appel de données immédiat qui peut se répéter si mal contrôlé
GitHub
GitHub
. Recommandations :
Introduire un champ de catégorie explicite côté base (ou une propriété calculée côté backend) pour chaque collection, afin de cesser d’inférer la catégorie via le slug. On pourrait par exemple ajouter une colonne category (ou un tag) dans la table des collections, ou gérer des catégories via une table séparée. Le front-end n’aurait plus qu’à afficher ces catégories de manière fiable. Solution alternative à court terme : définir en configuration une liste de slugs par catégorie pour centraliser la logique, plutôt que de la disperser dans le code – cela faciliterait la maintenance si on doit garder le matching par mot-clé. Dans tous les cas, documenter clairement la convention de nommage si elle persiste, ou mieux, la remplacer par des données explicites.
Uniformiser l’affichage des collections en vedette : choisir une seule approche. Idéalement, supprimer le contenu statique codé en dur et afficher un message d’indisponibilité à la place si aucune collection en vedette n’est récupérée. Par exemple, prévoir un message type « Aucune collection vedette pour le moment » (des clés i18n existent d’ailleurs déjà, ex. collections.noFeaturedCollections en FR
GitHub
). Cela éviterait de présenter du faux contenu à l’utilisateur et permettrait de détecter réellement les problèmes de chargement. Si un fallback statique est absolument nécessaire (pour de la démo), le marquer visuellement comme suggéré (badge « exemple » ou autre) et logguer un warning pour le différencier des vraies données.
Retirer l’invalidation systématique du cache au montage de la page Collections. Il vaut mieux compter sur la configuration de staleTime de React Query pour déterminer quand actualiser les données. Si on craint que les données soient obsolètes, on peut utiliser la fonction de refetch de React Query à des moments opportuns (au retour sur la page, via un pull-to-refresh manuel, ou après certaines actions). Supprimer le queryClient.invalidateQueries({ queryKey: ['collections'] }) appelé au démarrage
GitHub
 résoudra le cycle de chargement infini. En complément, s’assurer que une seule source de vérité charge les collections : aujourd’hui useCollections et useOptimizedCollections utilisent la même clé de cache 'collections' mais avec des logiques différentes, ce qui peut causer des effets de bord (voir section hooks). Mieux vaut unifier ces hooks (voir recommandations plus bas) pour fiabiliser le comportement de chargement et le cache.
Optimiser le chargement initial : Plutôt que de charger toutes les collections dès l’entrée sur la page d’accueil juste pour en extraire 4 vedettes, envisager de filtrer côté base de données les collections vedettes. La fonction collectionsService.getFeaturedCollections le fait déjà (requête avec .eq('is_featured', true) et limite à 4
GitHub
). Utiliser exclusivement cette voie pour l’accueil permettrait de ne pas rapatrier inutilement 100% des collections. Ensuite, sur la page Collections complète, on chargera la liste complète via useCollections. Cette séparation clarifiera le cycle de vie des données et allégera possiblement le temps de chargement initial sur la home. (En l’état actuel, FeaturedCollections utilise useFeaturedCollections – ce qui est bien – mais le composant CollectionGrid ou d’autres utilisent useCollections et filtrent côté client, ce qui double potentiellement les appels. Il faudra veiller à n’utiliser qu’un seul hook selon le contexte approprié).
Erreurs de Structure dues à l’Implémentation Instable (notamment autour des Traductions)
Problèmes identifiés : L’organisation actuelle des données de traduction et leur exploitation manquent de cohérence, ce qui introduit des bugs structurels. D’une part, la structure des objets retournés par l’API Supabase pour les collections n’est pas pleinement maîtrisée dans le code client. Par exemple, on attend que collection.collection_translations soit toujours un tableau de traductions, mais ce n’est pas toujours garanti sans transformation. Le service a dû ajouter une transformation sécurisée pour forcer ce champ en tableau même s’il est vide ou indéfini
GitHub
. Ceci suggère que l’implémentation initiale autour des traductions manquait de robustesse et a nécessité des corrections. D’autre part, plusieurs composants du front manipulant les traductions ne sont pas alignés. On trouve des duplications de logique de traduction : un utilitaire central useCollectionTranslations existe avec une gestion sophistiquée des cas manquants, mais certaines parties du code ne l’utilisent pas. Par exemple, le composant FeaturedCollections implémente son propre callback getTranslation simplifié (ne gérant que la langue courante et un fallback direct à l’autre langue)
GitHub
GitHub
. De même, la page d’administration CollectionsManagement définit une fonction locale getTranslation(collection, language, field) qui renvoie la traduction dans la langue demandée ou une chaîne vide
GitHub
, ignorant les fallbacks plus élaborés. Ces incohérences peuvent conduire à des comportements différents selon l’endroit : sur la page détail et les cartes de collection standards, un titre manquant sera remplacé par le slug formaté ou affichera "[title missing]"
GitHub
GitHub
, alors que sur la home en vedette il apparaîtra vide (chaîne ''). Cela complexifie le debugging et peut donner un rendu vide ou mal formaté dans certains cas. En outre, le schéma de données attendu côté client pour les traductions n’est pas toujours respecté ou bien communiqué. Le hook useCollectionTranslations s’attend à une structure contenant toutes les langues (ici fr et en) dans collection_translations. Or si une collection n’a qu’une traduction (hypothétiquement), ou qu’une langue manque, la logique de fallback doit compenser. Le code le fait en partie, mais la présence de placeholders comme [title missing] et l’utilisation du slug comme dernier recours
GitHub
GitHub
 indiquent que l’application rencontre des cas où les données de traduction ne sont pas complètes. Ceci est possiblement dû à l’implémentation côté création de collection : lors de createCollection, on crée systématiquement deux entrées de traduction (fr et en) d’après les données fournies
GitHub
GitHub
. Si pour une raison quelconque cette double création échoue partiellement (ex : une seule langue insérée), ou si l’utilisateur n’a saisi qu’une langue dans le formulaire (selon comment CreateCollectionDialog fonctionne), on pourrait se retrouver avec une structure bancale. Ce genre d’incohérence structurelle se répercuterait par des erreurs silencieuses (champs vides) ou des placeholders à l’écran. Sources probables :
– Manque d’uniformité dans l’utilisation des outils de traduction : des composants isolés ont reproduit leur propre logique au lieu d’utiliser le hook commun, résultant en des divergences de comportement
GitHub
GitHub
.
– Processus de création/mise à jour non transactionnel : la création de collection insère d’abord la collection, puis les traductions et symboles
GitHub
GitHub
. En cas d’erreur en cours de route, on pourrait avoir une collection sans traductions, ce qui n’est pas géré autrement que par les fallbacks front-end. De plus, l’absence de rollback en cas d’échec d’insertion des traductions laisse potentiellement des données orphelines.
– Structure i18n non harmonisée entre langues (voir section dédiée au fallback i18n). Des clés présentes en français peuvent manquer en anglais, créant des retours au fallback silencieux (français par défaut). Par exemple, le fichier français collections.json contient de nombreuses entrées organisées en sous-objets (featured.title, featured.description, etc.)
GitHub
, alors que la version anglaise équivalente n’a pas exactement la même structure (certaines traductions de collections sont ailleurs, et des clés comme featured.title n’y figurent pas) – ce qui peut provoquer des clés non trouvées en anglais. Ces déséquilibres structurels obligent le code à compenser via des fallback, source de confusion. Recommandations :
Centraliser la logique de traduction des collections : Imposer l’utilisation du hook useCollectionTranslations partout où l’on affiche titre/description de collection. Cela implique de supprimer les fonctions ad-hoc comme getTranslation dans FeaturedCollections et dans l’admin, au profit du hook commun. On pourra éventuellement enrichir useCollectionTranslations pour couvrir des besoins spécifiques, mais au moins la logique de base (choix de la langue, fallback langue alternative, usage du slug si tout manque) sera unique. Cette unification garantira que toute absence de traduction sera gérée de manière cohérente à travers l’application.
Améliorer la complétion des données de traduction : Côté backend ou service, s’assurer qu’une collection est toujours créée avec ses deux traductions. Si l’UI de création permet de n’entrer qu’une langue à la fois, il faut soit forcer la saisie des deux, soit générer une entrée vide pour l’autre langue. Sans cela, on délègue au front le soin de combler le manque, ce qui n’est pas idéal. Idéalement, rendre la création transactionnelle via un RPC ou une fonction stockée Supabase pour éviter l’état mi-créé (collection sans traductions). Si cela n’est pas possible, au moins capter l’erreur et supprimer la collection incomplète en cas d’échec d’insertion des traductions.
Supprimer les placeholders [title missing] en production : Ces chaînes de debug ne devraient pas apparaître à l’utilisateur final. Après avoir fiabilisé la présence des données, on pourra soit enlever ces libellés, soit les remplacer par un message plus explicite dans la langue courante, par exemple « Titre manquant ». Mais dans l’idéal, si les recommandations ci-dessus sont suivies, on ne devrait plus jamais manquer à la fois de traduction FR et EN pour un titre. Ce code pourra alors être simplifié pour ne plus retourner de placeholder du tout (et retourner le slug uniquement).
Aligner la structure des données de traduction attendue : Si possible, adapter la requête Supabase dans getCollections pour retourner toujours les deux traductions même si l’une est vide. Aujourd’hui, la requête sélectionne simplement la table collection_translations liée
GitHub
. Une amélioration serait de faire une jointure externe vers une table des langues pour garantir la présence de chaque langue. Sinon, le front peut compenser en créant, lors du mapping, les entrées manquantes (par exemple : « s’il manque la traduction EN, insérer un objet vide pour EN »). Cela éviterait d’avoir à tester partout l’existence de la traduction.
Composants React Principaux et Leur Interconnexion
Problèmes identifiés : L’architecture des composants relatifs aux collections présente des duplications et incohérences qui nuisent à la maintenabilité. On observe notamment plusieurs composants qui remplissent un rôle similaire : CollectionGrid, FeaturedCollectionsGrid, AdaptiveGrid, et même des variantes de carte comme CollectionCard vs OptimizedCollectionCard. Cette prolifération signifie un code dupliqué et un risque de divergence. Par exemple, CollectionGrid affiche toutes les collections (ou filtrées) en grille standard en utilisant useCollections
GitHub
GitHub
, alors que FeaturedCollectionsGrid affiche uniquement les vedettes via useFeaturedCollections
GitHub
GitHub
. Leurs implémentations de gestion du chargement/erreur diffèrent légèrement (gestion d’erreur explicite dans l’un, implicite dans l’autre). De plus, CollectionCategories utilise encore un autre système : CategoryGrid qui appelle AdaptiveGrid pour une grille paginée/ajustable avec animations, et qui lui-même repose sur OptimizedCollectionCard
GitHub
GitHub
. Cette multiplicité conduit à une complexité inutile : il faut maintenir plusieurs versions de quasi la même fonctionnalité, avec un risque élevé d’incohérence (les corrections dans l’un ne sont pas reportées dans l’autre). Le document d’architecture note cette duplication de composants comme un problème majeur
GitHub
. Par ailleurs, la gestion des erreurs n’est pas centralisée. On a un composant CollectionErrorBoundary spécifique pour la page Collections
GitHub
, des composants CollectionErrorState ou EnhancedErrorState utilisés à certains endroits, et plusieurs ErrorBoundary dans la page d’accueil englobant chaque section (Hero, QuickAccess, FeaturedCollections, etc.)
GitHub
GitHub
. Cette redondance dans la capture d’erreur peut conduire à des comportements imprévisibles : par exemple, une erreur dans la section Collections de la home déclenchera l’erreur boundary locale de FeaturedCollections qui renvoie un contenu d’erreur minimal
GitHub
GitHub
, alors qu’une erreur sur la page /collections pourrait afficher un écran d’erreur stylisé différent via CollectionErrorBoundary
GitHub
GitHub
. De plus, certaines erreurs sont traitées silencieusement sans atteindre ces boundaries (ex : erreurs de fetch attrapées et converties en données vides, voir plus haut). L’ensemble du système de gestion d’erreur est donc incohérent
GitHub
 et peut laisser l’utilisateur face à une page blanche ou un comportement figé sans message clair, si l’erreur n’est ni correctement propagée ni uniformément affichée. Enfin, des composants sont trop volumineux ou mal découpés, rendant leur compréhension difficile. FeaturedCollections.tsx fait plus de 220 lignes
GitHub
, mélangeant logique de fetch, fallback statique, rendering… ce qui complique son évolution. Idem pour le service collectionsService.ts (~300 lignes) qui combine accès base, logique métier (ex: updateTranslations), et pourrait être subdivisé (par ex. un module API + un module cache). L’interconnexion entre composants est parfois peu claire – e.g., la page Collections intègre un composant CollectionStatsDisplay que l’on devine afficher le nombre de collections ou symboles, mais sa mise à jour dépend de passer correctement la prop collections
GitHub
, ce qui pourrait être fait directement via un hook global. Sources probables :
– Volonté d’améliorer les performances (d’où OptimizedCollectionCard, AdaptiveGrid avec pagination, etc.) mais implémentée de manière ad hoc sans refonte globale, menant à des couches parallèles plutôt que remplacées.
– Évolution fonctionnelle rapide sans refactoring : de nouveaux besoins (affichage paginé, animations, etc.) ont été ajoutés via de nouveaux composants au lieu de généraliser l’existant, entraînant duplication.
– Gestion d’erreur ajoutée après-coup en divers endroits (boundaries multiples) sans stratégie unifiée, d’où des doublons et conflits de comportement en cas d’erreur.
– Taille importante de certains fichiers signalant un manque de séparation des préoccupations (par ex. mélange de logique de données et de présentation dans FeaturedCollections). Recommandations :
Fusionner et factoriser les composants de grille de collections : Il est conseillé de n’avoir qu’un seul composant de grille réutilisable pour afficher une liste de collections, avec des props pour les variantes (par ex. mode="all"|"featured"|..., ou simplement passer la liste filtrée en prop). Par exemple, on pourrait combiner CollectionGrid et FeaturedCollectionsGrid en un seul composant générique CollectionGrid qui accepte éventuellement une prop collections (si déjà filtrées) ou un booléen featuredOnly. D’ailleurs, le composant existant CollectionGrid a déjà un paramètre featuredOnly et limit qui couvre ces besoins
GitHub
GitHub
. Il suffirait de l’utiliser partout, au besoin en lui passant la bonne liste. Le composant FeaturedCollectionsSection sur la page collections pourrait alors réutiliser CollectionGrid (en ne passant que les collections vedettes) au lieu d’avoir sa propre map. De même, pour les cartes individuelles, il n’est probablement pas nécessaire de garder deux versions (CollectionCard vs OptimizedCollectionCard). On peut appliquer les optimisations simples (memoization) directement dans CollectionCard si besoin. La version optimisée utilise un useMemo pour calculer texte et description
GitHub
, mais on peut considérer que getTranslation est déjà optimisé (via useCallback) et que React.memo sur le composant suffit dans la plupart des cas. Simplifier à un seul composant Card réduit le risque d’en diverger (actuellement, si on modifie la structure d’interface d’une collection, il faut ajuster deux composants de carte).
Clarifier la distinction entre affichage simple et affichage avancé : Si AdaptiveGrid (avec pagination & animations) est un plus pour l’UX, on peut l’adopter comme unique grille pour toutes les collections sur la page principale. Sinon, si c’est expérimental, on peut le retirer au profit d’une grille CSS simple (surtout si le nombre de collections reste modéré – d’après la base, ~20 collections
GitHub
). Décider d’une seule approche (pagination ou non, animations ou non) et s’y tenir. En cas de grand nombre d’éléments, on pourra plutôt se tourner vers la virtualisation (ex: react-window) comme optimisation plus standard, au lieu d’un système maison de pagination par swipe.
Refactorer les composants trop longs en sous-composants : Pour FeaturedCollections.tsx par exemple, on pourrait séparer la logique de fallback statique, l’en-tête de section, et la liste de cartes en sous-composants plus petits (d’une certaine manière, ça a été amorcé avec StaticCollections et DynamicCollections internes
GitHub
GitHub
, mais on peut aller plus loin en les plaçant dans des fichiers séparés si réutilisables). Un refactoring suggéré dans la documentation est justement de diviser ce composant en morceaux plus maintenables
GitHub
GitHub
. Pareil pour le service : scinder collectionsService.ts en plusieurs modules (par ex: collectionsApi.ts pour les appels supabase bruts, collectionsRepo.ts pour la logique cache/localStorage, etc.). Ce découpage améliorerait la lisibilité et faciliterait les tests unitaires de chaque partie.
Centraliser la gestion des erreurs : Il vaut mieux définir une stratégie unique pour présenter les erreurs liées aux collections. Par exemple, créer un composant CollectionsErrorFallback commun, utilisé tant dans CollectionErrorBoundary que dans les états d’erreur explicites (comme CollectionErrorState). On pourrait ainsi harmoniser le message et les options de relance. En outre, éliminer les multiples ErrorBoundary imbriqués sur la page d’accueil : un seul boundary global autour de l’application (ou du layout principal) pourrait suffire pour capter les exceptions non gérées, plutôt que un par section, à moins que certaines sections ne puissent se recharger indépendamment. Étant donné que la plupart des erreurs de données sont déjà gérées plus bas (via les états de chargement/erreur des hooks), ces boundaries servent surtout aux erreurs JS imprévues. Une approche : supprimer CollectionErrorBoundary spécifique et utiliser le boundary global (déjà défini via ErrorBoundary commun dans HomePage pour chaque section
GitHub
GitHub
). S’il faut garder un boundary par grande page, s’assurer qu’il affiche un message user-friendly en cas de crash et un bouton de reload. On veillera aussi à ce que les erreurs de données ne soient pas confondues avec des erreurs JS : actuellement, un échec de fetch collections retourne un tableau vide et n’active aucun boundary (voir sections précédentes), ce qui est bien. Par contre une erreur non attrapée sera gérée par le boundary – on doit donc tester que tous les cas de figure sont couverts pour éviter l’« écran blanc ».
Logique des Hooks (useCollections, useCollectionCategories, useCollectionTranslations, etc.)
Problèmes identifiés : Les hooks personnalisés liés aux collections présentent des logiques redondantes ou conflictuelles. Nous avons déjà évoqué l’incohérence d’utilisation de useCollectionTranslations. Deux autres hooks méritent attention : useCollections vs useOptimizedCollections d’une part, et useCollectionCategories d’autre part.
Conflit useCollections / useOptimizedCollections : Ce sont deux hooks qui, en théorie, récupèrent la même donnée (liste des collections) mais avec des approches différentes. useCollections est un usage standard de React Query qui fetch la liste complète et la met en cache
GitHub
. useOptimizedCollections tente d’améliorer cela en ajoutant un cache localStorage persistant et en évitant de retourner un tableau vide pendant le chargement initial
GitHub
GitHub
. Il précharge aussi les collections en vedette en parallèle
GitHub
. Toutefois, la coexistence des deux dans le code crée de la confusion. Le document note « Structure de données incohérente – useOptimizedCollections vs useCollections » comme un problème
GitHub
, avec différentes logiques de cache et fallback menant à des états de loading/erreur contradictoires. En effet, useOptimizedCollections utilise la même clé de cache ['collections'] que useCollections
GitHub
, mais retourne potentiellement undefined quand isLoading est true (au lieu de []), et pioche dans localStorage en cas d’erreur pour renvoyer d’anciennes données
GitHub
GitHub
. Si la page Collections utilisait useOptimizedCollections tandis que d’autres parties utilisent useCollections, on pourrait avoir des traitements différents d’une même ressource. Dans la version actuelle du code, CollectionsPage.tsx importe useCollections
GitHub
 (pas l’optimisé), donc peut-être que useOptimizedCollections n’est plus réellement utilisé – ce qui rend sa présence source de confusion. S’il est utilisé ailleurs (non repéré dans notre lecture), cela double potentiellement les appels Supabase ou crée un faux sentiment de “cache local”, alors que useCollections a déjà son propre cache en mémoire via React Query.
Hook useCollectionCategories : Ce hook implémente la logique de catégorisation basée sur les slugs dont nous avons parlé. Il retourne simplement les listes filtrées (featured, cultures, etc.)
GitHub
GitHub
. Outre la fragilité de la méthode (voir plus haut), on note qu’il utilise des logs console pour chaque calcul (tags “🏷️ Categorizing collections”…)
GitHub
, signe qu’il était en débogage actif. Ce hook recalcule à chaque changement de la liste (ce qui est correct via useMemo), mais il n’exclut pas explicitement les doublons entre catégories (il exclut seulement les featured des “others”
GitHub
). Cela rejoint la nécessité de revoir la catégorisation plus en profondeur.
Autres hooks : useCollectionTranslations a été détaillé – il est assez robuste mais produit des placeholders moches en dernier ressort. useCreateCollection et useUpdateCollection invalident correctement les caches
GitHub
GitHub
, sauf qu’ils invalident toutes les collections en vedette et listes, même si l’update ne concernait qu’un champ de traduction par exemple, ce qui n’est pas grave mais pourrait être affiné. Le hook useDeleteCollection (non montré ici) probablement suit le même schéma. Rien de majeur là, si ce n’est l’absence de consolidation entre ces hooks et un usage optionnel de useOptimizedCollections qui pourrait laisser un cache localStorage obsolète (puisqu’on invalide le cache React Query en mémoire, mais pas forcément le localStorage stocké par l’ancien hook, si utilisé).
Sources probables :
– Développement itératif où useOptimizedCollections a été introduit pour pallier un problème (peut-être temps de chargement perçu, ou support offline) sans remplacer complètement l’ancien hook. Ceci a mené à une duplication non résolue.
– Manque de nettoyage du code “expérimental” : le code de cache localStorage et de logs consoles aurait dû être soit validé et intégré partout, soit retiré.
– Méthodologie de catégorisation non figée, avec un hook dédié non aligné sur une future éventuelle catégorisation serveur. Recommandations :
Choisir un seul hook pour charger les collections : Fusionner useOptimizedCollections avec useCollections ou abandonner l’approche optimisée si elle n’apporte pas de bénéfice significatif. Vu la faible taille actuelle des données (20+ collections), la complexité supplémentaire (cache localStorage, etc.) n’est peut-être pas justifiée. React Query avec un staleTime raisonnable (ici 10 minutes) fait déjà du bon travail de cache mémoire. Si on tient au cache persistant (pour un mode offline par ex.), il serait plus propre d’utiliser un persistant cache de React Query (il existe un plugin pour stocker le cache dans localStorage entre sessions). Cela éviterait de coder manuellement cette logique et de risquer des incohérences. Donc : soit on supprime complètement useOptimizedCollections et on utilise useCollections partout, soit on l’adopte partout et on supprime useCollections. Étant donné la doc TODO qui préconise d’unifier ces hooks
GitHub
, la première solution (simplicité) semble adéquate pour le moment.
Nettoyer les logs et caches locaux : Si on retire l’optimisation custom, supprimer les console.log de debug qui polluent le code (ex: dans useOptimizedCollections
GitHub
GitHub
, et useCollectionCategories
GitHub
). De même, gérer la suppression du localStorage cache s’il n’est plus utilisé (éventuellement via un migration script ou simplement laisser expirer – le code ne le relira plus de toute façon une fois le hook enlevé).
Améliorer useCollectionCategories ou migrer la logique côté serveur : Comme évoqué, le mieux serait de déléguer la catégorisation au serveur ou d’ajouter un attribut de catégorie. En attendant, on peut au moins sécuriser ce hook en documentant clairement les catégories et en éliminant les recouvrements. Par exemple, ajouter dans le filtre sciences une condition excluant les éléments déjà classés en cultures ou périodes pour éviter doubles comptages (ce qui n’est pas fait actuellement hors “others”). Ou plus simple : transformer la sortie en un objet de Set (ou utiliser un ID set) pour s’assurer qu’une collection n’apparaît qu’une fois. Cependant cela ne règle pas le fond du problème (classement instable). Donc cette recommandation va de pair avec celle de la section stabilité : revoir le système de catégories globalement.
Tester le flux complet de suppression/mise à jour : Vérifier que les hooks de mutation (useDeleteCollection, etc.) invalident bien tous les caches nécessaires. Par exemple, si on utilise un cache persistant (optimisé), il faudra ajouter l’invalidation du localStorage ou en tout cas re-synchroniser. De plus, après suppression d’une collection, useCollections renvoie la liste à jour (il y a bien un invalidate du cache collections
GitHub
GitHub
). Veiller à ce que useCollectionCategories recalcule proprement (il le fera car la prop collections changera). Un point d’attention : la mutation handleToggleStatus dans l’admin modifie directement supabase puis fait refetch()
GitHub
GitHub
 au lieu d’utiliser useUpdateCollection. C’est acceptable, mais on pourrait l’aligner en utilisant le hook de mutation existant, pour que tout passe par la même voie (ce qui garantirait l’invalidation centralisée).
Système de Fallback de Traduction (Structure i18n, Comportements Silencieux, Erreurs Possibles)
Problèmes identifiés : Le système i18n présente plusieurs faiblesses qui impactent la fiabilité des traductions à l’écran. D’abord, la structure des fichiers de traduction est incohérente entre le français et l’anglais. Le fichier français est très détaillé (fr/collections.json contient de nombreuses clés imbriquées
GitHub
GitHub
), alors que côté anglais, les traductions des collections sont éparpillées (certaines dans en/sections.json pour la page d’accueil
GitHub
, d’autres dans un fichier en/collections.json plus sommaire
GitHub
). Concrètement, cela signifie que la clé collections.featured.title utilisée dans le code
GitHub
 existe en français (« Collections en Vedette »
GitHub
) mais en anglais la structure différente fait que la clé recherchée peut ne pas être trouvée telle quelle dans l’objet de traduction. Si la clé manque, i18next va appliquer un fallback silencieux : la configuration indique fallbackLng: 'fr'
GitHub
, donc une clé manquante en anglais sera cherchée en français. Ainsi, un utilisateur en anglais pourrait voir du texte français apparaître là où la traduction anglaise n’a pas été définie – sans aucun message d’erreur, ce qui peut passer inaperçu en dev si on ne teste pas la langue EN à fond. Par exemple, si collections.noCollectionsMessage est absent du JSON anglais (ce qui semble être le cas vu que le snippet anglais ne le montre pas
GitHub
), alors en mode anglais l’application affichera la phrase française « Les collections seront bientôt disponibles… » par défaut, potentiellement non détecté comme bug car c’est “grâce” au fallback. Ce comportement silencieux masque les erreurs de complétion des fichiers de langue. Ensuite, la config i18n utilise returnNull: false et returnEmptyString: false
GitHub
, ce qui veut dire que si une clé est manquante, i18next ne renverra ni null ni "" mais à la place tentera le handler parseMissingKeyHandler. Ce handler est défini pour retourner une version humanisée de la clé
GitHub
. Par exemple, s’il manque la clé collections.symbolsCount, i18next pourrait retourner “Symbols count” ou “SymbolsCount” (selon la casse) au lieu de rien. Là encore, c’est pratique pour éviter des trous à l’écran, mais ça cache le problème : on risque d’afficher des libellés bizarres non traduits sans s’en rendre compte (puisque aucune alerte n’est levée). Ce mécanisme est utile en dev mais en prod il vaudrait mieux savoir qu’une clé est manquante et fournir un fallback contrôlé. En résumé, le fallback de traduction actuel est double : i18next renvoie la langue française par défaut pour toute clé manquante en anglais, et si vraiment aucune langue ne l’a, fabrique un texte d’appoint. Ajoutez à cela le fallback au niveau du code (slug à la place du titre manquant) – on a plusieurs couches de secours. Cela peut conduire à de la confusion lors de l’ajout de nouvelles fonctionnalités : on pourrait croire qu’une traduction est présente en anglais parce que l’UI affiche quelque chose (en réalité le fallback fr), jusqu’à ce qu’un utilisateur anglophone signale voir du français. Sources probables :
– Séparation incomplète des fichiers de traduction lors d’une refonte : on voit que pour le français, le fichier a été morcelé (app, hero, sections…) mais aussi combiné avec un ancien fr.json global
GitHub
GitHub
. Pour l’anglais, seuls quelques fichiers existent et le reste n’a pas été intégré (pas d’équivalent de frTranslationRemaining pour en). Cela peut être dû à un travail non fini de traduction, laissant l’anglais partiel.
– Valeur par défaut de fallbackLng à ‘fr’ parce que la majorité du contenu est en français (langue principale du projet). On a préféré ne pas afficher d’anglais du tout en fallback, ce qui est un choix mais rend l’interface incohérente en anglais.
– parseMissingKeyHandler mis en place pour générer du texte lisible aux clés manquantes (peut-être pour éviter d’avoir des choses du type “collections.symbolsCount” brut à l’écran en cas d’oubli). C’est pratique en dev mais en production, cela empêche de détecter visuellement les absences de traduction. Recommandations :
Harmoniser les fichiers de localisation : Il est impératif de synchroniser les clés disponibles en anglais et en français. Chaque clé utilisée dans le code devrait exister dans les deux locales (même si c’est avec une traduction provisoire). Ici, il faudrait compléter le fichier en/collections.json avec toutes les entrées présentes dans fr/collections.json
GitHub
GitHub
. Par exemple, ajouter en anglais les champs manquants comme noCollections, noCollectionsMessage, featured.title, etc., avec une traduction appropriée (ou au pire une copie de la phrase française en anglais pour ne pas laisser de trou). Un outil de validation de complétude des traductions existe peut-être déjà (il y a des scripts check-keys.js dans le dépôt) – il convient de l’exécuter et de corriger toutes les différences.
Revoir la configuration de fallbackLng : Si l’on vise une expérience anglophone correcte, envisager de mettre fallbackLng: 'en' au lieu de 'fr'. Actuellement, on tombe en français par défaut, ce qui n’est pas idéal pour les anglophones. Mieux, on peut définir un tableau de fallback ['en','fr'] ou inversement selon la stratégie. L’idée serait que si la langue choisie est indisponible, on utilise l’autre, mais qu’on détecte ces occurrences (en dev). On peut pour cela activer le mode debug d’i18next (déjà conditionné à NODE_ENV dev
GitHub
) pour voir dans la console quels clés manquent. En production, on peut laisser fallback sur l’autre langue pour ne pas bloquer l’UI, mais en phase de recette, il faut traquer toutes les clés manquantes.
Désactiver parseMissingKeyHandler en production : Ce handler est utile en développement pour repérer vite fait une clé oubliée (il affiche une version “human-readable”). Mais en production, il vaudrait mieux le désactiver ou le surcharger pour, par exemple, renvoyer une chaîne vide ou un texte du genre “[Traduction manquante]” visible. Actuellement, il retourne le dernier segment de la clé en séparant par les majuscules
GitHub
 – ce qui peut aboutir à afficher par exemple “Featured Badge” si featuredBadge manquait. L’utilisateur pourrait ne pas réaliser que c’est un bug. Il serait plus sain d’avoir un indicateur clair de clé manquante (au moins en dev). Donc recommandation : mettre parseMissingKeyHandler: undefined en prod, ou bien le configurer pour loguer une erreur.
Capitaliser sur i18next pour les fallbacks plutôt que le code custom : Le hook useCollectionTranslations fait un fallback manuel (fr <-> en, puis slug)
GitHub
GitHub
. Si on garantit que les données contiennent toujours les deux langues, ce fallback pourrait être simplifié. On pourrait aussi envisager d’utiliser i18next pour traduire les titres/descriptions statiques des collections plutôt que de dépendre des données Supabase pour l’autre langue. Par exemple, enregistrer côté Supabase uniquement le contenu source (français) et laisser i18next traduire via son catalogue en anglais… Mais cela supposerait de centraliser toutes les traductions de contenu, ce qui n’est pas le cas ici (on veut que le contenu soit aussi traduit par les utilisateurs). Donc cette idée n’est pas applicable aux textes des collections car ils sont propres à chaque collection. Néanmoins, pour les textes de l’UI (titres de section, boutons…), il faut absolument utiliser i18next plutôt que de coder des fallback. Le composant <I18nText> est utilisé à plusieurs endroits pour rendre du texte avec fallback enfants
GitHub
GitHub
 – il faut vérifier que partout les clés passées existent bien dans les fichiers de langue.
Test en conditions réelles bilingues : Après avoir appliqué tout ça, bien tester l’application en anglais pour s’assurer qu’aucun texte français n’apparaît. Par exemple, vérifier que “No collections available” et “Collections will be available soon. Come back later!” s’affichent bien en anglais sur la page collection à vide (actuellement ces chaînes sont prévues dans en/collections.json
GitHub
 et utilisées dans le code
GitHub
). De même, s’assurer que les badges “Featured” s’affichent en anglais (le code utilise <I18nText translationKey="collections.featuredBadge">Featured</I18nText>
GitHub
 – donc si la clé existe en anglais, on verra “Featured”, sinon on verra la valeur fallback “Featured” fournie en children ou possiblement la version française “En vedette” si fallbackLng jouait). Ces détails linguistiques font partie de la qualité du produit et ne doivent plus être laissés au hasard.
Comportement au Chargement (Page Blanche, Chargement Infini, Absence d’Erreur Visible)
Problèmes identifiés : Lors du chargement des pages liées aux collections, l’utilisateur peut rencontrer soit une page blanche, soit un spinner infini, sans indication claire d’erreur en cas de problème. Plusieurs causes déjà abordées expliquent cela :
Le cycle de rechargement permanent dû à l’invalidation initiale du cache (mentionné dans la partie stabilité) pouvait aboutir à une page qui ne se stabilise jamais (toujours en état loading). L’utilisateur ne voit alors que le squelette ou rien du tout, sans fin. C’est un cas de chargement infini causé par la logique de cache mal placée
GitHub
.
L’absence de remontée d’erreur du fetch Supabase : comme vu, les appels API attrapent les erreurs et retournent des valeurs par défaut ([] ou null), si bien que même en cas d’échec réseau ou base, l’UI ne reçoit pas de signal d’erreur. Par exemple, si la connexion à Supabase échoue, getCollections() catch l’erreur et retourne []
GitHub
GitHub
. Le hook useCollections considère donc que la requête a “réussi” (pas d’exception) mais que la liste est vide. L’UI affichera alors “Aucune collection disponible”
GitHub
 au lieu d’un message d’erreur type “Impossible de charger les collections”. De même, sur la home en vedette, un échec renvoie tableau vide, donc le composant FeaturedCollections va basculer sur le fallback statique, dissimulant complètement l’erreur (l’utilisateur voit du contenu factice sans savoir que le chargement réel a raté). C’est ce qu’on entend par erreur silencieuse. L’absence d’erreur visible est problématique, car en production on risque de ne pas détecter immédiatement un problème de backend – l’appli se contentant d’afficher un état vide ou des valeurs par défaut.
Le cas de la page blanche totale pourrait survenir s’il y a une erreur JS non attrapée dans le cycle de rendu (par exemple, accès à une propriété indéfinie quelque part). Normalement, les ErrorBoundaries mis en place devraient empêcher un crash complet en affichant un fallback. Mais si ces boundaries sont mal placés ou s’il y a une erreur en dehors de leur portée (ex: erreur lors du rendu du Layout principal, ou dans le code i18n d’init), on peut avoir un écran blanc sans message. Par ailleurs, trop compter sur les boundaries sans traiter les erreurs de données peut mener à ne jamais afficher de message d’erreur utilisateur. Actuellement, la page Collections a un boundary (CollectionErrorBoundary) qui affiche un message “Une erreur est survenue…” avec un bouton Retry
GitHub
GitHub
, mais il n’est utile que si une erreur JS se produit dans le sous-arbre. Or la plupart du temps, en cas d’erreur de chargement, le code la transforme en état non erreur (comme dit plus haut). Ce boundary est donc rarement déclenché.
En résumé, l’utilisateur n’est pas assez informé en cas de problème de chargement : soit il attend indéfiniment, soit il voit du contenu vide ou de remplacement, ce qui peut prêter à confusion au lieu d’un message d’erreur franc. Sources probables :
– Politique de design voulant éviter d’afficher des erreurs système à l’utilisateur, d’où le choix de fallbacks silencieux. Cependant, cela réduit la transparence et rend le support plus difficile (on affiche “Aucune collection” alors que le vrai problème est “Requête échouée”).
– Multiplication des systèmes de fallback (cache local, contenu statique) qui fait qu’en cas de pépin tout de même on masque le symptôme.
– Pas de mécanisme global de suivi de chargement : chaque section gère son spinner. S’il y avait une erreur globale (ex: serveur down), l’appli n’a pas de bannière ou d’indicateur global de perte de connexion. Recommandations :
Signaler les erreurs de chargement aux utilisateurs de manière appropriée : Lorsque la récupération des données échoue, on devrait idéalement informer l’utilisateur plutôt que de faire comme si de rien. Par exemple, sur la section Collections en vedette de la home, si l’API renvoie une erreur, on pourrait afficher un message du style “Impossible de charger les collections en vedette” au lieu de basculer immédiatement sur du contenu statique non signalé. D’ailleurs le code contient un message d’erreur dans le JSX pour ce composant
GitHub
GitHub
, mais il n’est rendu que si error est truthy – ce qui n’arrive jamais car l’erreur est attrapée plus haut. Il faudrait donc faire remonter l’erreur : par exemple, modifier getFeaturedCollections() pour qu’il ne catch pas l’erreur mais la laisse sortir (ou qu’il mette une propriété spéciale dans le résultat). Avec React Query, on peut retourner une erreur au lieu d’une donnée vide, ce qui activerait error et rendrait ce message visible. Même approche pour useCollections: en cas d’erreur Supabase, soit throw l’erreur pour que useQuery la détecte (et alors dans CollectionCategories on tomberait dans le cas error et on afficherait l’état d’erreur amélioré existant
GitHub
). Ce changement doit s’accompagner de la suppression du fallback silencieux statique sur la home, ou de son déclenchement uniquement quand il s’agit vraiment d’absence de collections et non d’une erreur. Par exemple, on peut distinguer error et no data et gérer les deux cas différemment.
Timeout/Retry UI : Si on craint que certaines requêtes soient longues, on peut implémenter un timeout au-delà duquel on considère que ça a échoué (React Query gère déjà des retry automatiques
GitHub
). On pourrait afficher un bouton “Réessayer” (déjà présent dans CollectionErrorBoundary et EnhancedErrorState) plus visiblement. L’important est de ne pas laisser l’utilisateur attendre sans fin. Actuellement, si Supabase ne répond pas mais ne renvoie pas d’erreur franche, le spinner pourrait tourner longtemps. Un moyen de parer à ça est de surveiller la durée de chargement et afficher une option de rechargement si c’est anormalement long (par ex > 10s).
Retirer ou adapter les fallback de dernier recours en production : comme mentionné, les placeholders ou fallback i18n masquent les problèmes. En phase de prod, on pourrait décider qu’une clé manquante affiche soit rien soit un message generique, mais dans tous les cas on devrait monitorer ces incidents. Avoir un système de logs centralisé (par ex via logger.error déjà présent
GitHub
) est utile. On voit que logger.error('Error fetching collections', { error }) est appelé en cas d’échec de requête
GitHub
. Assurez-vous que ce logger remonte quelque part (console ou service distant) pour que les développeurs soient au courant des erreurs même si l’utilisateur ne les voit pas directement. Un utilisateur ne se plaindra pas forcément d’une page vide, il pensera qu’il n’y a juste “rien”, alors qu’en surveillant les logs on saurait qu’il y a eu erreur. Donc, renforcer la surveillance en production.
Améliorer l’expérience hors-ligne : Si l’une des raisons du cache local était de supporter un mode offline, alors il faudrait le prendre en charge plus globalement. Par exemple, détecter si l’appareil n’a pas de connexion et afficher un message “Vous êtes hors-ligne – affichage des données en cache” au lieu d’un chargement infini. C’est un plus, mais cela dépasse peut-être le cadre actuel. L’idée est qu’en toutes circonstances, l’application donne un retour d’état compréhensible (erreur serveur, pas de réseau, etc.).
En appliquant ces recommandations (propagation contrôlée des erreurs, feedback utilisateur en cas d’échec, suppression des rechargements intempestifs), on éliminera les cas de figure où l’application reste coincée en chargement ou vide sans explication. L’UX s’en trouvera grandement améliorée, et la maintenance aussi car les problèmes seront plus apparents.
Organisation des Fichiers (Surcharges, Doublons, Nommage, Complexité Inutile)
Problèmes identifiés : L’organisation du code du projet symbolica-motif-verse souffre de quelques antipatterns qui compliquent sa compréhension : fichiers en doublon, responsabilités entremêlées, noms pas toujours explicites. Comme souligné, il y a des doublons fonctionnels : plusieurs composants et hooks qui font presque la même chose. Par exemple, on a deux composants de carte de collection (CollectionCard vs OptimizedCollectionCard), plusieurs composants de grille (CollectionGrid, FeaturedCollectionsGrid, AdaptiveGrid, etc.), et même plusieurs composants d’état vide/erreur (CollectionEmptyState, EmptyCategory, CollectionErrorState, EnhancedErrorState, etc.). Ces redondances alourdissent l’arborescence de fichiers et peuvent prêter à confusion pour un nouveau développeur. On se demande : lequel est le bon à utiliser dans telle situation ? Si l’on en modifie un, doit-on modifier les autres ? C’est une complexité inutile du point de vue organisation car un design plus DRY (Don’t Repeat Yourself) pourrait réduire le nombre de fichiers à parcourir. Par exemple, EmptyCategory affiche un message quand une catégorie n’a rien (il utilise une clé i18n passée en prop
GitHub
), tandis que CollectionEmptyState semble faire de même pour l’ensemble des collections. Probablement qu’un composant générique EmptyState suffirait avec le message en prop. Le nommage des fichiers est parfois trompeur ou inconsistant. Par exemple, FeaturedCollectionsSection.tsx est dans components/collections/sections/, alors que FeaturedCollections.tsx (celui de la home) est dans components/sections/. Deux fichiers au nom si proche peuvent porter à confusion, d’autant qu’ils ne sont pas au même endroit. Il aurait peut-être mieux valu nommer celui de la page home HomeFeaturedCollections ou le déplacer dans components/collections pour être cohérent. De même, CollectionCategories.tsx contient en réalité l’ensemble de la page des collections (hors hero), ce qui n’est pas évident à deviner sans l’ouvrir. On aurait pu l’appeler CollectionsOverview par exemple. Ces détails de nommage rendent l’architecture moins évidente. Concernant la structure des répertoires, il y a un dossier src/pages/Admin pour l’admin, un src/components/collections pour les composants liés, etc. Globalement c’est cohérent. Toutefois, mélanger dans components/collections des sous-dossiers sections/ et des composants directs peut prêter à confusion. Peut-être pourrait-on regrouper les composants purement UI génériques (cards, grids, dialogs) à part, et les sections/pages composant à part. La documentation mentionne explicitement que certains fichiers sont trop longs (ex: collectionsService.ts, FeaturedCollections.tsx)
GitHub
 – ce n’est pas une question de structure physique, mais cela suggère de les découper, comme abordé plus haut. Au niveau de surcharges, on pourrait interpréter cela comme des styles override ou du code qui en remplace d’autre. Par exemple, la présence de OptimizedCollectionCard surchargée par rapport à CollectionCard en est une. Aussi, on voit dans CollectionsManagement de l’admin que certaines opérations (toggle statut) se font en direct via supabase au lieu de réutiliser le service ou hook existant
GitHub
GitHub
. C’est une sorte de duplication de logique (le service propose updateCollection, mais l’admin fait son propre supabase.from('collections').update à part). Ce genre de divergence peut être vu comme des surcharges non désirées. Il vaudrait mieux que toutes les mutations passent par le même service, pour appliquer uniformément les règles (invalidations de cache, gestion d’erreur, etc.). Sources probables :
– Code évolutif sans refonte, ajout de nouvelles fonctionnalités par copie de l’existant puis adaptation, au lieu de facteur commun (d’où multiplications des fichiers).
– Différents développeurs ont pu nommer les fichiers selon leur perspective, sans ligne directrice forte (il manque peut-être un guide de style pour les noms de composants et leur placement).
– Concernant l’organisation i18n, le découpage partiel des fichiers FR/EN est issu d’une transition inachevée vers un système modulaire, comme vu. Ceci est aussi un problème d’organisation de fichiers de traduction. Recommandations :
Réduire les doublons de composants/hooks : Comme déjà mentionné, viser un composant de carte unique, un composant de grille unique, etc. Éliminer les variantes non nécessaires. Cela passe par refactorer l’un pour couvrir les besoins supplémentaires de l’autre. Par exemple, ajouter la mémoïsation dans CollectionCard puis supprimer OptimizedCollectionCard. Ou intégrer la logique de pagination/animation de AdaptiveGrid dans CollectionGrid via des props optionnelles (mode paginé oui/non). Une fois que ces composants unifiés existent et sont fiables, supprimer les fichiers en doublon pour clarifier l’arborescence.
Renommer les composants pour plus de clarté : Opter pour des noms explicites et éventuellement homogènes. Par exemple, tous les composants de la page Collections pourraient être préfixés de Collections pour bien les identifier (ex: CollectionsCategoriesSection, CollectionsFeaturedSection). Ou au contraire, groupés dans un même dossier avec un index clair. Le but est qu’à la lecture du nom de fichier on sache mieux où il s’intègre. De même, s’assurer que les composants de plus haut niveau portent un nom de page s’ils représentent une page (ici CollectionsPage est bien nommé, mais CollectionCategories en fait agit comme le corps de la page Collections). Pourquoi pas l’intégrer directement dans CollectionsPage d’ailleurs, car il n’est pas réutilisé ailleurs. Ce serait plus simple que cette redirection vers un composant memo de 100 lignes.
Mise en place d’un guide de contribution : Rédiger quelques conventions internes sur comment ajouter un nouveau composant, où placer les fichiers, comment nommer les hooks, etc. Cela éviterait par exemple de créer un futur AnotherCollectionGrid si un nouveau besoin survient, et plutôt d’étendre le composant existant ou de comprendre qu’il y a déjà un outil utilisable. La présence de documents comme COLLECTIONS.md est un bon début pour cartographier le système
GitHub
; il faut y ajouter les conventions de code à suivre.
Nettoyage des fichiers obsolètes : Si après refonte on se retrouve avec des composants plus utilisés, il ne faut pas hésiter à supprimer ces fichiers pour ne pas polluer le repo. Par exemple, si FeaturedCollectionsGrid n’est finalement utilisé nulle part (ce qui semble plausible, il n’est pas importé dans le code visible), le supprimer pour clarifier. Garder le code mort alourdit la base de code et peut induire en erreur un développeur qui tomberait dessus. Utiliser les outils de l’IDE pour “rechercher les références” et vérifier l’utilité de chaque module.
Simplifier l’organisation i18n : Idéalement uniformiser la structure entre langues (mêmes fichiers pour fr et en). Si le choix modulaire est fait (plusieurs JSON par domaines), il faut l’appliquer aux deux langues. Par exemple, créer un en/collections.json complet aligné sur fr/collections.json (comme dit plus haut), et charger ce fichier dans enTranslation au lieu de l’ignorer. Dans config.ts, on pourrait construire l’objet en miroir de fr : importer enCollections et l’intégrer dans enTranslation. Actuellement enTranslation ne contient que les quelques imports existants et ignore potentiellement des pans de traduction
GitHub
. Harmoniser ça fait partie de l’organisation des fichiers de traduction.
Découper les responsabilités backend/serveur : Le fichier collectionsService.ts fait tout (CRUD complet). En le scindant, on améliore la lisibilité. Par exemple : un fichier collectionsApi.ts pourrait ne contenir que les appels Supabase (select, insert, update, delete), et un autre collectionsCache.ts gérer la logique de cache (localStorage etc., si conservée). Ainsi, le service principal orchestrerait ces deux modules. En front, on peut aussi regrouper certains hooks dans un fichier index par domaine (ex: collectionHooks.ts qui exporte useCollections, useFeaturedCollections, etc., pour éviter de chercher dans plusieurs fichiers). Ce ne sont pas des changements obligatoires mais ça aide à trouver plus vite l’info.
En somme, une session de refactoring globale est à prévoir pour nettoyer le projet : supprimer les éléments redondants, consolider les composants et hooks, et renommer/structurer les fichiers de façon logique. Les recommandations techniques ci-dessus visent à rendre le codebase plus maintenable, en réduisant le risque de bugs (dus aux duplications) et en facilitant le travail des futurs développeurs qui contribueront au projet.
En conclusion, le projet symbolica-motif-verse gagnerait beaucoup en stabilité et en clarté en appliquant ces améliorations. Résoudre les problèmes de cache et de fallback garantira une expérience utilisateur plus fiable (plus de données à jour, moins de contenu manquant ou inadapté à la langue). De plus, le remaniement des composants et hooks éliminera les incohérences actuelles, réduisant le risque de régressions et simplifiant le développement futur de nouvelles fonctionnalités. Enfin, une meilleure organisation des fichiers et une gestion d’erreur unifiée rendront le codebase plus lisible et robuste, ce qui facilitera la collaboration et la maintenance à long terme du projet
GitHub
GitHub
. Toutes ces recommandations sont réalisables de manière itérative, et chacune apportera une nette amélioration de qualité une fois mise en œuvre. Sources : Analyse du code du repository Founderfamily/symbolica-motif-verse et documentation interne du projet.
GitHub
GitHub
GitHub
GitHub
GitHub
Citations
Favicon
useCollectionCategories.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionCategories.ts#L26-L35
Favicon
useCollectionCategories.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionCategories.ts#L46-L55
Favicon
useCollectionCategories.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionCategories.ts#L80-L88
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L425-L433
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L92-L101
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L130-L138
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L14-L23
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L44-L51
Favicon
FeaturedCollectionsSection.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/sections/FeaturedCollectionsSection.tsx#L12-L20
Favicon
FeaturedCollectionsSection.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/sections/FeaturedCollectionsSection.tsx#L22-L30
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L415-L419
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L473-L477
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L415-L423
Favicon
collections.json

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/locales/fr/collections.json#L20-L23
Favicon
collectionsService.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/services/collectionsService.ts#L70-L78
Favicon
collectionsService.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/services/collectionsService.ts#L48-L56
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L136-L144
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L150-L159
Favicon
CollectionsManagement.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/Admin/CollectionsManagement.tsx#L66-L74
Favicon
useCollectionTranslations.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionTranslations.ts#L10-L18
Favicon
useCollectionTranslations.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionTranslations.ts#L48-L55
Favicon
useCollectionTranslations.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionTranslations.ts#L13-L21
Favicon
collectionsService.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/services/collectionsService.ts#L242-L251
Favicon
collectionsService.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/services/collectionsService.ts#L258-L263
Favicon
collectionsService.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/services/collectionsService.ts#L130-L138
Favicon
collectionsService.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/services/collectionsService.ts#L144-L153
Favicon
collections.json

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/locales/fr/collections.json#L2-L10
Favicon
collectionsService.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/services/collectionsService.ts#L22-L31
Favicon
CollectionGrid.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/CollectionGrid.tsx#L14-L22
Favicon
CollectionGrid.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/CollectionGrid.tsx#L45-L53
Favicon
FeaturedCollectionsGrid.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/FeaturedCollectionsGrid.tsx#L10-L18
Favicon
FeaturedCollectionsGrid.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/FeaturedCollectionsGrid.tsx#L24-L31
Favicon
CollectionAnimations.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/f81b62de70de59a102ccaa6d91731e38fa716768/src/components/collections/CollectionAnimations.tsx#L4-L12
Favicon
CollectionAnimations.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/f81b62de70de59a102ccaa6d91731e38fa716768/src/components/collections/CollectionAnimations.tsx#L100-L108
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L439-L442
Favicon
CollectionsPage.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/CollectionsPage.tsx#L18-L26
Favicon
HomePage.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/HomePage.tsx#L48-L56
Favicon
HomePage.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/HomePage.tsx#L58-L66
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L165-L174
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L175-L183
Favicon
CollectionErrorBoundary.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/CollectionErrorBoundary.tsx#L42-L50
Favicon
CollectionErrorBoundary.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/CollectionErrorBoundary.tsx#L51-L60
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L448-L453
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L443-L451
Favicon
CollectionsPage.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/CollectionsPage.tsx#L24-L28
Favicon
CollectionGrid.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/CollectionGrid.tsx#L8-L16
Favicon
OptimizedCollectionCard.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/OptimizedCollectionCard.tsx#L18-L26
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L22-L24
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L90-L98
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L92-L100
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L494-L500
Favicon
HomePage.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/HomePage.tsx#L30-L38
Favicon
useCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollections.ts#L14-L22
Favicon
useOptimizedCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useOptimizedCollections.ts#L70-L78
Favicon
useOptimizedCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useOptimizedCollections.ts#L80-L89
Favicon
useOptimizedCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useOptimizedCollections.ts#L24-L31
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L420-L428
Favicon
useOptimizedCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useOptimizedCollections.ts#L10-L18
Favicon
useOptimizedCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useOptimizedCollections.ts#L88-L97
Favicon
CollectionsPage.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/CollectionsPage.tsx#L13-L20
Favicon
useCollectionCategories.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionCategories.ts#L20-L28
Favicon
useCollectionCategories.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionCategories.ts#L26-L34
Favicon
useCollectionCategories.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionCategories.ts#L6-L14
Favicon
useCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollections.ts#L52-L60
Favicon
useCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollections.ts#L70-L78
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L488-L491
Favicon
useOptimizedCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useOptimizedCollections.ts#L12-L19
Favicon
useOptimizedCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useOptimizedCollections.ts#L34-L42
Favicon
CollectionsManagement.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/Admin/CollectionsManagement.tsx#L59-L64
Favicon
CollectionsManagement.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/Admin/CollectionsManagement.tsx#L32-L40
Favicon
CollectionsManagement.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/Admin/CollectionsManagement.tsx#L54-L62
Favicon
collections.json

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/locales/fr/collections.json#L34-L42
Favicon
sections.json

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/locales/en/sections.json#L54-L61
Favicon
collections.json

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/locales/en/collections.json#L12-L16
Favicon
collections.json

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/locales/fr/collections.json#L2-L6
Favicon
config.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/config.ts#L76-L84
Favicon
collections.json

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/locales/en/collections.json#L12-L19
Favicon
config.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/config.ts#L88-L95
Favicon
config.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/config.ts#L90-L95
Favicon
config.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/config.ts#L31-L39
Favicon
config.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/config.ts#L41-L48
Favicon
config.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/config.ts#L92-L95
Favicon
useCollectionTranslations.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionTranslations.ts#L30-L39
Favicon
useCollectionTranslations.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollectionTranslations.ts#L40-L48
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L64-L72
Favicon
CollectionDetailPage.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/CollectionDetailPage.tsx#L119-L125
Favicon
CollectionGrid.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/CollectionGrid.tsx#L32-L40
Favicon
CollectionCard.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/CollectionCard.tsx#L34-L41
Favicon
collectionsService.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/services/collectionsService.ts#L40-L48
Favicon
collectionsService.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/services/collectionsService.ts#L56-L61
Favicon
CollectionGrid.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/CollectionGrid.tsx#L30-L38
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L165-L173
Favicon
FeaturedCollections.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/sections/FeaturedCollections.tsx#L174-L182
Favicon
CollectionCategories.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/components/collections/CollectionCategories.tsx#L25-L33
Favicon
useCollections.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/hooks/useCollections.ts#L20-L22
Favicon
collectionsService.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/services/collectionsService.ts#L58-L61
Favicon
CollectionTabs.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/f81b62de70de59a102ccaa6d91731e38fa716768/src/components/collections/sections/CollectionTabs.tsx#L96-L101
Favicon
CollectionsManagement.tsx

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/pages/Admin/CollectionsManagement.tsx#L130-L138
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L59-L67
Favicon
config.ts

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/src/i18n/config.ts#L56-L64
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L486-L495
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L496-L502
Favicon
COLLECTIONS.md

https://github.com/Founderfamily/symbolica-motif-verse/blob/2150295dbadc53a182571b768f4a6c235a683247/COLLECTIONS.md#L439-L447