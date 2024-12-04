import { execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import fs from 'fs';
import anzip from 'anzip';

const componentName = 'ui';
const repoURL = 'https://github.com/HarperDB-Add-Ons/ecommerce-workshop-ui/archive/refs/heads/master.zip';

let tempDir;
const componentsDirectory = `${import.meta.dirname.split('node_modules')[0]}components/${componentName}`;

const downloadComponent = async() => {
  console.log('starting component download');
  const response = await fetch(repoURL)
  const stream = Readable.fromWeb(response.body)
  await writeFile(`component.zip`, stream);
  console.log('component download complete');
}

const unzipComponent = async() => {
  // unzip move and rename component
  console.log('starting component unzip');
  const result = await anzip(`component.zip`);
  console.log('component unzip complete');
  tempDir = result.files[0].directory;
  console.log(`component unzipped to ${tempDir}`);
  console.log('removing component archive');
  execSync(`rm component.zip`);
  console.log('component archive removal complete');
}

const moveComponent = async() => {
  console.log('starting component move');
  execSync(`mv ${tempDir} ${componentsDirectory}`);
  console.log('component move complete');
}

async function loadComponent() {
  await downloadComponent();
  await unzipComponent();
  await moveComponent();
}


console.log(componentsDirectory);

fs.access(componentsDirectory, fs.constants.F_OK, async (err) => {
  if (err) {
    console.log('target component does not exist. installing now.');
    await loadComponent();
  } else {
    console.error('component-loader: target directory already exists. aborting startup. delete this component to get rid of this message.');
  }
});
