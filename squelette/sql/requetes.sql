-- =============================================================================
-- PARTIE A · Question 3 · Six requetes
-- Sous chaque question : votre requete, puis le resultat obtenu, en commentaire.
-- =============================================================================

-- R1. Les commentaires de l'article 2, du plus recent au plus ancien : nom, texte.
SELECT nom, texte
FROM commentaires
WHERE article_id = 2
ORDER BY cree_le DESC;

-- nom  |                            texte                            
--------+-------------------------------------------------------------
-- Inès | Des photos de la pose seraient les bienvenues.
-- Hugo | Le noyer est magnifique. Combien de temps pour le séchage ?
--(2 lignes)

-- R2. Le nombre de commentaires de CHAQUE article, y compris ceux qui n'en ont aucun :
--     id, titre, nb_commentaires.
SELECT a.id, a.titre, COUNT(c.id) AS nb_commentaires
FROM articles a
LEFT JOIN commentaires c ON c.article_id = a.id
GROUP BY a.id, a.titre
ORDER BY a.id;

-- id |                   titre                   | nb_commentaires 
------+-------------------------------------------+-----------------
--  1 | Choisir son bois pour une table de jardin |               3
--  2 | Une bibliothèque sur mesure à Besançon    |               2
--  3 | Huile ou vernis : ce qui protège vraiment |               0
--  4 | Restaurer une chaise paillée              |               1
--  5 | Une cuisine en chêne massif à Dole        |               2
--  6 | Affûter ses ciseaux à bois                |               0
--(6 lignes)

-- R3. Les articles qui n'ont aucun commentaire : id, titre.
SELECT a.id, a.titre
FROM articles a
WHERE NOT EXISTS (
  SELECT 1 FROM commentaires c WHERE c.article_id = a.id
);

-- id |                   titre                   
------+-------------------------------------------
--  6 | Affûter ses ciseaux à bois
--  3 | Huile ou vernis : ce qui protège vraiment
--(2 lignes)

-- R4. Pour chaque auteur, le nombre total de commentaires recus sur ses articles,
--     du plus commente au moins commente.
SELECT au.prenom, COUNT(c.id) AS nb_commentaires
FROM auteurs au
JOIN articles a ON a.auteur_id = au.id
JOIN commentaires c ON c.article_id = a.id
GROUP BY au.id, au.prenom
ORDER BY nb_commentaires DESC;

-- prenom | nb_commentaires 
----------+-----------------
-- Marc   |               5
-- Théo   |               2
-- Sophie |               1
--(3 lignes)

-- R5. Les visiteurs (nom) qui ont commente plus d'un article.
SELECT nom
FROM commentaires
GROUP BY nom
HAVING COUNT(DISTINCT article_id) > 1;

--  nom   
----------
-- Claire
--(1 ligne)

-- R6. Les trois commentaires les plus recents, avec le titre de leur article.
SELECT c.nom, c.texte, c.cree_le, a.titre
FROM commentaires c
JOIN articles a ON a.id = c.article_id
ORDER BY c.cree_le DESC
LIMIT 3;

--  nom   |                            texte                             |        cree_le         |               titre                
----------+--------------------------------------------------------------+------------------------+------------------------------------
-- Karim  | Superbe travail.                                             | 2026-10-18 19:47:00+02 | Une cuisine en chêne massif à Dole
-- Claire | Aucune vis visible : comment sont fixés les caissons ?       | 2026-10-16 14:22:00+02 | Une cuisine en chêne massif à Dole
-- Lucie  | J'ai une chaise à faire refaire, vous prenez les commandes ? | 2026-10-09 09:00:00+02 | Restaurer une chaise paillée
--(3 lignes)