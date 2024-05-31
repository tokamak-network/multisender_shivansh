
# Multisender Smart Contract

This smart contract allows for the multisending of ERC721 tokens, ERC20 tokens, and ETH to multiple addresses in a single transaction. It is implemented in Solidity using version 0.8.24 and utilizes inline assembly for gas optimization.

## Contract Functions

### `multisendERC721`

This function allows the multisending of ERC721 tokens to multiple addresses.

**Parameters:**
- `_nft`: The address of the ERC721 contract.
- `_addresses`: An array of addresses to send the tokens to.
- `_tokenIds`: An array of token IDs to be sent.

**Function Logic:**
- Validates that the number of addresses matches the number of token IDs.
- Uses `transferFrom` to transfer each token from the caller to the specified address.

```solidity
function multisendERC721(
    address _nft,
    address[] calldata _addresses,
    uint256[] calldata _tokenIds
) external payable {
}
```

### `multisendERC20`

This function allows the multisending of ERC20 tokens to multiple addresses.

**Parameters:**
- `_token`: The address of the ERC20 contract.
- `_addresses`: An array of addresses to send the tokens to.
- `_amounts`: An array of amounts to be sent.
- `_totalAmount`: The total amount of tokens to be transferred to the contract.

**Function Logic:**
- Validates that the number of addresses matches the number of amounts.
- Uses `transferFrom` to transfer the total amount of tokens from the caller to the contract.
- Uses `transfer` to distribute the tokens from the contract to the specified addresses.

```solidity
function multisendERC20(
    address _token,
    address[] calldata _addresses,
    uint256[] calldata _amounts,
    uint256 _totalAmount
) external payable {
}
```

### `multisendETH`

This function allows the multisending of ETH to multiple addresses.

**Parameters:**
- `_addresses`: An array of addresses to send the ETH to.
- `_amounts`: An array of amounts to be sent.

**Function Logic:**
- Validates that the number of addresses matches the number of amounts.
- Uses the `call` method to transfer ETH to each specified address.

```solidity
function multisendETH(
    address[] calldata _addresses,
    uint256[] calldata _amounts
) external payable {
}
```

## Deployment and Usage

1. **Install Dependencies:**
   - Run `npm i` to install the required dependencies.
   - If needed, you can force install dependencies using `npm i --force`.

2. **Setup Environment Variables:**
   - Copy the `.env.example` file and rename it to `.env`.
   - Open the `.env` file and paste your private key in the `DEPLOYER_PRIVATE_KEY` variable.

3. **Deployment:**
   - To deploy the `Multisender` contract, run `npm run deploy` in your terminal.

4. **Testing:**
   - Run `npm run test` to execute tests and ensure the contract functions as expected.

5. **Multisend ERC721 Tokens:**
   - After deployment, call the `multisendERC721` function with the ERC721 contract address, an array of recipient addresses, and an array of token IDs.

6. **Multisend ERC20 Tokens:**
   - Use the `multisendERC20` function with the ERC20 contract address, recipient addresses array, amounts array, and total amount of tokens to transfer.

7. **Multisend ETH:**
   - Invoke the `multisendETH` function with an array of recipient addresses and corresponding amounts of ETH to send.


## Security Considerations

- Ensure that the length of the `_addresses` and `_tokenIds` (or `_amounts`) arrays match to avoid mismatches in transfers.
- Validate the total amount of ERC20 tokens before calling the `multisendERC20` function to ensure sufficient balance.
- Be cautious of reentrancy attacks and consider using a reentrancy guard if modifying the contract.

## License
This project is licensed under the MIT License.

