import "@nomiclabs/hardhat-waffle";
import {config} from "dotenv";
config();

const {MNEMONIC} = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.1",
  networks: {
    bscTestnet:{
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: {
        mnemonic: MNEMONIC
      }
    },
    bscMainnet:{
      url: "https://bsc-dataseed.binance.org",
      chainId: 56
    }
  }
};
