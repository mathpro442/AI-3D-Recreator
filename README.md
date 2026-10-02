# AI 3D Recreator — vraie IA

Cette version utilise l'API Meshy Multi-Image to 3D.
- 1 à 4 images
- Meshy 7.1
- géométrie Ultra 2K
- textures 4K
- PBR
- sortie GLB

IMPORTANT:
La clé MESHY_API_KEY doit rester côté serveur (variable d'environnement).
Ne la mets jamais dans public/index.html ni dans un dépôt GitHub public.

Lancement:
1. npm install
2. définir MESHY_API_KEY
3. npm start
4. ouvrir http://localhost:3000

Pour publier:
- mettre ce projet dans GitHub
- déployer le serveur sur un hébergeur Node/Express
- ajouter MESHY_API_KEY dans les variables d'environnement du serveur
