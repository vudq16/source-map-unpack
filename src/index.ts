#!/usr/bin/env node
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as chalk from 'chalk';
import * as minimist from 'minimist';
import { SourceMapConsumer } from 'source-map';
import * as path from 'path';

const unpack = (pathToProject: string, pathToMap: string) => {
  try {
    const mapFile = fs.readFileSync(pathToMap, 'utf8');
    console.log(chalk.green(`[+] Unpacking source map: ${pathToMap}`));
    SourceMapConsumer.with(mapFile, null, (consumer: SourceMapConsumer) => {
      const sources = (consumer as any).sources;
      sources.forEach((source: string) => {
        const WEBPACK_SUBSTRING_INDEX = 11;
        const content = consumer.sourceContentFor(source) as string;
        const filePath = path.resolve(
          process.cwd(),
          `${pathToProject}/${source.substring(WEBPACK_SUBSTRING_INDEX)}`,
        );
        try {
          mkdirp.sync(path.dirname(filePath));
        } catch (e) {}
        fs.writeFileSync(filePath, content);
      });
    });
  } catch (err) {
    console.log(chalk.red('[!] Something is wrong with the source map'));
    // console.log('\n', err);
    // process.exit(1);
  }
};

const argv = minimist(process.argv.slice(2));
const mapInput = argv._[0];
const projectNameInput = argv._[1];

if (!projectNameInput || !mapInput) {
  console.log();
  console.log(
    chalk.white('Usage: unpack'),
    chalk.green('<map-files-dir> <project-dir>'),
  );
  console.log();
  console.log(
    chalk.blue(
      '*Note:   Minified file should be placed under path specified in .map file.',
    ),
  );
  console.log();
  process.exit();
}

const pathToProject = path.resolve(process.cwd(), projectNameInput);
const pathToMapsDir = path.isAbsolute(mapInput)
  ? mapInput
  : path.resolve(process.cwd(), mapInput);

const stack: string[] = [pathToMapsDir];

while (stack.length > 0) {
  const currentDir = stack.pop()!;
  const files = fs.readdirSync(currentDir);

  for (const file of files) {
    const filePath = path.resolve(currentDir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      stack.push(filePath);
    } else {
      if (file.endsWith('.map')) {
        // console.log(filePath);
        unpack(pathToProject, filePath);
      }
    }
  }
}
