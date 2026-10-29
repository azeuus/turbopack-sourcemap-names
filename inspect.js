// Checks whether each client chunk's source map is named `<chunk>.js.map`,
// the convention source map upload tools (e.g. datadog-ci) rely on.
const fs = require('fs');
const path = require('path');

const chunksDir = path.join('.next', 'static', 'chunks');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });

let matching = 0;
let mismatching = 0;

for (const file of walk(chunksDir).filter((f) => f.endsWith('.js'))) {
  const content = fs.readFileSync(file, 'utf8');
  const sourceMappingURL = content.match(/sourceMappingURL=(\S+)\s*$/)?.[1];
  if (!sourceMappingURL) {
    continue;
  }

  const expected = `${path.basename(file)}.map`;
  if (sourceMappingURL === expected) {
    matching += 1;
  } else {
    mismatching += 1;
    const exists = fs.existsSync(path.join(path.dirname(file), expected));
    console.log(
      `${path.basename(file)} -> ${sourceMappingURL} (${expected} exists: ${exists})`,
    );
  }
}

console.log({ matching, mismatching });
