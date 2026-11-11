// CONTROLEUR des commentaires.
// A ECRIRE : une fonction (req, res, next) par route de CONTRAT.md, comme dans
// controllers/articles.controller.js :
//   1. lire req.params, req.query, req.body ;
//   2. verifier la forme : 400 si un champ obligatoire manque ;
//   3. appeler le service (services/commentaires.service.js) ;
//   4. choisir le code (200, 201 ou 204). Toute erreur part vers next(err).
// Le controleur ne parle JAMAIS a la base : pas de pool ici, seulement le service.

const service = require('../services/commentaires.service');
const ErreurHttp = require('../utils/erreur-http');

// GET /api/articles/:id/commentaires
function lister(req, res, next){
    const articleId = Number(req.params.id);
    service.lister(articleId)
        .then((commentaires) => res.json(commentaires))
        .catch(next);
}

// POST /api/articles/:id/commentaires
function creer(req, res, next) {
    const articleId = Number(req.params.id);
    const { nom, texte } = req.body || {};
    if (!texte || !nom) return next(new ErreurHttp(400, 'CHAMP_MANQUANT', 'Les champs texte et nom sont obligatoires.'));
    service.creer(articleId, { nom, texte })
        .then((commentaire) => res.status(201).json(commentaire))
        .catch(next);
}

// GET /api/commentaires?nom=nom
function parVisiteur(req, res, next) {
    const nom = req.query.nom;
    if (!nom) return next(new ErreurHttp(400, 'CHAMP_MANQUANT', 'Le champ nom est obligatoire.'));
    service.parVisiteur(nom)
        .then((commentaire) => res.json(commentaire))
        .catch(next);
}

module.exports = {lister, creer, parVisiteur};
