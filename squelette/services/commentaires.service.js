// SERVICE des commentaires · VERSION POSTGRESQL.
// Memes fonctions et memes reponses que la version JSON (CONTRAT.md) :
// le routeur et le controleur n'ont pas change.
// Les valeurs ne sont JAMAIS collees dans le texte SQL : elles passent par $1, $2...
// Memes commentaires que dans articles.services.js

const pool = require('../db/pool');
const ErreurHttp = require('../utils/erreur-http');

const introuvable = (id) => new ErreurHttp(404, 'COMMENTAIRE_INTROUVABLE', `Le commentaire ${id} n'existe pas.`);
const articleIntrouvable = (id) => new ErreurHttp(404, 'ARTICLE_INTROUVABLE', `L'article ${id} n'existe pas.`);

// READ · les commentaires d'un article, du plus ancien au plus recent
async function lister(articleId) {
  if (!Number.isInteger(articleId)) throw articleIntrouvable(articleId);
  // 1re requete : l'article existe-t-il ?
  const article = await pool.query('SELECT 1 FROM articles WHERE id = $1', [articleId]);
  if (article.rowCount === 0) throw articleIntrouvable(articleId);
  // 2e requete : ses commentaires
  const resultat = await pool.query(
    `SELECT id, article_id, nom, texte, cree_le
     FROM commentaires
     WHERE article_id = $1
     ORDER BY cree_le ASC`,
    [articleId],
  );
  return resultat.rows;
}

// READ · un commentaire
async function trouver(id) {
  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query(
    'SELECT id, article_id, nom, texte, cree_le FROM commentaires WHERE id = $1',
    [id],
  );
  if (resultat.rowCount === 0) throw introuvable(id);
  return resultat.rows[0];
}

// READ · les commentaires d'un visiteur, avec le titre de l'article, du plus recent au plus ancien
async function parVisiteur(nom) {
  const resultat = await pool.query(
    `SELECT c.id, c.article_id, c.nom, c.texte, c.cree_le, a.titre
     FROM commentaires c
     JOIN articles a ON a.id = c.article_id
     WHERE c.nom = $1
     ORDER BY c.cree_le DESC`,
    [nom],
  );
  return resultat.rows;
}

// CREATE · si l'article n'existe pas, la cle etrangere refuse (code 23503) : on traduit en 404
async function creer(articleId, { nom, texte }) {
  if (!Number.isInteger(articleId)) throw articleIntrouvable(articleId);
  try {
    const resultat = await pool.query(
      `INSERT INTO commentaires (article_id, nom, texte)
       VALUES ($1, $2, $3)
       RETURNING id, article_id, nom, texte, cree_le`,
      [articleId, nom, texte],
    );
    return resultat.rows[0];
  } catch (err) {
    if (err.code === '23503') throw articleIntrouvable(articleId);
    throw err;
  }
}

// UPDATE · seul le texte change
async function modifier(id, { texte }) {
  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query(
    `UPDATE commentaires SET texte = $2
     WHERE id = $1
     RETURNING id, article_id, nom, texte, cree_le`,
    [id, texte],
  );
  if (resultat.rowCount === 0) throw introuvable(id);
  return resultat.rows[0];
}

// DELETE
async function supprimer(id) {
  if (!Number.isInteger(id)) throw introuvable(id);
  const resultat = await pool.query('DELETE FROM commentaires WHERE id = $1', [id]);
  if (resultat.rowCount === 0) throw introuvable(id);
}

module.exports = { lister, trouver, parVisiteur, creer, modifier, supprimer };