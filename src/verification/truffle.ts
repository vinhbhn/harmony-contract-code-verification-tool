import fs from 'fs';
import path from 'path';

import { execSync } from 'child_process';

const truffleConfig = (value: string) => {
  return `module.exports = {
  compilers: {
    solc: {
      version: "${value}",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
`;
};

export const createConfiguration = async (
  solidityVersion: string,
  directory: string
) => {
  if (!solidityVersion) {
    throw new Error('No Solidity version specified');
  }
  console.log(path.join(path.resolve(directory), 'truffle-config.js'));
  const config = truffleConfig(solidityVersion);
  fs.writeFileSync(
    path.join(path.resolve(directory), 'truffle-config.js'),
    config
  );
};

export const installDependencies = async (directory: string) => {
  execSync(`cd ${directory} && yarn`);
};

export const compile = async (directory: string) => {
  execSync(`cd ${directory} && truffle compile`);
};

const renameFile = (filename: any, inExtension: any, outExtension: any) => {
  return filename.split(inExtension)[0] + outExtension;
};

const getFileName = (githubUrl: string) => {
  const parts = githubUrl.split('/');
  return parts[parts.length - 1];
};

export const getByteCode = async (githubUrl: string, directory: string) => {
  const fileName = getFileName(githubUrl);
  const abiFileName = renameFile(fileName, 'sol', 'json');

  const dir = path.join(directory, 'build', 'contracts', abiFileName);

  const data = fs.readFileSync(dir).toString();

  const { deployedBytecode, bytecode } = JSON.parse(data);
  return { deployedBytecode, bytecode };
};
