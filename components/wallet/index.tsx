import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import {
  createWalletClient,
  custom,
  getContract,
} from 'viem';
import { sepolia } from 'viem/chains';
import { writeContract } from 'viem/actions';
import { showAlert } from '@/components/dialog/AlertDialog';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Wallet() {
  const [mood, setMood] = useState('');
  const [displayMood, setDisplayMood] = useState('');
  const [address, setAddress] = useState<string | null>(null);
  const [walletClient, setWalletClient] = useState<any>(null);
  const [contractInstance, setContractInstance] = useState<any>(null);
  console.log('walletClient', walletClient);

  // ✅ 合約地址與 ABI
  const MoodContractAddress = '0x4D3e06D7803453464a4fcDD63Acb7F7c9F573E71';
  const MoodContractABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_mood",
          "type": "string"
        }
      ],
      "name": "setMood",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMood",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // ✅ 自動連接 MetaMask
  const autoConnectWallet = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) return;

      const userAddress = accounts[0];

      const client = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });

      const contract = getContract({
        address: MoodContractAddress,
        abi: MoodContractABI,
        client,
      });

      setAddress(userAddress);
      setWalletClient(client);
      setContractInstance(contract);

      showAlert('success', 'Auto-connected wallet successfully');
    } catch (error) {
      console.error('Auto-connect failed', error);
    }
  };

  // ✅ 手動連接錢包
  const connectWallet = async () => {
    if (!window.ethereum) {
      showAlert('error', 'Please install MetaMask');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const userAddress = accounts[0];

      const client = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });

      const contract = getContract({
        address: MoodContractAddress,
        abi: MoodContractABI,
        client,
      });

      setAddress(userAddress);
      setWalletClient(client);
      setContractInstance(contract);

      showAlert('success', 'Wallet connected successfully');
    } catch (error) {
      console.error(error);
      showAlert('error', 'Wallet connection failed');
    }
  };

  // ✅ 寫入心情
  const setMoodOnChain = async () => {
    if (!walletClient || !address) {
      showAlert('error', 'Wallet not connected');
      return;
    }

    try {
      await walletClient.writeContract(walletClient, {
        address: MoodContractAddress, //合約
        abi: MoodContractABI,
        functionName: 'setMood',
        args: [mood],
        account: address,
      });
      showAlert('success', 'Transaction submitted');
    } catch (error) {
      console.error(error);
      showAlert('error', 'Transaction failed');
    }
  };

  // ✅ 讀取鏈上心情
  const getMood = async () => {
    if (!contractInstance) return showAlert('error', 'Wallet not connected');

    try {
      const result = await contractInstance.read.getMood();
      setDisplayMood(result);
    } catch (error) {
      console.error(error);
      showAlert('error', 'Read failed');
    }
  };

  useEffect(() => {
    autoConnectWallet();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Mood dApp</Text>

      <TouchableOpacity style={styles.button} onPress={connectWallet}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>

      {address && <Text style={styles.info}>Account Connected：{address}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Please enter your mood"
        placeholderTextColor="#fff6"
        value={mood}
        onChangeText={setMood}
      />

      <TouchableOpacity style={styles.button} onPress={setMoodOnChain}>
        <Text style={styles.buttonText}>Set Mood</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={getMood}>
        <Text style={styles.buttonText}>Get Mood</Text>
      </TouchableOpacity>

      {displayMood !== '' && (
        <Text style={styles.result}>On-chain Mood：{displayMood}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0e0e0e',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4e8ef7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
  },
  info: {
    marginVertical: 10,
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
  },
});
