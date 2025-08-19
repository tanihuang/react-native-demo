// 開啟 ES 模組支援（需搭配 package.json 的 "type": "module"）
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { interface as abi, bytecode } from './compile.js'; // 引入 ABI 和 bytecode

// 設定部署所需的變數：助記詞和 Infura 節點網址
const mnemonic = 'REPLACE_WITH_YOUR_MNEMONIC'; // 你的助記詞（Mnemonic Phrase）
const infuraUrl = 'REPLACE_WITH_YOUR_INFURA_URL'; // 例如 Goerli 的 Infura URL

// 建立 HDWalletProvider 實例，負責私鑰簽署與連接區塊鏈
const provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonic,
  },
  providerOrUrl: infuraUrl,
});

// 使用 Web3 實例與以太坊網路互動
const web3 = new Web3(provider);

// 定義一個異步函式來部署合約
const deploy = async () => {
  // 取得從助記詞產生的帳戶（預設為第 0 個）
  const accounts = await web3.eth.getAccounts();

  console.log('正在使用帳戶部署合約:', accounts[0]);

  // 部署合約
  const result = await new web3.eth.Contract(JSON.parse(abi)) // 傳入 ABI 建立合約實例
    .deploy({
      data: bytecode,           // 合約的 bytecode（機器碼）
      arguments: ['Hi there!'], // 建構函式的參數（如果有）
    })
    .send({
      from: accounts[0], // 指定發送交易的帳戶
      gas: '1000000',    // 預估的 Gas 限額
    });

  // 印出合約部署成功的地址
  console.log('合約部署成功，地址為:', result.options.address);

  // 停止 Provider（否則 Node.js 程式不會結束）
  provider.engine.stop();
};

// 執行部署函式
deploy();
