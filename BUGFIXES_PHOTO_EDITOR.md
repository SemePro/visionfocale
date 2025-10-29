# 🐛 Corrections de Bugs - Éditeur Photo

## Date : 25 Octobre 2025

---

## Bug #1 : TypeError avec les Courbes RGB ❌➡️✅

### Erreur Complète
```
TypeError: newCurves[activeChannel] is not iterable
```

### Localisation
- **Fichier** : `components/admin/CurvesAdjustment.tsx`
- **Ligne** : 146
- **Fonction** : `handleCanvasClick`

### Contexte
L'utilisateur pouvait sélectionner 4 canaux dans l'outil Courbes :
- `'r'` (Rouge)
- `'g'` (Vert)
- `'b'` (Bleu)
- `'rgb'` (Tous les canaux)

### Cause Racine
L'objet `curves` ne contenait que les propriétés `r`, `g`, et `b` :
```typescript
curves: { r: number[]; g: number[]; b: number[] }
```

Quand l'utilisateur sélectionnait le canal `'rgb'`, le code essayait d'accéder à :
```typescript
newCurves['rgb'] = [...newCurves['rgb']]; // ❌ undefined
```

### Solution Appliquée
Ajout d'une condition pour détecter le canal `'rgb'` et modifier les trois canaux simultanément :

```typescript
const newCurves = { ...curves };

// Si le canal actif est 'rgb', modifier tous les canaux
if (activeChannel === 'rgb') {
  newCurves.r = [...newCurves.r];
  newCurves.g = [...newCurves.g];
  newCurves.b = [...newCurves.b];
  newCurves.r[pointIndex] = Math.max(0, Math.min(255, pointValue));
  newCurves.g[pointIndex] = Math.max(0, Math.min(255, pointValue));
  newCurves.b[pointIndex] = Math.max(0, Math.min(255, pointValue));
} else {
  // Sinon, modifier uniquement le canal actif
  newCurves[activeChannel] = [...newCurves[activeChannel]];
  newCurves[activeChannel][pointIndex] = Math.max(0, Math.min(255, pointValue));
}

onCurvesChange(newCurves);
```

### Résultat
✅ Le canal RGB fonctionne maintenant correctement et modifie les trois canaux en même temps.

---

## Bug #2 : IndexSizeError avec getImageData ❌➡️✅

### Erreur Complète
```
IndexSizeError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The source width is 0.
```

### Localisation
- **Fichier** : `components/admin/RetouchingTools.tsx`
- **Ligne** : 147
- **Fonction** : `handleMouseUp` (outil Sélection)

### Contexte
L'outil Sélection permet de créer un rectangle de sélection en cliquant et glissant sur le canvas.

### Cause Racine
Si l'utilisateur cliquait sans glisser (ou glissait très peu), les dimensions `width` et `height` pouvaient être 0 ou négatives, causant l'erreur lors de l'appel à `getImageData()`.

```typescript
// ❌ Code problématique
const width = lastPoint.x - selectionStart.x; // Peut être 0
const height = lastPoint.y - selectionStart.y; // Peut être 0

const imageData = ctx.getImageData(
  selectionStart.x, 
  selectionStart.y, 
  Math.abs(width),  // 0 cause l'erreur
  Math.abs(height)  // 0 cause l'erreur
);
```

### Solution Appliquée

#### 1. Vérification de Taille Minimale
Ajout d'une vérification pour s'assurer que la sélection fait au moins 5px :

```typescript
// Vérifier que la sélection a une taille minimale (au moins 5px)
if (Math.abs(width) < 5 || Math.abs(height) < 5) {
  setSelectionStart(null);
  setIsDrawing(false);
  setLastPoint(null);
  return; // Annuler la sélection
}
```

#### 2. Normalisation des Coordonnées
Calcul des coordonnées normalisées avant `getImageData` :

```typescript
// Calculer les coordonnées normalisées
const x = width < 0 ? lastPoint.x : selectionStart.x;
const y = height < 0 ? lastPoint.y : selectionStart.y;
const absWidth = Math.abs(width);
const absHeight = Math.abs(height);
```

#### 3. Gestion d'Erreur avec Try-Catch
Ajout d'un bloc try-catch pour capturer toute erreur inattendue :

```typescript
try {
  const imageData = ctx.getImageData(x, y, absWidth, absHeight);
  selectionImageDataRef.current = imageData;
  
  setSelection({
    x,
    y,
    width: absWidth,
    height: absHeight
  });
} catch (error) {
  console.error('Erreur lors de la création de la sélection:', error);
}
```

### Code Complet Corrigé

