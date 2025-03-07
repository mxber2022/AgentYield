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

      //deploy erc 721 

      // ... existing code ...

@CreateAction({
    name: "deploy-erc721-token",
    description: "Deploys an ERC721 token with a specified name and symbol",
    schema: DeployTokenSchema,
  })
  async deployERC721Token(wallet: EvmWalletProvider, args: z.infer<typeof DeployTokenSchema>): Promise<string> {
    try {
      console.log("args.tokenName: ",args.tokenName);
      console.log("args.tokenSymbol: ",args.tokenSymbol);
      const deployData = encodeDeployData({
        abi: erc721ABI, // Make sure to replace this with the ABI of your final ERC721 token contract
        bytecode: erc721bytecode, // Make sure to replace this with the bytecode of your final ERC721 token contract
        args: [args.tokenName, args.tokenSymbol, "0x0cCEb44dbbAF7dE58D8D0e12c93cbE553f0d6Ebf"],
      });
  
      const transactionRequest = {
        data: deployData as `0x${string}`,
      };
  
      const txHash = await wallet.sendTransaction(transactionRequest);
  
      // Wait for the transaction receipt (to confirm deployment)
      const receipt = await wallet.waitForTransactionReceipt(txHash);
  
      // Return the deployed contract address
      return `ERC721 Token deployed with address: ${receipt.contractAddress}`;
    } catch (error) {
      return `Error deploying ERC721 token: ${error}`;
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

const erc721ABI= [
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
			},
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
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
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
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
		"name": "ERC721InvalidReceiver",
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
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
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
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
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
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
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
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
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
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
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
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"name": "safeMint",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
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
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
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
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
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
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const erc721bytecode="0x608060405234801561000f575f5ffd5b50604051612c98380380612c9883398181016040528101906100319190610347565b808383815f908161004291906105df565b50806001908161005291906105df565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100c5575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016100bc91906106bd565b60405180910390fd5b6100d4816100dd60201b60201c565b505050506106d6565b5f60075f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160075f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f604051905090565b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6101ff826101b9565b810181811067ffffffffffffffff8211171561021e5761021d6101c9565b5b80604052505050565b5f6102306101a0565b905061023c82826101f6565b919050565b5f67ffffffffffffffff82111561025b5761025a6101c9565b5b610264826101b9565b9050602081019050919050565b8281835e5f83830152505050565b5f61029161028c84610241565b610227565b9050828152602081018484840111156102ad576102ac6101b5565b5b6102b8848285610271565b509392505050565b5f82601f8301126102d4576102d36101b1565b5b81516102e484826020860161027f565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610316826102ed565b9050919050565b6103268161030c565b8114610330575f5ffd5b50565b5f815190506103418161031d565b92915050565b5f5f5f6060848603121561035e5761035d6101a9565b5b5f84015167ffffffffffffffff81111561037b5761037a6101ad565b5b610387868287016102c0565b935050602084015167ffffffffffffffff8111156103a8576103a76101ad565b5b6103b4868287016102c0565b92505060406103c586828701610333565b9150509250925092565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061041d57607f821691505b6020821081036104305761042f6103d9565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026104927fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610457565b61049c8683610457565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f6104e06104db6104d6846104b4565b6104bd565b6104b4565b9050919050565b5f819050919050565b6104f9836104c6565b61050d610505826104e7565b848454610463565b825550505050565b5f5f905090565b610524610515565b61052f8184846104f0565b505050565b5b81811015610552576105475f8261051c565b600181019050610535565b5050565b601f8211156105975761056881610436565b61057184610448565b81016020851015610580578190505b61059461058c85610448565b830182610534565b50505b505050565b5f82821c905092915050565b5f6105b75f198460080261059c565b1980831691505092915050565b5f6105cf83836105a8565b9150826002028217905092915050565b6105e8826103cf565b67ffffffffffffffff811115610601576106006101c9565b5b61060b8254610406565b610616828285610556565b5f60209050601f831160018114610647575f8415610635578287015190505b61063f85826105c4565b8655506106a6565b601f19841661065586610436565b5f5b8281101561067c57848901518255600182019150602085019450602081019050610657565b868310156106995784890151610695601f8916826105a8565b8355505b6001600288020188555050505b505050505050565b6106b78161030c565b82525050565b5f6020820190506106d05f8301846106ae565b92915050565b6125b5806106e35f395ff3fe608060405234801561000f575f5ffd5b5060043610610109575f3560e01c8063715018a6116100a0578063b88d4fde1161006f578063b88d4fde146102a1578063c87b56dd146102bd578063d204c45e146102ed578063e985e9c51461031d578063f2fde38b1461034d57610109565b8063715018a61461023f5780638da5cb5b1461024957806395d89b4114610267578063a22cb4651461028557610109565b806323b872dd116100dc57806323b872dd146101a757806342842e0e146101c35780636352211e146101df57806370a082311461020f57610109565b806301ffc9a71461010d57806306fdde031461013d578063081812fc1461015b578063095ea7b31461018b575b5f5ffd5b61012760048036038101906101229190611a85565b610369565b6040516101349190611aca565b60405180910390f35b61014561037a565b6040516101529190611b53565b60405180910390f35b61017560048036038101906101709190611ba6565b610409565b6040516101829190611c10565b60405180910390f35b6101a560048036038101906101a09190611c53565b610424565b005b6101c160048036038101906101bc9190611c91565b61043a565b005b6101dd60048036038101906101d89190611c91565b610539565b005b6101f960048036038101906101f49190611ba6565b610558565b6040516102069190611c10565b60405180910390f35b61022960048036038101906102249190611ce1565b610569565b6040516102369190611d1b565b60405180910390f35b61024761061f565b005b610251610632565b60405161025e9190611c10565b60405180910390f35b61026f61065a565b60405161027c9190611b53565b60405180910390f35b61029f600480360381019061029a9190611d5e565b6106ea565b005b6102bb60048036038101906102b69190611ec8565b610700565b005b6102d760048036038101906102d29190611ba6565b610725565b6040516102e49190611b53565b60405180910390f35b61030760048036038101906103029190611fe6565b610737565b6040516103149190611d1b565b60405180910390f35b61033760048036038101906103329190612040565b610777565b6040516103449190611aca565b60405180910390f35b61036760048036038101906103629190611ce1565b610805565b005b5f61037382610889565b9050919050565b60605f8054610388906120ab565b80601f01602080910402602001604051908101604052809291908181526020018280546103b4906120ab565b80156103ff5780601f106103d6576101008083540402835291602001916103ff565b820191905f5260205f20905b8154815290600101906020018083116103e257829003601f168201915b5050505050905090565b5f610413826108e9565b5061041d8261096f565b9050919050565b61043682826104316109a8565b6109af565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036104aa575f6040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016104a19190611c10565b60405180910390fd5b5f6104bd83836104b86109a8565b6109c1565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610533578382826040517f64283d7b00000000000000000000000000000000000000000000000000000000815260040161052a939291906120db565b60405180910390fd5b50505050565b61055383838360405180602001604052805f815250610700565b505050565b5f610562826108e9565b9050919050565b5f5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036105da575f6040517f89c62b640000000000000000000000000000000000000000000000000000000081526004016105d19190611c10565b60405180910390fd5b60035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b610627610bcc565b6106305f610c53565b565b5f60075f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606060018054610669906120ab565b80601f0160208091040260200160405190810160405280929190818152602001828054610695906120ab565b80156106e05780601f106106b7576101008083540402835291602001916106e0565b820191905f5260205f20905b8154815290600101906020018083116106c357829003601f168201915b5050505050905090565b6106fc6106f56109a8565b8383610d16565b5050565b61070b84848461043a565b61071f6107166109a8565b85858585610e7f565b50505050565b60606107308261102b565b9050919050565b5f610740610bcc565b5f60085f8154809291906107539061213d565b9190505590506107638482611136565b61076d8184611153565b8091505092915050565b5f60055f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b61080d610bcc565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361087d575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016108749190611c10565b60405180910390fd5b61088681610c53565b50565b5f634906490660e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806108e257506108e1826111ad565b5b9050919050565b5f5f6108f48361128e565b90505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361096657826040517f7e27328900000000000000000000000000000000000000000000000000000000815260040161095d9190611d1b565b60405180910390fd5b80915050919050565b5f60045f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b5f33905090565b6109bc83838360016112c7565b505050565b5f5f6109cc8461128e565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614610a0d57610a0c818486611486565b5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610a9857610a4c5f855f5f6112c7565b600160035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825403925050819055505b5f73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610b1757600160035f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8460025f8681526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b610bd46109a8565b73ffffffffffffffffffffffffffffffffffffffff16610bf2610632565b73ffffffffffffffffffffffffffffffffffffffff1614610c5157610c156109a8565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401610c489190611c10565b60405180910390fd5b565b5f60075f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160075f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d8657816040517f5b08ba18000000000000000000000000000000000000000000000000000000008152600401610d7d9190611c10565b60405180910390fd5b8060055f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610e729190611aca565b60405180910390a3505050565b5f8373ffffffffffffffffffffffffffffffffffffffff163b1115611024578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02868685856040518563ffffffff1660e01b8152600401610edd94939291906121d6565b6020604051808303815f875af1925050508015610f1857506040513d601f19601f82011682018060405250810190610f159190612234565b60015b610f99573d805f8114610f46576040519150601f19603f3d011682016040523d82523d5f602084013e610f4b565b606091505b505f815103610f9157836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610f889190611c10565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461102257836040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016110199190611c10565b60405180910390fd5b505b5050505050565b6060611036826108e9565b505f60065f8481526020019081526020015f208054611054906120ab565b80601f0160208091040260200160405190810160405280929190818152602001828054611080906120ab565b80156110cb5780601f106110a2576101008083540402835291602001916110cb565b820191905f5260205f20905b8154815290600101906020018083116110ae57829003601f168201915b505050505090505f6110db611549565b90505f8151036110ef578192505050611131565b5f8251111561112357808260405160200161110b929190612299565b60405160208183030381529060405292505050611131565b61112c8461155f565b925050505b919050565b61114f828260405180602001604052805f8152506115c5565b5050565b8060065f8481526020019081526020015f209081611171919061245c565b507ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7826040516111a19190611d1b565b60405180910390a15050565b5f7f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061127757507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806112875750611286826115e8565b5b9050919050565b5f60025f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b80806112ff57505f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b15611431575f61130e846108e9565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561137857508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b801561138b57506113898184610777565b155b156113cd57826040517fa9fbf51f0000000000000000000000000000000000000000000000000000000081526004016113c49190611c10565b60405180910390fd5b811561142f57838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b8360045f8581526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b611491838383611651565b611544575f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361150557806040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016114fc9190611d1b565b60405180910390fd5b81816040517f177e802f00000000000000000000000000000000000000000000000000000000815260040161153b92919061252b565b60405180910390fd5b505050565b606060405180602001604052805f815250905090565b606061156a826108e9565b505f611574611549565b90505f8151116115925760405180602001604052805f8152506115bd565b8061159c84611711565b6040516020016115ad929190612299565b6040516020818303038152906040525b915050919050565b6115cf83836117db565b6115e36115da6109a8565b5f858585610e7f565b505050565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561170857508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806116c957506116c88484610777565b5b8061170757508273ffffffffffffffffffffffffffffffffffffffff166116ef8361096f565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b60605f600161171f846118ce565b0190505f8167ffffffffffffffff81111561173d5761173c611da4565b5b6040519080825280601f01601f19166020018201604052801561176f5781602001600182028036833780820191505090505b5090505f82602001820190505b6001156117d0578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a85816117c5576117c4612552565b5b0494505f850361177c575b819350505050919050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361184b575f6040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016118429190611c10565b60405180910390fd5b5f61185783835f6109c1565b90505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146118c9575f6040517f73c6ac6e0000000000000000000000000000000000000000000000000000000081526004016118c09190611c10565b60405180910390fd5b505050565b5f5f5f90507a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000831061192a577a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000083816119205761191f612552565b5b0492506040810190505b6d04ee2d6d415b85acef81000000008310611967576d04ee2d6d415b85acef8100000000838161195d5761195c612552565b5b0492506020810190505b662386f26fc10000831061199657662386f26fc10000838161198c5761198b612552565b5b0492506010810190505b6305f5e10083106119bf576305f5e10083816119b5576119b4612552565b5b0492506008810190505b61271083106119e45761271083816119da576119d9612552565b5b0492506004810190505b60648310611a0757606483816119fd576119fc612552565b5b0492506002810190505b600a8310611a16576001810190505b80915050919050565b5f604051905090565b5f5ffd5b5f5ffd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611a6481611a30565b8114611a6e575f5ffd5b50565b5f81359050611a7f81611a5b565b92915050565b5f60208284031215611a9a57611a99611a28565b5b5f611aa784828501611a71565b91505092915050565b5f8115159050919050565b611ac481611ab0565b82525050565b5f602082019050611add5f830184611abb565b92915050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f611b2582611ae3565b611b2f8185611aed565b9350611b3f818560208601611afd565b611b4881611b0b565b840191505092915050565b5f6020820190508181035f830152611b6b8184611b1b565b905092915050565b5f819050919050565b611b8581611b73565b8114611b8f575f5ffd5b50565b5f81359050611ba081611b7c565b92915050565b5f60208284031215611bbb57611bba611a28565b5b5f611bc884828501611b92565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f611bfa82611bd1565b9050919050565b611c0a81611bf0565b82525050565b5f602082019050611c235f830184611c01565b92915050565b611c3281611bf0565b8114611c3c575f5ffd5b50565b5f81359050611c4d81611c29565b92915050565b5f5f60408385031215611c6957611c68611a28565b5b5f611c7685828601611c3f565b9250506020611c8785828601611b92565b9150509250929050565b5f5f5f60608486031215611ca857611ca7611a28565b5b5f611cb586828701611c3f565b9350506020611cc686828701611c3f565b9250506040611cd786828701611b92565b9150509250925092565b5f60208284031215611cf657611cf5611a28565b5b5f611d0384828501611c3f565b91505092915050565b611d1581611b73565b82525050565b5f602082019050611d2e5f830184611d0c565b92915050565b611d3d81611ab0565b8114611d47575f5ffd5b50565b5f81359050611d5881611d34565b92915050565b5f5f60408385031215611d7457611d73611a28565b5b5f611d8185828601611c3f565b9250506020611d9285828601611d4a565b9150509250929050565b5f5ffd5b5f5ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b611dda82611b0b565b810181811067ffffffffffffffff82111715611df957611df8611da4565b5b80604052505050565b5f611e0b611a1f565b9050611e178282611dd1565b919050565b5f67ffffffffffffffff821115611e3657611e35611da4565b5b611e3f82611b0b565b9050602081019050919050565b828183375f83830152505050565b5f611e6c611e6784611e1c565b611e02565b905082815260208101848484011115611e8857611e87611da0565b5b611e93848285611e4c565b509392505050565b5f82601f830112611eaf57611eae611d9c565b5b8135611ebf848260208601611e5a565b91505092915050565b5f5f5f5f60808587031215611ee057611edf611a28565b5b5f611eed87828801611c3f565b9450506020611efe87828801611c3f565b9350506040611f0f87828801611b92565b925050606085013567ffffffffffffffff811115611f3057611f2f611a2c565b5b611f3c87828801611e9b565b91505092959194509250565b5f67ffffffffffffffff821115611f6257611f61611da4565b5b611f6b82611b0b565b9050602081019050919050565b5f611f8a611f8584611f48565b611e02565b905082815260208101848484011115611fa657611fa5611da0565b5b611fb1848285611e4c565b509392505050565b5f82601f830112611fcd57611fcc611d9c565b5b8135611fdd848260208601611f78565b91505092915050565b5f5f60408385031215611ffc57611ffb611a28565b5b5f61200985828601611c3f565b925050602083013567ffffffffffffffff81111561202a57612029611a2c565b5b61203685828601611fb9565b9150509250929050565b5f5f6040838503121561205657612055611a28565b5b5f61206385828601611c3f565b925050602061207485828601611c3f565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806120c257607f821691505b6020821081036120d5576120d461207e565b5b50919050565b5f6060820190506120ee5f830186611c01565b6120fb6020830185611d0c565b6121086040830184611c01565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61214782611b73565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361217957612178612110565b5b600182019050919050565b5f81519050919050565b5f82825260208201905092915050565b5f6121a882612184565b6121b2818561218e565b93506121c2818560208601611afd565b6121cb81611b0b565b840191505092915050565b5f6080820190506121e95f830187611c01565b6121f66020830186611c01565b6122036040830185611d0c565b8181036060830152612215818461219e565b905095945050505050565b5f8151905061222e81611a5b565b92915050565b5f6020828403121561224957612248611a28565b5b5f61225684828501612220565b91505092915050565b5f81905092915050565b5f61227382611ae3565b61227d818561225f565b935061228d818560208601611afd565b80840191505092915050565b5f6122a48285612269565b91506122b08284612269565b91508190509392505050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026123187fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826122dd565b61232286836122dd565b95508019841693508086168417925050509392505050565b5f819050919050565b5f61235d61235861235384611b73565b61233a565b611b73565b9050919050565b5f819050919050565b61237683612343565b61238a61238282612364565b8484546122e9565b825550505050565b5f5f905090565b6123a1612392565b6123ac81848461236d565b505050565b5b818110156123cf576123c45f82612399565b6001810190506123b2565b5050565b601f821115612414576123e5816122bc565b6123ee846122ce565b810160208510156123fd578190505b612411612409856122ce565b8301826123b1565b50505b505050565b5f82821c905092915050565b5f6124345f1984600802612419565b1980831691505092915050565b5f61244c8383612425565b9150826002028217905092915050565b61246582611ae3565b67ffffffffffffffff81111561247e5761247d611da4565b5b61248882546120ab565b6124938282856123d3565b5f60209050601f8311600181146124c4575f84156124b2578287015190505b6124bc8582612441565b865550612523565b601f1984166124d2866122bc565b5f5b828110156124f9578489015182556001820191506020850194506020810190506124d4565b868310156125165784890151612512601f891682612425565b8355505b6001600288020188555050505b505050505050565b5f60408201905061253e5f830185611c01565b61254b6020830184611d0c565b9392505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601260045260245ffdfea264697066735822122057650c44dd5600c4b5cd1af3af8bbcf4060def28515db316196522b6c1a281d764736f6c634300081c0033"
// Export a function to create an instance of HelloWorldActionProvider
export const helloWorldActionProvider = () => new HelloWorldActionProvider();
