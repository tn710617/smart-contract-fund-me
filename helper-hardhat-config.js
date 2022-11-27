const networkConfig = {
    5: {
        name: "Goerli",
        ethUsdPriceFeedAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    137: {
        name: "Polygon",
        ethUsdPriceFeedAddress: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",
    },
}

const developmentChainIds = [31337]

const decimal = 8
const initialAnswer = 2000

module.exports = {
    networkConfig,
    developmentChainIds,
    decimal,
    initialAnswer,
}
