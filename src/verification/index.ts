import * as github from './github';
import * as truffle from './truffle';
import * as rpc from './rpc';
import path from 'path';
import fs from 'fs';
import { verifyByteCode } from './verify';

interface ICodeVerification {
  contractAddress: string;
  solidityVersion: string;
  githubURL: string;
  chain: string;
}

export const codeVerification = async (hmy: ICodeVerification) => {
  const taskId = hmy.contractAddress;
  const directory = path.join(__dirname, '../', taskId);

  try {
    // todo validate address SDK hmy isAddress
    // todo validate if folder already exist

    console.log('New task', { taskId, directory });

    console.log('Getting actual bytecode from the blockchain...');
    const actualBytecode = await rpc.getSmartContractCode(
      hmy.chain,
      hmy.contractAddress
    );

    if (!actualBytecode || actualBytecode === '0x') {
      throw new Error(`No bytecode found for address ${hmy.contractAddress}`);
    }

    console.log('Cloning github...');
    try {
      await github.clone(hmy.githubURL, taskId);
      console.log('Creating truffle config...');
    } catch (e) {
      console.warn(e);
    }

    await truffle.createConfiguration(hmy.solidityVersion, directory);
    // await truffle.createMigration(directory, githubURL)
    console.log('Installing contract dependencies...');
    await truffle.installDependencies(directory);
    console.log('Compiling...');
    await truffle.compile(directory);
    console.log('Getting compiled bytecode');
    const { deployedBytecode, bytecode } = await truffle.getByteCode(
      hmy.githubURL,
      directory
    );

    console.log('Cleaning up...');
    const verified = verifyByteCode(
      actualBytecode,
      deployedBytecode,
      hmy.solidityVersion
    );

    if (verified) {
      const commitHash = await github.getCommitHash(directory);

      return {
        verified,
        commitHash,
      };
    }
  } catch (error) {
    return {
      verified: false,
      error,
    };
  }

  fs.rmdirSync(directory, { recursive: true });

  return {
    verified: false,
    error: 'No match',
  };
};
