#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

async function copyDirectory(source, target) {
    try {
        if (!fs.existsSync(target)) {
            await mkdir(target);
        }

        const files = await fs.promises.readdir(source);

        for (const file of files) {
            const sourcePath = path.join(source, file);
            const targetPath = path.join(target, file);

            const stat = await fs.promises.stat(sourcePath);
            if (stat.isDirectory()) {
                await copyDirectory(sourcePath, targetPath);
            } else {
                await copyFile(sourcePath, targetPath);
            }
        }
        console.log(`Copied directory ${source} to ${target}`);
    } catch (error) {
        console.error(`Error copying directory ${source}: ${error}`);
    }
}

const templatesPath = path.join(__dirname, 'templates');
const targetPath = process.cwd();

copyDirectory(templatesPath, targetPath)
    .then(() => console.log('Initialization complete.'))
    .catch((error) => console.error(`Initialization error: ${error}`));
