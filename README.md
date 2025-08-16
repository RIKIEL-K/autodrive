# Autodrive

Application de mise en relation **chauffeur ↔ utilisateur** avec **authentification JWT**, **dashboards dédiés (USER/DRIVER)**, **messagerie temps réel (WebSocket)**, **paiement Stripe** et **orchestration Docker**. Pile technologique : **Spring Boot (Java 21)**, **React**, **MongoDB**, **WebSockets (STOMP/SockJS)** et **Nginx**.

## ✨ Fonctionnalités clés

- **Authentification centralisée** (une seule page) pour **USER** et **DRIVER** : point d’entrée unique côté backend, génération d’un **access token** de courte durée et d’un **refresh token** optionnel. Le front attache automatiquement le JWT aux requêtes sortantes.
- **Sécurité stateless (JWT + Spring Security)** : vérification de la signature/expiration à chaque appel, population du contexte de sécurité et contrôle fin par **rôle** (p. ex. accès réservé aux chauffeurs).
- **Messagerie temps réel** : WebSocket avec STOMP/SockJS pour échanger des messages liés à une course, persistance en base et tolérance aux rafraîchissements de page.
- **Paiement Stripe** : création/liaison du compte chauffeur, débit côté utilisateur lors de l’acceptation d’une course et transfert du montant vers le solde chauffeur.
- **Front React servi par Nginx** : reverse proxy pour l’API, le WebSocket et un service IA (chat) optionnel.
- **Conteneurisation** : services backend, frontend et chat IA orchestrés via Docker Compose. MongoDB peut être local (Compass), en conteneur, ou Atlas.

## 🧭 Architecture (vue d’ensemble)

- **Frontend (React + Nginx)** : page de connexion unique, dashboards USER/DRIVER, interceptors pour le JWT, proxy des chemins `/api`, `/ws` et `/ai` vers les services internes.
- **Backend (Spring Boot)** :
  - **Auth** : contrôleur d’authentification unique, services de lookup (User/Driver) et de mot de passe, utilitaire JWT et filtre d’authentification.
  - **Domaine** : entités et repositories (users, drivers, courses, messages, paiements, etc.).
  - **Sécurité** : configuration stateless, autorisations par rôle, endpoints métiers protégés.
- **Base de données (MongoDB)** : stockage des profils, courses, messages et événements clés.
- **Chat IA (optionnel)** : service Python exposé derrière Nginx sous `/ai`.
- **Réseau interne** : tous les services communiquent sur un bridge réseau; le frontend joue le rôle de porte d’entrée HTTP pour le navigateur.

## 🔐 Authentification & Sécurité (résumé)

1. **Connexion** : le client envoie e‑mail, mot de passe et rôle (**USER** ou **DRIVER**) vers un **endpoint unique** côté backend.
2. **Validation** : le backend retrouve le compte dans le bon référentiel (User/Driver), vérifie le mot de passe (recommandé : hachage BCrypt), et **émet** un access token (court) et un refresh token (long).
3. **Transport** : le client stocke les jetons et envoie l’entête **Authorization: Bearer** sur chaque requête.
4. **Filtrage** : un filtre JWT vérifie signature/expiration et remplit le contexte de sécurité avec le rôle.
5. **Autorisation** : les routes sont protégées et certaines nécessitent un **rôle** spécifique (ex. accès chauffeur uniquement).
6. **Renouvellement** : si activé, un endpoint de **refresh** prolonge la session sans redemander le mot de passe.

Bonnes pratiques appliquées : secret JWT long, access token de courte durée, refresh de plus longue durée, séparation claire des responsabilités (controller ↔ services ↔ sécurité).

## 🔌 Temps réel & Messagerie

- Connexion WebSocket unique pour une course donnée.
- Abonnements par identifiant de course; messages diffusés aux deux parties.
- Persistance côté base et côté client pour résilience aux rafraîchissements.

## 💳 Paiements (Stripe)

- Onboarding/liaison d’un compte chauffeur.
- Déclenchement du paiement à l’acceptation de la course par le chauffeur.
- Transfert du montant vers le solde du chauffeur et consultation de ce solde depuis le tableau de bord.

## 🛠️ Déploiement & Configuration

- **Docker Compose** orchestre les services **backend**, **frontend** et **chat IA**. MongoDB peut être :
  - **Local via Compass** (recommandé en développement). Le backend en conteneur se connecte à la base de l’hôte via l’adresse dédiée à l’hyperviseur.
  - **En conteneur** dans le même Compose (service MongoDB dédié).
  - **Atlas** (cloud) avec connectivité autorisée et résolution DNS correcte.
- **Variables d’environnement** à prévoir :
  - Connexion MongoDB (URI unique).
  - Secret JWT (chaîne longue).
  - Identifiants e‑mail (si envoi d’e‑mails) et clé du service IA (si utilisé).
- **Nginx (frontend)** : proxy des routes `/api` vers le backend, `/ws` pour WebSocket (upgrade/connection), et `/ai` vers le service IA.
- **CORS** : ouvert en développement; restreindre en production aux domaines de confiance.

## 🧪 Vérification manuelle (Postman)

- **Authentification** : effectuer une requête de connexion avec e‑mail, mot de passe et rôle; vérifier la présence d’un **access token** et éventuellement d’un **refresh token** dans la réponse.
- **Accès protégé** : appeler un endpoint protégé avec l’entête d’autorisation; vérifier la réponse **autorisée** lorsque le token est valide.
- **Contrôle de rôle** : tester un endpoint limité au rôle **DRIVER**; attendre **interdiction** avec un token de rôle **USER** et **accès** avec un token de rôle **DRIVER**.
- **Expiration/renouvellement** : simuler l’expiration de l’access token et utiliser l’endpoint de **refresh** pour récupérer un nouveau jeton d’accès, puis rejouer l’appel protégé.

## 🐞 Dépannage rapide

- **Conflit de configurations MongoDB** : ne pas mélanger URI et paramètres séparés (hôte/port/utilisateur). Utiliser **une URI unique** et s’assurer qu’aucune variable d’environnement « fantôme » n’injecte une autre valeur.
- **SRV (Atlas) introuvable** : si la résolution SRV échoue dans le conteneur, soit corriger le DNS, soit utiliser une **seed list** sans SRV, soit passer sur une base locale/Compose.
- **« Toujours 401 »** : vérifier la **longueur et la constance** du secret JWT entre génération et validation; s’assurer que le filtre de sécurité est actif et que l’entête d’autorisation est transmis par le proxy.
- **WebSocket** : veiller à la propagation des entêtes d’upgrade dans le reverse proxy et à l’URL interne correcte.
- **CORS** : ouvrir en dev, restreindre en prod.

## 📌 Roadmap (suggestions)

- Refresh token en **cookie httpOnly** pour réduire l’exposition côté client.
- **Journalisation d’audit** et **limitation de débit** sur les endpoints sensibles.
- **Tests end‑to‑end** et observabilité (métriques, dashboards).
- **CI/CD** et déploiement cloud managé.

## 📄 Licence

Projet sous licence libre (à préciser selon vos besoins).

## 🙌 Remerciements

Autodrive est un projet d’apprentissage **full‑stack** combinant **temps réel**, **sécurité JWT**, **paiements**, **Docker** et bonnes pratiques d’architecture. Contributions et retours bienvenus !
