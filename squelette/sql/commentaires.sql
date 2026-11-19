-- =============================================================================
-- PARTIE A · Questions 1 et 2 · La table des commentaires
-- A executer dans la base ateliers, APRES db/ateliers.sql.
-- =============================================================================

-- Le script doit pouvoir etre relance : on commence par effacer la table.
DROP TABLE IF EXISTS commentaires;

-- QUESTION 1 · Ecrire le CREATE TABLE commentaires.
-- Les colonnes (memes noms que dans data/commentaires.initial.json) :
--   id          un entier attribue par la base, cle primaire
--   article_id  l'article commente : obligatoire, et forcement un article qui existe
--   nom         le nom du visiteur, obligatoire
--   texte       obligatoire, et pas une chaine vide
--   cree_le     la date et l'heure du commentaire ; par defaut, maintenant
-- Et une regle : quand un article est supprime, ses commentaires disparaissent avec lui.
CREATE TABLE commentaires (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    texte TEXT NOT NULL CHECK (texte <> ''),
    cree_le TIMESTAMPTZ NOT NULL DEFAULT now()
);



-- QUESTION 2 · Inserer les huit commentaires de data/commentaires.initial.json.
-- Ne donnez PAS les id : la base les attribue. Les dates sont en UTC (le Z final).



