```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthInsurance {
    address public owner; // address of the policy provider
    uint public premium; // amount of premium to be paid by the policyholder
    uint public coverageAmount; // amount of coverage provided by the policy

    mapping (address => uint) public policyHolders; // mapping of policyholders and their premium payments
    mapping (address => bool) public beneficiaries; // mapping of beneficiaries of the policy

    event PolicyholderAdded(address policyholder, uint premium);
    event BeneficiaryAdded(address beneficiary);

    constructor(uint _premium, uint _coverageAmount) {
        owner = msg.sender;
        premium = _premium;
        coverageAmount = _coverageAmount;
    }

    function addPolicyHolder(address _policyHolder) public payable {
        require(msg.sender == owner, "Only the policy provider can add policyholders");
        require(msg.value == premium, "Incorrect premium amount");

        policyHolders[_policyHolder] = msg.value;
        emit PolicyholderAdded(_policyHolder, msg.value);
    }

    function addBeneficiary(address _beneficiary) public {
        require(policyHolders[msg.sender] > 0, "Only policyholders can add beneficiaries");
        beneficiaries[_beneficiary] = true;
        emit BeneficiaryAdded(_beneficiary);
    }

    function fileClaim(address _beneficiary) public {
        require(beneficiaries[_beneficiary], "Not a valid beneficiary");
        payable(_beneficiary).transfer(coverageAmount);
    }

    function getPolicyHolderPremium(address _policyHolder) public view returns (uint) {
        return policyHolders[_policyHolder];
    }

    function withdrawFunds() public {
        require(msg.sender == owner, "Only the policy provider can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }
}
```

This smart contract defines a Health Insurance policy where a policyholder pays a premium to the policy provider, and in case of a valid claim, a beneficiary can receive the coverage amount. Here is a brief explanation of the functions defined in the smart contract:

- `addPolicyHolder:` Only the policy provider can add policyholders to the contract. The function checks that the amount of Ether sent with the function call is equal to the premium amount. If the policyholder is added successfully, an event is emitted with the policyholder's address and the premium amount.

- `addBeneficiary:` Only policyholders can add beneficiaries to the policy. The function adds the beneficiary to the list of beneficiaries.

- `fileClaim:` A beneficiary can file a claim by calling this function and providing their address. The function verifies that the address is a valid beneficiary and transfers the coverage amount to the beneficiary.

- `getPolicyHolderPremium:` This function returns the premium paid by a particular policyholder.

- `withdrawFunds:` Only the policy provider can withdraw the funds accumulated in the contract. The function transfers the balance of the contract to the policy provider's address.

*`Note that this is just an example`*

Depending on the requirements and regulations of the insurance policy, you may need to modify the smart contract accordingly.
