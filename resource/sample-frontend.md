# Frontend which register users and make the whole process of claim visible

```html
<!DOCTYPE html>
<html>
<head>
    <title>Health Insurance Frontend</title>
</head>
<body>
    <h1>Health Insurance Frontend</h1>
    <form id="register-form" onsubmit="registerUser(); return false;">
        <label for="user-address">Your Ethereum address:</label>
        <input type="text" id="user-address" name="user-address" required>
        <button type="submit">Register</button>
    </form>
    <hr>
    <h2>Claims</h2>
    <table id="claims-table">
        <thead>
            <tr>
                <th>Claim ID</th>
                <th>Beneficiary</th>
                <th>Amount</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody id="claims-table-body">
        </tbody>
    </table>
    <hr>
    <form id="claim-form" onsubmit="fileClaim(); return false;">
        <h2>File a Claim</h2>
        <label for="beneficiary-address">Beneficiary Ethereum address:</label>
        <input type="text" id="beneficiary-address" name="beneficiary-address" required>
        <label for="amount">Claim amount:</label>
        <input type="number" id="amount" name="amount" required>
        <button type="submit">Submit Claim</button>
    </form>

    <script src="https://cdn.ethers.io/lib/ethers-5.0.umd.min.js"></script>
    <script>
        const contractAddress = '0xABC123...'; // replace with your contract address
        const contractABI = [ /* replace with your contract ABI */ ];

        const provider = new ethers.providers.Web3Provider(web3.currentProvider);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        function registerUser() {
            const userAddress = document.getElementById('user-address').value;

            contract.addPolicyHolder(userAddress, {
                value: ethers.utils.parseEther('1') // replace with your premium amount
            }).then((tx) => {
                console.log(tx);
            }).catch((error) => {
                console.error(error);
            });
        }

        function fileClaim() {
            const beneficiaryAddress = document.getElementById('beneficiary-address').value;
            const claimAmount = ethers.utils.parseEther(document.getElementById('amount').value);

            contract.fileClaim(beneficiaryAddress, {
                value: claimAmount
            }).then((tx) => {
                console.log(tx);
            }).catch((error) => {
                console.error(error);
            });
        }

        function updateClaimsTable() {
            contract.claimCount().then((count) => {
                const tbody = document.getElementById('claims-table-body');
                tbody.innerHTML = '';
                for (let i = 0; i < count; i++) {
                    contract.claims(i).then((claim) => {
                        const row = document.createElement('tr');
                        const id = document.createElement('td');
                        const beneficiary = document.createElement('td');
                        const amount = document.createElement('td');
                        const status = document.createElement('td');

                        id.textContent = claim.id.toString();
                        beneficiary.textContent = claim.beneficiary;
                        amount.textContent = ethers.utils.formatEther(claim.amount);
                        status.textContent = claim.status;

                        row.appendChild(id);
                        row.appendChild(beneficiary);
                        row.appendChild(amount);
                        row.appendChild(status);

                        tbody.appendChild(row);
                    });
                }
            });
        }

        updateClaimsTable();
    </script>
</body>
</html>
```