require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
const goerliRpcUrl = process.env.GOERLI_RPC_URL
const goerliPrivateKey = process.env.GOERLI_PRIVATE_KEY
const etherscanApiKey = process.env.ETHERSCAN_API_KEY
const coinmarketcapApiKey = process.env.COINMARKETCAP_API_KEY

module.exports = {
    // solidity: "0.8.17",
    // 加入不同的 compile 版本
    solidity: {
        compilers: [{ version: "0.7.0" }, { version: "0.8.17" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        Goerli: {
            url: goerliRpcUrl,
            accounts: [goerliPrivateKey],
            chainId: 5,
            // 這邊定義 block confirmations, 這樣可以從 network.config 中拿來用
            blockConfirmations: 6,
            // 預設的 gas price 太低, 可能 transaction pending 太久, 這邊指定一個 avg gas price
            gasPrice: 50000000000,
        },
        local: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: etherscanApiKey,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: coinmarketcapApiKey,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}
