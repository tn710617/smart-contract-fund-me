// 當 hardhat deploy 在執行 deploy script 時, 會預設帶入
// hre, 所以這邊縮寫, 直接取得 hre 的兩個 props
const { verify } = require("../utils/verify")

const { network } = require("hardhat")
const {
    networkConfig,
    developmentChainIds,
} = require("../helper-hardhat-config")

// hre 為 hardhat runtime environment
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress

    if (developmentChainIds.includes(chainId)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress =
            networkConfig[chainId]["ethUsdPriceFeedAddress"]
    }

    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // 如果不是 local chain 的話, 那就執行 verify Etherscan contract
    if (
        !developmentChainIds.includes(chainId) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
}

module.exports.tags = ["all", "fundme"]
