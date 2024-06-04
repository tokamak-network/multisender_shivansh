// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Multisender {
    /**
     * @notice Multisend ERC721 tokens to a list of addresses
     * @param _nft The address of the ERC721 contract
     * @param _addresses The addresses to Multisend to
     * @param _tokenIds The tokenIds to Multisend
     */
    function multisendERC721(
        address _nft,
        address[] calldata _addresses,
        uint256[] calldata _tokenIds
    ) external payable {
        assembly {
            // Check that the number of addresses matches the number of tokenIds
            if iszero(eq(_tokenIds.length, _addresses.length)) {
                revert(0, 0)
            }
            // transferFrom(address from, address to, uint256 tokenId)
            mstore(0x00, hex"23b872dd")
            // from address
            mstore(0x04, caller())

            // end of array
            let end := add(_addresses.offset, shl(5, _addresses.length))
            // diff = _addresses.offset - _tokenIds.offset
            let diff := sub(_addresses.offset, _tokenIds.offset)

            // Loop through the addresses
            for {
                let addressOffset := _addresses.offset
            } 1 {

            } {
                // to address
                mstore(0x24, calldataload(addressOffset))
                // tokenId
                mstore(0x44, calldataload(sub(addressOffset, diff)))
                // transfer the token
                if iszero(call(gas(), _nft, 0, 0x00, 0x64, 0, 0)) {
                    revert(0, 0)
                }
                // increment the address offset
                addressOffset := add(addressOffset, 0x20)
                // if addressOffset >= end, break
                if iszero(lt(addressOffset, end)) {
                    break
                }
            }
        }
    }

    /**
     * @notice Multisend ERC20 tokens to a list of addresses
     * @param _token The address of the ERC20 contract
     * @param _addresses The addresses to Multisend to
     * @param _amounts The amounts to Multisend
     * @param _totalAmount The total amount to Multisend
     */
    function multisendERC20(
        address _token,
        address[] calldata _addresses,
        uint256[] calldata _amounts,
        uint256 _totalAmount
    ) external payable {
        assembly {
            // Check that the number of addresses matches the number of amounts
            if iszero(eq(_amounts.length, _addresses.length)) {
                revert(0, 0)
            }

            // transferFrom(address from, address to, uint256 amount)
            mstore(0x00, hex"23b872dd")
            // from address
            mstore(0x04, caller())
            // to address (this contract)
            mstore(0x24, address())
            // total amount
            mstore(0x44, _totalAmount)

            // transfer total amount to this contract
            if iszero(call(gas(), _token, 0, 0x00, 0x64, 0, 0)) {
                revert(0, 0)
            }

            // transfer(address to, uint256 value)
            mstore(0x00, hex"a9059cbb")

            // end of array
            let end := add(_addresses.offset, shl(5, _addresses.length))
            // diff = _addresses.offset - _amounts.offset
            let diff := sub(_addresses.offset, _amounts.offset)

            // Loop through the addresses
            for {
                let addressOffset := _addresses.offset
            } 1 {

        } {
            // to address
            mstore(0x04, calldataload(addressOffset))
            // amount
            mstore(0x24, calldataload(sub(addressOffset, diff)))

            // Perform the transfer and store the result
            let success := call(gas(), _token, 0, 0x00, 0x44, 0, 0x20)

         
            if gt(success, 0) {
                // Check if the transfer was successful
                switch returndatasize()
                case 0 {
                    // No return data, assume success
                    success := 1
                }
                case 0x20 {
                    // Check if returned data is exactly 1
                    success := eq(mload(0), 1)
                }
            }

            // Revert if the transfer did not return true
            if iszero(success) {
                revert(0, 0)
            }

            // increment the address offset
            addressOffset := add(addressOffset, 0x20)
            // if addressOffset >= end, break
            if iszero(lt(addressOffset, end)) {
                break
            }
        }
    }
}


    /**
     * @notice Multisend ETH to a list of addresses
     * @param _addresses The addresses to Multisend to
     * @param _amounts The amounts to Multisend
     */
    function multisendETH(
        address[] calldata _addresses,
        uint256[] calldata _amounts
    ) external payable {
        assembly {
            // Check that the number of addresses matches the number of amounts
            if iszero(eq(_amounts.length, _addresses.length)) {
                revert(0, 0)
            }

            // iterator
            let i := _addresses.offset
            // end of array
            let end := add(i, shl(5, _addresses.length))
            // diff = _addresses.offset - _amounts.offset
            let diff := sub(_amounts.offset, _addresses.offset)

            // Loop through the addresses
            for {

            } 1 {

            } {
                // transfer the ETH
                if iszero(
                    call(
                        gas(),
                        calldataload(i),
                        calldataload(add(i, diff)),
                        0x00,
                        0x00,
                        0x00,
                        0x00
                    )
                ) {
                    revert(0x00, 0x00)
                }
                // increment the iterator
                i := add(i, 0x20)
                // if i >= end, break
                if eq(end, i) {
                    break
                }
            }
        }
    }
}
