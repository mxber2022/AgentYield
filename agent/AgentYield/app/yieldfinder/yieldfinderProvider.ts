import { ActionProvider, WalletProvider, Network, CreateAction, EvmWalletProvider } from "@coinbase/agentkit";
import { z } from "zod";
//import { ethers } from "ethers";
import { encodeDeployData } from "viem";
// Define a schema with a message field for "Hello World"
export const HelloWorldActionSchema = z.object({
  message: z.string(), // Expecting a string message input
});

export const OnChainYieldExplanationSchema = z.object({});
export const BestYieldUSDCSchema = z.object({});
export const DeployTokenSchema = z.object({
    tokenName: z.string(),
    tokenSymbol: z.string(),
});

class HelloWorldActionProvider extends ActionProvider<WalletProvider> {
    constructor() {
        super("hello-world-action-provider", []);
    }

    // Define the Hello World action
    @CreateAction({
        name: "hello-world-action",
        description: "Returns a hello world message along with the wallet address when someone says hello",
        schema: HelloWorldActionSchema,  // Using the HelloWorldActionSchema
    })
    async helloWorldAction(walletProvider: WalletProvider, args: z.infer<typeof HelloWorldActionSchema>): Promise<string> {
        const address = await walletProvider.getAddress(); // Get wallet address
        return `Hello, ${args.message}! Your wallet address is ${address}.`;  // Return Hello World message and address
    }

     // Define the on-chain yield explanation action
     @CreateAction({
        name: "explain-on-chain-yield",
        description: "Returns an explanation about on-chain yield",
        schema: OnChainYieldExplanationSchema,  // Using the OnChainYieldExplanationSchema
    })
    async explainOnChainYield(): Promise<string> {
        return `This is by mx.On-chain yield refers to the returns that investors can earn directly on the blockchain by participating in various decentralized finance (DeFi) protocols. These returns can come from a variety of sources, such as lending, liquidity provision, staking, and farming.`;
    }

    
    @CreateAction({
        name: "get-best-yield-usdc",
        description: "Returns the best yield for USDC from various DeFi protocols",
        schema: BestYieldUSDCSchema,  // Using the BestYieldUSDCSchema
      })
      async getBestYieldUSDC(): Promise<string> {
        try {
          // Dummy yield data
          const yields = {
            'Aave': 5.6, // 5.6%
            'Compound': 4.3, // 4.3%
            'Yearn': 6.2, // 6.2%
          };
    
          // Find the best yield and its protocol
          let bestYield = 0;
          let bestProtocol = '';
          for (const [protocol, yieldValue] of Object.entries(yields)) {
            if (yieldValue > bestYield) {
              bestYield = yieldValue;
              bestProtocol = protocol;
            }
          }
    
          // Return the best yield and its protocol
          return `The best yield for USDC is ${bestYield}% from ${bestProtocol}`;
        } catch (error) {
          return `Error fetching best yield for USDC: ${error}`;
        }
      }

      //deploy erc20 contract 
      @CreateAction({
        name: "deploy-token",
        description: "Deploys an ERC20 token with a specified name and symbol",
        schema: DeployTokenSchema,
      })
      async deployToken(wallet: EvmWalletProvider, args: z.infer<typeof DeployTokenSchema>): Promise<string> {
        try {
            console.log("args.tokenName: ",args.tokenName);
            console.log("args.tokenSymbol: ",args.tokenSymbol);
            const deployData = encodeDeployData({
                abi: erc20ABI,
                bytecode: erc20bytecode,
                args: [args.tokenName, args.tokenSymbol],
            });
            
            const transactionRequest = {
                //from: "",  // Sender's address
                data: deployData as `0x${string}`,  // Encoded deployment data
                //gas: 5_000_000n,                   // You can estimate this value or adjust it based on your needs
            };

            const txHash = await wallet.sendTransaction(transactionRequest);

            // Wait for the transaction receipt (to confirm deployment)
            const receipt = await wallet.waitForTransactionReceipt(txHash);
    
            // Return the deployed contract address
            return `Token deployed with address: ${receipt.contractAddress}`;
        } catch (error) {
          return `Error deploying token: ${error}`;
        }
      }

    // Ensure this action supports all networks
    supportsNetwork = (network: Network) => true;
}