```typescript
const handleMouseUp = () => {
  if (!canvasRef.current) return;
  
  // Pour l'outil de sélection, finaliser la sélection
  if (selectedTool === 'select' && selectionStart && lastPoint) {
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      const width = lastPoint.x - selectionStart.x;
      const height = lastPoint.y - selectionStart.y;
      
      // ✅ Vérification de taille minimale
      if (Math.abs(width) < 5 || Math.abs(height) < 5) {
        setSelectionStart(null);
        setIsDrawing(false);
        setLastPoint(null);
        return;
      }
      
      // ✅ Normalisation des coordonnées
      const x = width < 0 ? lastPoint.x : selectionStart.x;
      const y = height < 0 ? lastPoint.y : selectionStart.y;
      const absWidth = Math.abs(width);
      const absHeight = Math.abs(height);
      
      // ✅ Gestion d'erreur
      try {
        const imageData = ctx.getImageData(x, y, absWidth, absHeight);
        selectionImageDataRef.current = imageData;
        
        setSelection({
          x,
          y,
          width: absWidth,
          height: absHeight
        });
      } catch (error) {
        console.error('Erreur lors de la création de la sélection:', error);
      }
    }
    setSelectionStart(null);
  }
  
  setIsDrawing(false);
  setLastPoint(null);
};
```

### Résultat
✅ L'outil Sélection fonctionne maintenant sans erreur, même avec des clics rapides ou des petites sélections.

---

## 📊 Résumé des Corrections

| Bug | Fichier | Ligne | Statut | Impact |
|-----|---------|-------|--------|--------|
| TypeError: not iterable | `CurvesAdjustment.tsx` | 146 | ✅ Corrigé | Critique |
| IndexSizeError: width is 0 | `RetouchingTools.tsx` | 147 | ✅ Corrigé | Critique |

---

## 🧪 Tests de Régression

### Test 1 : Courbes RGB
- [x] Sélectionner le canal RGB
- [x] Cliquer sur la courbe
- [x] Vérifier que les 3 canaux sont modifiés
- [x] Pas d'erreur dans la console

### Test 2 : Sélection Minimale
- [x] Cliquer sans glisser
- [x] Glisser moins de 5px
- [x] Vérifier qu'aucune sélection n'est créée
- [x] Pas d'erreur dans la console

### Test 3 : Sélection Normale
- [x] Créer une sélection de 50x50px
- [x] Vérifier que le rectangle vert apparaît
- [x] Vérifier que les dimensions sont affichées
- [x] Pas d'erreur dans la console

### Test 4 : Sélection Inversée
- [x] Glisser de droite à gauche
- [x] Glisser de bas en haut
- [x] Vérifier que la sélection fonctionne
- [x] Pas d'erreur dans la console

---

## 🔍 Leçons Apprises

### 1. Validation des Entrées
Toujours valider les dimensions avant d'utiliser des API Canvas :
```typescript
if (width <= 0 || height <= 0) {
  // Gérer le cas d'erreur
  return;
}
```

### 2. Gestion d'Erreur Robuste
Utiliser try-catch pour les opérations Canvas qui peuvent échouer :
```typescript
try {
  const imageData = ctx.getImageData(x, y, width, height);
  // ...
} catch (error) {
  console.error('Erreur:', error);
}
```

### 3. Types Stricts
Vérifier que les types correspondent aux données réelles :
```typescript
// Si activeChannel peut être 'rgb', 'r', 'g', ou 'b'
// mais curves n'a que { r, g, b }
// alors il faut gérer le cas 'rgb' séparément
```

### 4. Normalisation des Coordonnées
Toujours normaliser les coordonnées négatives :
```typescript
const x = width < 0 ? endX : startX;
const y = height < 0 ? endY : startY;
const absWidth = Math.abs(width);
const absHeight = Math.abs(height);
```

---

## 🚀 Améliorations Futures

### Suggestions pour Éviter les Bugs Similaires

1. **Tests Unitaires** : Ajouter des tests pour les cas limites
   ```typescript
   test('handleMouseUp should not create selection if width < 5px', () => {
     // ...
   });
   ```

2. **Validation TypeScript Plus Stricte** :
   ```typescript
   type CurveChannel = 'r' | 'g' | 'b';
   type ActiveChannel = CurveChannel | 'rgb';
   
   interface Curves {
     [K in CurveChannel]: number[];
   }
   ```

3. **Messages d'Erreur Utilisateur** :
   ```typescript
   if (Math.abs(width) < 5 || Math.abs(height) < 5) {
     toast.info('La sélection doit faire au moins 5x5 pixels');
     return;
   }
   ```

4. **Logging Amélioré** :
   ```typescript
   console.debug('Sélection créée:', { x, y, width, height });
   ```

---

## ✅ Statut Final

**Tous les bugs critiques sont corrigés et testés.**

L'éditeur photo est maintenant stable et prêt pour la production ! 🎉

---

**Développé avec ❤️ pour VisionFocale**


