/*
  @CreateAction({
    name: "deposit",
    description: `
This tool allows depositing assets into a Morpho Vault. 

It takes:
- vaultAddress: The address of the Morpho Vault to deposit to
- assets: The amount of assets to deposit in whole units
  Examples for WETH:
  - 1 WETH
  - 0.1 WETH
  - 0.01 WETH
- receiver: The address to receive the shares
- tokenAddress: The address of the token to approve

Important notes:
- Make sure to use the exact amount provided. Do not convert units for assets for this action.
- Please use a token address (example 0x4200000000000000000000000000000000000006) for the tokenAddress field.
`,
    schema: DepositSchema,
  })
  async deposit(wallet: EvmWalletProvider, args: z.infer<typeof DepositSchema>): Promise<string> {
    const assets = new Decimal(args.assets);

    if (assets.comparedTo(new Decimal(0.0)) != 1) {
      return "Error: Assets amount must be greater than 0";
    }

    try {
      const atomicAssets = parseEther(args.assets);

      const approvalResult = await approve(
        wallet,
        args.tokenAddress,
        args.vaultAddress,
        atomicAssets,
      );
      if (approvalResult.startsWith("Error")) {
        return `Error approving Morpho Vault as spender: ${approvalResult}`;
      }

      const data = encodeFunctionData({
        abi: METAMORPHO_ABI,
        functionName: "deposit",
        args: [atomicAssets, args.receiver],
      });

      const txHash = await wallet.sendTransaction({
        to: args.vaultAddress as `0x${string}`,
        data,
      });

      const receipt = await wallet.waitForTransactionReceipt(txHash);

      return `Deposited ${args.assets} to Morpho Vault ${args.vaultAddress} with transaction hash: ${txHash}\nTransaction receipt: ${JSON.stringify(receipt)}`;
    } catch (error) {
      return `Error depositing to Morpho Vault: ${error}`;
    }
  }
    */

//   /**
//    * Withdraws assets from a Morpho Vault
//    *
//    * @param wallet - The wallet instance to execute the transaction
//    * @param args - The input arguments for the action
//    * @returns A success message with transaction details or an error message
//    */
//   @CreateAction({
//     name: "withdraw",
//     description: `
// This tool allows withdrawing assets from a Morpho Vault. It takes:

// - vaultAddress: The address of the Morpho Vault to withdraw from
// - assets: The amount of assets to withdraw in atomic units (wei)
// - receiver: The address to receive the shares
// `,
//     schema: WithdrawSchema,
//   })
//   async withdraw(wallet: EvmWalletProvider, args: z.infer<typeof WithdrawSchema>): Promise<string> {
//     if (BigInt(args.assets) <= 0) {
//       return "Error: Assets amount must be greater than 0";
//     }

//     try {
//       const data = encodeFunctionData({
//         abi: METAMORPHO_ABI,
//         functionName: "withdraw",
//         args: [BigInt(args.assets), args.receiver, args.receiver],
//       });

//       const txHash = await wallet.sendTransaction({
//         to: args.vaultAddress as `0x${string}`,
//         data,
//       });

//       const receipt = await wallet.waitForTransactionReceipt(txHash);

//       return `Withdrawn ${args.assets} from Morpho Vault ${args.vaultAddress} with transaction hash: ${txHash}\nTransaction receipt: ${JSON.stringify(receipt)}`;
//     } catch (error) {
//       return `Error withdrawing from Morpho Vault: ${error}`;
//     }
//   }

//   /**
//    * Checks if the Morpho action provider supports the given network.
//    *
//    * @param network - The network to check.
//    * @returns True if the Morpho action provider supports the network, false otherwise.
//    */
//   supportsNetwork = (network: Network) =>
//     network.protocolFamily === "evm" && SUPPORTED_NETWORKS.includes(network.networkId!);
// }

// export const morphoActionProvider = () => new MorphoActionProvider();


// import { z } from "zod";
// // import { ActionProvider } from "../actionProvider";
// // import { CreateAction } from "../actionDecorator";

// import { ActionProvider, WalletProvider, Network } from "@coinbase/agentkit";
// const GreetSchema = z.object({
//   name: z.string().describe("The name to greet"),
// });

/**
 * HelloWorldActionProvider demonstrates a simple action provider.
 */
// export class HelloWorldActionProvider extends ActionProvider {
//   constructor() {
//     super("helloworld", []);
//   }

//   @CreateAction({
//     name: "greet",
//     description: `
// This tool provides a simple greeting functionality.

// It takes:
// - name: The name of the person/entity to greet
// `,
//     schema: GreetSchema,
//   })
//   async greet(args: z.infer<typeof GreetSchema>): Promise<string> {
//     try {
//       return `Hello, ${args.name}!`;
//     } catch (error) {
//       return `Error generating greeting: ${error}`;
//     }
//   }
// }

//export const helloWorldActionProvider = () => new HelloWorldActionProvider();
import { ActionProvider, WalletProvider, Network, CreateAction } from "@coinbase/agentkit";
import { z } from "zod";

// Define a schema with a message field for "Hello World"
export const HelloWorldActionSchema = z.object({
  message: z.string(), // Expecting a string message input
});

export const OnChainYieldExplanationSchema = z.object({});
export const BestYieldUSDCSchema = z.object({});

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

    // Ensure this action supports all networks
    supportsNetwork = (network: Network) => true;
}

// Export a function to create an instance of HelloWorldActionProvider
export const helloWorldActionProvider = () => new HelloWorldActionProvider();
