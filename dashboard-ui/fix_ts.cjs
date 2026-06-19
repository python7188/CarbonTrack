const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchRegex, replaceWith) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(searchRegex, replaceWith);
  fs.writeFileSync(fullPath, content);
}

replaceInFile('src/components/visualizations/InteractiveGlobe.tsx', /import React(?:, \{[^}]*\})? from 'react';\r?\n/, '');
replaceInFile('src/pages/DashboardPage.tsx', /import React, \{/g, 'import {');
replaceInFile('src/pages/GoalsPage.tsx', /import React, \{/g, 'import {');
replaceInFile('src/pages/GoalsPage.tsx', /ArrowRight,\s*/g, '');
replaceInFile('src/pages/GoalsPage.tsx', /const joinedIds =[^;]+;\r?\n/g, '');
replaceInFile('src/pages/InsightsPage.tsx', /Leaf,\s*/g, '');
replaceInFile('src/pages/LeaderboardPage.tsx', /import React, \{/g, 'import {');
replaceInFile('src/pages/LeaderboardPage.tsx', /Medal,\s*/g, '');
replaceInFile('src/pages/ReducePage.tsx', /import React, \{/g, 'import {');
replaceInFile('src/pages/ReducePage.tsx', /import \{ motion \} from 'framer-motion';\r?\n/g, '');
replaceInFile('src/pages/ReducePage.tsx', /CATEGORY_COLORS,? /g, '');
replaceInFile('src/pages/ReducePage.tsx', /as ElementType/g, 'as any');
replaceInFile('src/pages/ReducePage.tsx', /import \{ useState, ElementType \} from 'react';/, "import { useState } from 'react';");
replaceInFile('src/pages/TrackPage.tsx', /as ElementType/g, 'as any');
replaceInFile('src/pages/TrackPage.tsx', /import React, \{ useState, useEffect, ElementType, useCallback \} from 'react';/, "import { useState, useEffect, useCallback } from 'react';");
replaceInFile('src/pages/FootprintPage.tsx', /as React\.ElementType/g, 'as any');

console.log("Fixes applied.");
