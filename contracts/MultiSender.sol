// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract Multisender is ReentrancyGuardUpgradeable {
    using SafeERC20 for IERC20;

    event MultisendETH(address[] addresses, uint256[] amounts);

    event MultisendERC721(
        address _nft,
        address[] addresses,
        uint256[] tokenIds
    );

    function initialize() external initializer {
        __ReentrancyGuard_init();
    }

    event MultisendERC20(address token, address[] addresses, uint256[] amounts);
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
    ) external nonReentrant {
        require(
            _addresses.length == _tokenIds.length,
            "Arrays length mismatch"
        );

        for (uint256 i = 0; i < _addresses.length; i++) {
            // Transfer the token
            IERC721(_nft).safeTransferFrom(msg.sender, _addresses[i], _tokenIds[i]);
        }
        emit MultisendERC721(_nft, _addresses, _tokenIds);
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
    ) external nonReentrant {
        require(_addresses.length == _amounts.length, "Arrays length mismatch");

        // transfer total amount to this contract

        IERC20(_token).safeTransferFrom(
            msg.sender,
            address(this),
            _totalAmount
        );

        for (uint256 i = 0; i < _addresses.length; i++) {
            // Perform the transfer
            IERC20(_token).safeTransfer(_addresses[i], _amounts[i]);
        }
        emit MultisendERC20(_token, _addresses, _amounts);
    }

    /**
     * @notice Multisend ETH to a list of addresses
     * @param _addresses The addresses to Multisend to
     * @param _amounts The amounts to Multisend
     */
    function multisendETH(
        address[] calldata _addresses,
        uint256[] calldata _amounts
    ) external payable nonReentrant {
        require(_addresses.length == _amounts.length, "Arrays length mismatch");

        for (uint256 i = 0; i < _addresses.length; i++) {
            // Transfer ETH to each address
            (bool success, ) = _addresses[i].call{value: _amounts[i]}("");
            require(success, "ETH transfer failed");
        }
        emit MultisendETH(_addresses, _amounts);
    }
}
