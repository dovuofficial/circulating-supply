
const Web3 = require('web3')

let infura = "https://mainnet.infura.io/v3/5bfe532ce9734ef68ad3f78516ba16c6";
let tokenAddress = "0xac3211a5025414af2866ff09c23fc18bc97e79b1";
let wallets = [
    "0x99049e81104dba57388cb7b537baf2ac02997fd6",
    "0x03f5af8ac2b7ed324ecf9f89de57dfa4b1dc4748",
    "0x3c8ebc5860f444dc56497d4ab8dbe4bb34ae75ca",
    "0xf63d7a69fba2ca64205eecad5934da9c6771c7f2",
    "0x566540c687f71598d2f60da5fae1473433875110",
    "0x50f43da78bd37fffa4669ecdd67e5fed1b152087",
    "0x61194ec8fa87cc5d325e81465294cc13a6b5b0fd",
    "0x43F2c9F056f81433BDF63EF53eAf472e5FdbeA08",
    "0xABb6819fC05a2CC5C1ED0539A4B00766186C709E",
    "0x2304DaB8461f2023346D0722DE4A4c53BD938580",
    "0x4912a84afa656cDbaE9B173E22df2decA9954ce9", // 1Inch Pool
    "0xEcF44C26a5bB34298c87E5E6b97bb6c4A4919d8f", // Developer grants
    "0x877FDf60024EA3bEF114092a4aBC0B4d26E2aC23", // LP Pool
    "0x08d97ff3af73da88021a4693e50002cc7856b773", // LP Pool
    "0x13eaa8e6da06053c3cd609e179bee237c8cc100c", // Rewards factory contract
    "0x29Da98679d401ED8FC7474D192c04DB3e3c49695"  // ETH rewards contract
];

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {

    const web3 = new Web3(infura)

    // The minimum ABI to get ERC20 Token balance
    let minABI = [
        // balanceOf
        {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
        },
        // decimals
        {
        "constant":true,
        "inputs":[],
        "name":"decimals",
        "outputs":[{"name":"","type":"uint8"}],
        "type":"function"
        }
    ];

    let contract = new web3.eth.Contract(minABI,tokenAddress);

    async function getBalance() {
        let balance = 1000000000;

        for (var i = 0; i < wallets.length; i++) {
            balance -= Web3.utils.fromWei((await contract.methods.balanceOf(wallets[i]).call()).toString());
        }

        return balance;
    }

    response = {
        'statusCode': 200,
        'body': (await getBalance()).toString()
    }

    return response
};
