const { network } = require("hardhat")
const {
    developmentChainIds,
    decimal,
    initialAnswer,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // 如果是 local chain, 則部署 mock aggregator
    if (developmentChainIds.includes(chainId)) {
        log("Local network detected! Deploy mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [decimal, initialAnswer],
        })
        log("Mocks deployed")
        log("----------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
