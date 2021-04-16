const byteCodeStartBefore422 = '6060604052';
const byteCodeStartAfter422 = '6080604052';
const byteCodeEnd417 = 'a165627a7a72305820'; // "60x0604052" + whiskey_hash + "a165627a7a72305820" + ?_hash + 0029

const byteCodeStartBefore510 = 'a265627a7a72305820'; // “a265627a7a72305820” + whisper_hash + “64736f6c6343” + compiler_version + “0032”
const byteCodeStartAfter511 = 'a265627a7a72315820'; // “a265627a7a72315820” + whisper_hash + “64736f6c6343” + compiler_version + “0032”
const byteCodeEnd5xx = '64736f6c6343';

// https://www.badykov.com/ethereum/2019/08/22/solidity-bytecode-metadata/
// https://www.shawntabrizi.com/ethereum/verify-ethereum-contracts-using-web3-js-and-solc/
export const verifyByteCode = (
  compiledByteCode: string,
  actualByteCode: string,
  solidityVersion: string
) => {
  const t = trimByteCode(solidityVersion);
  return t(compiledByteCode) === t(actualByteCode);
};

const trimByteCode = (solidityVersion: string) => (byteCode: string) => {
  // solidityVersion = 0.1.2 0.4.17
  const solidityMinorVersion = +solidityVersion.split('.')[1];
  const solidityPatchVersion = +solidityVersion.split('.')[2];

  try {
    let byteCodeStart: string, byteCodeEnd: string;
    if (solidityMinorVersion == 4) {
      if (solidityPatchVersion >= 22) {
        byteCodeStart = byteCodeStartAfter422;
      } else if (solidityPatchVersion >= 7 && solidityPatchVersion < 22) {
        byteCodeStart = byteCodeStartBefore422;
      }
      byteCodeEnd = byteCodeEnd417;
    }

    if (solidityMinorVersion >= 5) {
      if (solidityPatchVersion <= 10) {
        byteCodeStart = byteCodeStartBefore510;
      } else if (solidityPatchVersion >= 11) {
        byteCodeStart = byteCodeStartAfter511;
      }
      byteCodeEnd = byteCodeEnd5xx;
    }

    console.log(
      'whiskey_hash: ',
      byteCode.slice(
        byteCode.lastIndexOf(byteCodeStart),
        byteCode.search(byteCodeEnd)
      )
    );

    // find whiskey_hash
    return byteCode.slice(
      byteCode.lastIndexOf(byteCodeStart),
      byteCode.search(byteCodeEnd)
    );
  } catch (e) {
    throw new Error('Cant trim bytecode by starting pointer and meta section');
  }
};
