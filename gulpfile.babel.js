/*
  Gulpfile.js
  ===========
  Plutôt que de gérer un fichier de configuration géant
	On divise chaque tâches dans son propre fichier dans gulpfile/tasks
*/

import requireDir from 'require-dir';

requireDir('./gulpfile/tasks', { recurse: true });
