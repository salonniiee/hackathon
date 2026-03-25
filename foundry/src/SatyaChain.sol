// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SatyaChain {
    struct ProductVerification {
        bytes32 productId;
        string productName;
        uint256 localPercentage;
        string classification;
        string riskLevel;
        uint256 timestamp;
        address verifier;
    }

    mapping(bytes32 => ProductVerification) public products;
    bytes32[] public productIds;

    event ProductStored(
        bytes32 indexed productId,
        string productName,
        uint256 localPercentage,
        string classification,
        string riskLevel,
        uint256 timestamp,
        address indexed verifier
    );

    function storeProduct(
        bytes32 productId,
        string calldata productName,
        uint256 localPercentage,
        string calldata classification,
        string calldata riskLevel
    ) external {
        require(products[productId].timestamp == 0, "Product already verified");

        products[productId] = ProductVerification({
            productId: productId,
            productName: productName,
            localPercentage: localPercentage,
            classification: classification,
            riskLevel: riskLevel,
            timestamp: block.timestamp,
            verifier: msg.sender
        });

        productIds.push(productId);

        emit ProductStored(
            productId,
            productName,
            localPercentage,
            classification,
            riskLevel,
            block.timestamp,
            msg.sender
        );
    }

    function getProduct(bytes32 productId) external view returns (ProductVerification memory) {
        require(products[productId].timestamp != 0, "Product not found");
        return products[productId];
    }

    function hasProduct(bytes32 productId) external view returns (bool) {
        return products[productId].timestamp != 0;
    }

    function getAllProductIds() external view returns (bytes32[] memory) {
        return productIds;
    }

    function getProductCount() external view returns (uint256) {
        return productIds.length;
    }
}
