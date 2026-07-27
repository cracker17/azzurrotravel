/* ═════════════════════════════════════════════════════════════════════
   Azzurro Travel — asset build

   The pages load assets/css/main.min.css and assets/js/*.min.js, NOT the
   sources. After editing any file in assets/css or assets/js you must run:

       npm run build

   Every ".min." file under assets/ is generated; do not hand-edit them.
═════════════════════════════════════════════════════════════════════ */
import { build } from 'esbuild';
import { statSync } from 'node:fs';

const targets = [
  { in: 'assets/css/main.css',  out: 'assets/css/main.min.css'  },
  { in: 'assets/js/main.js',    out: 'assets/js/main.min.js'    },
  { in: 'assets/js/icons.js',   out: 'assets/js/icons.min.js'   }
];

const kb = (p) => (statSync(p).size / 1024).toFixed(1).padStart(6) + ' KB';

for (const t of targets) {
  await build({
    entryPoints: [t.in],
    outfile: t.out,
    minify: true,
    // ES2017 keeps the output readable by every browser the site supports and
    // avoids esbuild rewriting anything into syntax older Safari chokes on.
    target: ['es2017', 'safari12'],
    legalComments: 'none',
    logLevel: 'warning'
  });
  console.log(`${t.in.padEnd(24)} ${kb(t.in)}  ->  ${t.out.padEnd(28)} ${kb(t.out)}`);
}