const erc20bytecode="0x608060405234801561000f575f5ffd5b5060405161189b38038061189b83398181016040528101906100319190610489565b81818160039081610042919061070f565b508060049081610052919061070f565b50505061008f3361006761009660201b60201c565b60ff16600a610076919061093a565b620f42406100849190610984565b61009e60201b60201c565b5050610aad565b5f6012905090565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361010e575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016101059190610a04565b60405180910390fd5b61011f5f838361012360201b60201c565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610173578060025f8282546101679190610a1d565b92505081905550610241565b5f5f5f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050818110156101fc578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016101f393929190610a5f565b60405180910390fd5b8181035f5f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610288578060025f82825403925050819055506102d2565b805f5f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161032f9190610a94565b60405180910390a3505050565b5f604051905090565b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61039b82610355565b810181811067ffffffffffffffff821117156103ba576103b9610365565b5b80604052505050565b5f6103cc61033c565b90506103d88282610392565b919050565b5f67ffffffffffffffff8211156103f7576103f6610365565b5b61040082610355565b9050602081019050919050565b8281835e5f83830152505050565b5f61042d610428846103dd565b6103c3565b90508281526020810184848401111561044957610448610351565b5b61045484828561040d565b509392505050565b5f82601f8301126104705761046f61034d565b5b815161048084826020860161041b565b91505092915050565b5f5f6040838503121561049f5761049e610345565b5b5f83015167ffffffffffffffff8111156104bc576104bb610349565b5b6104c88582860161045c565b925050602083015167ffffffffffffffff8111156104e9576104e8610349565b5b6104f58582860161045c565b9150509250929050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061054d57607f821691505b6020821081036105605761055f610509565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026105c27fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610587565b6105cc8683610587565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f61061061060b610606846105e4565b6105ed565b6105e4565b9050919050565b5f819050919050565b610629836105f6565b61063d61063582610617565b848454610593565b825550505050565b5f5f905090565b610654610645565b61065f818484610620565b505050565b5b81811015610682576106775f8261064c565b600181019050610665565b5050565b601f8211156106c75761069881610566565b6106a184610578565b810160208510156106b0578190505b6106c46106bc85610578565b830182610664565b50505b505050565b5f82821c905092915050565b5f6106e75f19846008026106cc565b1980831691505092915050565b5f6106ff83836106d8565b9150826002028217905092915050565b610718826104ff565b67ffffffffffffffff81111561073157610730610365565b5b61073b8254610536565b610746828285610686565b5f60209050601f831160018114610777575f8415610765578287015190505b61076f85826106f4565b8655506107d6565b601f19841661078586610566565b5f5b828110156107ac57848901518255600182019150602085019450602081019050610787565b868310156107c957848901516107c5601f8916826106d8565b8355505b6001600288020188555050505b505050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f8160011c9050919050565b5f5f8291508390505b60018511156108605780860481111561083c5761083b6107de565b5b600185161561084b5780820291505b80810290506108598561080b565b9450610820565b94509492505050565b5f826108785760019050610933565b81610885575f9050610933565b816001811461089b57600281146108a5576108d4565b6001915050610933565b60ff8411156108b7576108b66107de565b5b8360020a9150848211156108ce576108cd6107de565b5b50610933565b5060208310610133831016604e8410600b84101617156109095782820a905083811115610904576109036107de565b5b610933565b6109168484846001610817565b9250905081840481111561092d5761092c6107de565b5b81810290505b9392505050565b5f610944826105e4565b915061094f836105e4565b925061097c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484610869565b905092915050565b5f61098e826105e4565b9150610999836105e4565b92508282026109a7816105e4565b915082820484148315176109be576109bd6107de565b5b5092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6109ee826109c5565b9050919050565b6109fe816109e4565b82525050565b5f602082019050610a175f8301846109f5565b92915050565b5f610a27826105e4565b9150610a32836105e4565b9250828201905080821115610a4a57610a496107de565b5b92915050565b610a59816105e4565b82525050565b5f606082019050610a725f8301866109f5565b610a7f6020830185610a50565b610a8c6040830184610a50565b949350505050565b5f602082019050610aa75f830184610a50565b92915050565b610de180610aba5f395ff3fe608060405234801561000f575f5ffd5b5060043610610091575f3560e01c8063313ce56711610064578063313ce5671461013157806370a082311461014f57806395d89b411461017f578063a9059cbb1461019d578063dd62ed3e146101cd57610091565b806306fdde0314610095578063095ea7b3146100b357806318160ddd146100e357806323b872dd14610101575b5f5ffd5b61009d6101fd565b6040516100aa9190610a5a565b60405180910390f35b6100cd60048036038101906100c89190610b0b565b61028d565b6040516100da9190610b63565b60405180910390f35b6100eb6102af565b6040516100f89190610b8b565b60405180910390f35b61011b60048036038101906101169190610ba4565b6102b8565b6040516101289190610b63565b60405180910390f35b6101396102e6565b6040516101469190610c0f565b60405180910390f35b61016960048036038101906101649190610c28565b6102ee565b6040516101769190610b8b565b60405180910390f35b610187610333565b6040516101949190610a5a565b60405180910390f35b6101b760048036038101906101b29190610b0b565b6103c3565b6040516101c49190610b63565b60405180910390f35b6101e760048036038101906101e29190610c53565b6103e5565b6040516101f49190610b8b565b60405180910390f35b60606003805461020c90610cbe565b80601f016020809104026020016040519081016040528092919081815260200182805461023890610cbe565b80156102835780601f1061025a57610100808354040283529160200191610283565b820191905f5260205f20905b81548152906001019060200180831161026657829003601f168201915b5050505050905090565b5f5f610297610467565b90506102a481858561046e565b600191505092915050565b5f600254905090565b5f5f6102c2610467565b90506102cf858285610480565b6102da858585610512565b60019150509392505050565b5f6012905090565b5f5f5f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b60606004805461034290610cbe565b80601f016020809104026020016040519081016040528092919081815260200182805461036e90610cbe565b80156103b95780601f10610390576101008083540402835291602001916103b9565b820191905f5260205f20905b81548152906001019060200180831161039c57829003601f168201915b5050505050905090565b5f5f6103cd610467565b90506103da818585610512565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b5f33905090565b61047b8383836001610602565b505050565b5f61048b84846103e5565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461050c57818110156104fd578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016104f493929190610cfd565b60405180910390fd5b61050b84848484035f610602565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610582575f6040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016105799190610d32565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036105f2575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016105e99190610d32565b60405180910390fd5b6105fd8383836107d1565b505050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610672575f6040517fe602df050000000000000000000000000000000000000000000000000000000081526004016106699190610d32565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036106e2575f6040517f94280d620000000000000000000000000000000000000000000000000000000081526004016106d99190610d32565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f208190555080156107cb578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516107c29190610b8b565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610821578060025f8282546108159190610d78565b925050819055506108ef565b5f5f5f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050818110156108aa578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016108a193929190610cfd565b60405180910390fd5b8181035f5f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610936578060025f8282540392505081905550610980565b805f5f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516109dd9190610b8b565b60405180910390a3505050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f610a2c826109ea565b610a3681856109f4565b9350610a46818560208601610a04565b610a4f81610a12565b840191505092915050565b5f6020820190508181035f830152610a728184610a22565b905092915050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610aa782610a7e565b9050919050565b610ab781610a9d565b8114610ac1575f5ffd5b50565b5f81359050610ad281610aae565b92915050565b5f819050919050565b610aea81610ad8565b8114610af4575f5ffd5b50565b5f81359050610b0581610ae1565b92915050565b5f5f60408385031215610b2157610b20610a7a565b5b5f610b2e85828601610ac4565b9250506020610b3f85828601610af7565b9150509250929050565b5f8115159050919050565b610b5d81610b49565b82525050565b5f602082019050610b765f830184610b54565b92915050565b610b8581610ad8565b82525050565b5f602082019050610b9e5f830184610b7c565b92915050565b5f5f5f60608486031215610bbb57610bba610a7a565b5b5f610bc886828701610ac4565b9350506020610bd986828701610ac4565b9250506040610bea86828701610af7565b9150509250925092565b5f60ff82169050919050565b610c0981610bf4565b82525050565b5f602082019050610c225f830184610c00565b92915050565b5f60208284031215610c3d57610c3c610a7a565b5b5f610c4a84828501610ac4565b91505092915050565b5f5f60408385031215610c6957610c68610a7a565b5b5f610c7685828601610ac4565b9250506020610c8785828601610ac4565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680610cd557607f821691505b602082108103610ce857610ce7610c91565b5b50919050565b610cf781610a9d565b82525050565b5f606082019050610d105f830186610cee565b610d1d6020830185610b7c565b610d2a6040830184610b7c565b949350505050565b5f602082019050610d455f830184610cee565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610d8282610ad8565b9150610d8d83610ad8565b9250828201905080821115610da557610da4610d4b565b5b9291505056fea264697066735822122084415dd12212954a9c8a03c7b46970d2f76bb1884222116a26d295e9b3e9d91464736f6c634300081c0033"
const erc20ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
// Export a function to create an instance of HelloWorldActionProvider
export const helloWorldActionProvider = () => new HelloWorldActionProvider();
