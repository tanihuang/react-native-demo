import path from 'path';
import fs from 'fs';
import solc from 'solc';

const inboxPath = path.resolve(__dirname, 'components', 'contracts', 'inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'inbox.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};
  
// 3. 編譯（這是新版正確方式）
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
  throw new Error('❌ 編譯失敗，請修正上方錯誤');
}

// 4. 輸出結果
for (let contractName in output.contracts['inbox.sol']) {
  const contract = output.contracts['inbox.sol'][contractName];
  console.log('✅ Contract:', contractName);
  console.log('📦 ABI:', JSON.stringify(contract.abi, null, 2)); // 跟合約互動
  console.log('🧱 Bytecode:', contract.evm.bytecode.object); // 部署合約
}

module.exports = solc.compile(source, 1).contracts[':In']

beforeEach(async() => {
  accounts = await web3ProvidersMapUpdated.eth.getAccounts();
});

// 編譯合約
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// 取得編譯結果（這裡假設你只需要 Inbox 合約）
const contract = output.contracts['Inbox.sol']['Inbox'];

// 匯出 ABI（interface）和 bytecode
export const interface = JSON.stringify(contract.abi);
export const bytecode = contract.evm.bytecode.object;
