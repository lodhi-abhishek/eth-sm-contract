console.log(web3.version);
document.getElementById("signinbtn").addEventListener("click", demo2);
document.getElementById("signupbtn").addEventListener("click", demo);

function demo() {
    document.getElementById("signupform").style.display = "block";
    document.getElementById("signinform").style.display = "none";
}
function demo2() {
    document.getElementById("signupform").style.display = "none";
    document.getElementById("signinform").style.display = "block";
}
// const ethereumButton = document.querySelector('.enableEthereumButton');
// const sendEthButton = document.querySelector('.sendEthButton');

// let accounts = [];

// //Sending Ethereum to an address
// sendEthButton.addEventListener('click', () => {
//   ethereum
//     .request({
//       method: 'eth_sendTransaction',
//       params: [
//         {
//           from: accounts[0],
//           to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
//           value: '0x29a2241af62c0000',
//           gasPrice: '0x09184e72a000',
//           gas: '0x2710',
//         },
//       ],
//     })
//     .then((txHash) => console.log(txHash))
//     .catch((error) => console.error);
// });

// ethereumButton.addEventListener('click', () => {
//   getAccount();
// });

// async function getAccount() {
//   accounts = await ethereum.request({ method: 'eth_requestAccounts' });
// }
App = {
    loading: false,
    contracts: {},
    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        if (typeof web3 !== "undefined") {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            window.alert("Please connect to Metamask.");
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                web3.eth.sendTransaction({
                    /* ... */
                });
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider;
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({
                /* ... */
            });
        }
        // Non-dapp browsers...
        else {
            console.log(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    },

    loadAccount: async () => {
        // Set the current blockchain account
        //App.account = await web3.eth.accounts[0];
        var accounts = await web3.eth.getAccounts();
        console.log(accounts);
        App.account = accounts[0];
        console.log(App.account);
        web3.eth.getBalance(App.account).then(console.log);
        $("#wallet-address").val(App.account);
        $("#wallet-address").attr("disabled", "disabled");
        $("#wallet-address2").val(App.account);
        $("#wallet-address2").attr("disabled", "disabled");
    },

    loadContract: async () => {
        const Auth = await $.getJSON("Auth.json");
        App.contracts.Auth = TruffleContract(Auth);
        App.contracts.Auth.setProvider(App.web3Provider);
        App.Auth = await App.contracts.Auth.deployed();
    },

    render: async () => {
        if (App.loading) {
            return;
        }
        App.setLoading(true);
        $("#account").html(App.account);
        await App.renderTasks();
        App.setLoading(false);
    },
    getDoctorInsurances: async (total) => {
        console.log(App.account);
        App.setLoading(true);
        var content =
            "<table><tr><th>Id</th><th>Doctor Name</th><th>Reason</th><th>Status(is approved)</th><th>Amount</th><th>Action</th></tr>";
        for (i = 0; i < total; i++) {
            let y, z;
            const res = await App.Auth.getUserInsuranceById(i, {
                from: App.account,
            }).then(function (x) {
                y = x;
                console.log(x, y[0]);
            });
            if (y[3] == "true") {
                content +=
                    "<tr><td>" +
                    y[0] +
                    "</td><td>" +
                    y[1] +
                    "</td><td>" +
                    y[2] +
                    "</td><td>" +
                    y[3] +
                    "</td><td>" +
                    y[4] +
                    "</td></tr>";
            } else {
                content +=
                    "<tr><td>" +
                    y[0] +
                    "</td><td>" +
                    y[1] +
                    "</td><td>" +
                    y[2] +
                    "</td><td>" +
                    y[3] +
                    "</td><td>" +
                    y[4] +
                    "</td><td><button val=" +
                    y[0] +
                    ' onclick="App.approveInsurance(' +
                    y[0] +
                    ')">Approve</button><button val=' +
                    y[0] +
                    ' onclick="App.disapproveInsurance(' +
                    y[0] +
                    ')">Disapprove</button></td></tr>';
            }
        }
        content += "</table>";
        $("#here-table").append(content);
    },
    getUserInsurances: async (total) => {
        console.log(total);
        console.log(App.account);
        App.setLoading(true);

        // return (drname1,reason1,isApproved1,amount1,temp);
        var content =
            "<table><tr><th>Id</th><th>Doctor Name</th><th>Reason</th><th>Status</th><th>Amount</th></tr>";
        for (i = 0; i < total; i++) {
            let y, z;
            const res = await App.Auth.getUserInsuranceById(i, {
                from: App.account,
            }).then(function (x) {
                y = x;
                console.log(x, y[0]);
            });

            content +=
                "<tr><td>" +
                y[0] +
                "</td><td>" +
                y[1] +
                "</td><td>" +
                y[2] +
                "</td><td>" +
                y[3] +
                "</td><td>" +
                y[4] +
                "</td></tr>";
        }
        content += "</table>";
        $("#here-table").append(content);
    },
    renderTasks: async () => {
        const loggedin = await App.Auth.checkIsUserLogged(App.account);
        console.log(loggedin);
        console.log(web3.eth.getBalance(App.account));
        await web3.eth.getBalance(App.account).then(function (x) {
            console.log(x);
            const ether2 = web3.utils.fromWei(x, "ether");
            console.log(ether2);
            $("#walletamount2").append(ether2);
            $("#walletamount2").append(" ETH");
            $("#walletamount").append(ether2);
            $("#walletamount").append(" ETH");
        });
        if (loggedin) {
            const isDr = await App.Auth.isDr(App.account);
            console.log(isDr);
            if (isDr) {
                console.log("Doctor");
                var total = await App.Auth.totaldoctorInsurance(App.account);
                console.log(total, total.words[0]);
                total = total.words[0];
                await App.getDoctorInsurances(total);
                document.getElementById("drdiv").style.display = "block";
                document.getElementById("signupform").style.display = "none";
                document.getElementById("signinform").style.display = "none";
                document.getElementById("logoutbtn").style.display = "block";
            } else {
                console.log("User");
                var total = await App.Auth.totaluserInsurance(App.account);
                console.log(total, total.words[0]);
                total = total.words[0];
                await App.getUserInsurances(total);
                document.getElementById("logoutbtn").style.display = "block";
                document.getElementById("signupform").style.display = "none";
                document.getElementById("signinform").style.display = "none";
                document.getElementById("homediv").style.display = "block";
            }

            // await App.getUserInsurances();
        } else {
            const doctors2 = [];
            let doctorsObject = [];

            const doctors = await App.Auth.getDoctors();
            for (let index = 0; index < doctors.length; index++) {
                doctors2[index] = await App.Auth.getDoctor(doctors[index]);
                doctorsObject.push({ [doctors[index]]: doctors2[index] });
            }
            console.log(doctors, doctors2, doctorsObject);
            var option = "";
            for (var i = 0; i < doctors2.length; i++) {
                console.log(doctorsObject[i]);
                var keys = Object.keys(doctorsObject[i]);
                console.log(keys[0]);
                console.log(doctors2[i]);
                option +=
                    '<option value="' +
                    Object.keys(doctorsObject[i])[0] +
                    '">' +
                    doctors2[i] +
                    "</option>";
            }
            $("#doctorselect").append(option);
            const usercount = await App.Auth.countDoctors();
            console.log(usercount);
        }
    },

    register: async () => {
        console.log(App.account);

        App.setLoading(true);
        const address = $("#wallet-address").val();
        const username = $("#username").val();
        const psw = $("#psw").val();
        const isDr = document.getElementById("doctor-check").checked;

        console.log("Doctor check", isDr);
        var draddress = "";

        if (isDr) {
            draddress = address;
        } else {
            draddress = $("#doctorselect").val();
            console.log(draddress);
        }
        await App.Auth.register(address, draddress, username, psw, isDr, {
            from: App.account,
        });
        window.alert("registered");
        demo2();
        //  window.location.reload()
    },
    createInsurance: async () => {
        console.log(App.account);
        App.setLoading(true);
        const reason = $("#reason").val();
        const amount = $("#amount").val();

        await App.Auth.createInsurance(App.account, reason, amount, {
            from: App.account,
        });
        window.alert("created insurance");
        // demo2();
        window.location.reload();
    },

    login: async () => {
        App.setLoading(true);
        const address = $("#wallet-address").val();
        console.log(address);
        const psw = $("#psw").val();
        console.log(App.account, address);
        await App.Auth.login(address, psw, { from: App.account });

        const loggedin = await App.Auth.checkIsUserLogged(App.account);
        console.log(loggedin);
        window.alert("success");

        document.getElementById("logoutbtn").style.display = "block";

        document.getElementById("signupform").style.display = "none";
        document.getElementById("signinform").style.display = "none";

        document.getElementById("homediv").style.display = "block";

        //demo2();
        window.location.reload();
    },
    send: async (web3, account, transaction) => {
        const options = {
            to: transaction._parent._address,
            data: transaction.encodeABI(),
        };
        const signed = await web3.eth.accounts.signTransaction(
            options,
            account.privateKey
        );
        const receipt = await web3.eth.sendSignedTransaction(
            signed.rawTransaction
        );
        return receipt;
    },
    approveInsurance: async (id) => {
        let y;
        const res = await App.Auth.getUserInsuranceById(id, {
            from: App.account,
        }).then(function (x) {
            y = x;
            console.log(x, y[0], y[6], y[5]);
        });

        var sender = y[6];
        var receiver = y[5];
        console.log(sender, typeof sender, receiver);
        await web3.eth.getBalance(sender).then(function (x) {
            console.log(x);
        });
        await web3.eth.getBalance(receiver).then(function (x) {
            console.log(x);
        });
        console.log(web3.utils.isAddress(receiver));

        var amount = y[4]; // Willing to send 2 ethers
        console.log(amount.words[0]);
        amount = amount.words[0].toString();
        const amountToSend = web3.utils.toWei(amount, "ether"); // Convert to wei value

        var handleReceipt = (error, receipt) => {
            if (error) console.error(error);
            else {
                console.log(receipt);
            }
        };

        // const account1 = web3.eth.accounts.privateKeyToAccount('d9aa6cb13d30ba036bd3cd512afce8c6211605d21ecfdea709f42d538c5cee4f');
        // const account2 = web3.eth.accounts.privateKeyToAccount('e2a96e5c991f3e1f36f3c2efc1b6e017b9fc5653d7cbedbae49953d70f50b3ca');
        // const transaction1 = await web3.eth.approve(account2.address, amountToSend);
        // const transaction2 = await web3.eth.transferFrom(account2.address, account1.address, amountToSend);
        // const receipt1 = await send(web3, account1, transaction1);
        // const receipt2 = await send(web3, account2, transaction2);
        // console.log(receipt1);
        // console.log(receipt2);
        // console.log("here2");
        var block = await web3.eth.getBlock("latest");
        var gasLimit = block.gasLimit / block.transactions.length;
        const tx = {
            from: "0xdD054eA909E8e8cb9ddCdCDd5978E96b8D96326b",
            to: App.account,
            gasLimit: gasLimit,
            value: amountToSend.toString(),
        };
        const signPromise = await web3.eth.accounts
            .signTransaction(
                tx,
                "e2a96e5c991f3e1f36f3c2efc1b6e017b9fc5653d7cbedbae49953d70f50b3ca"
            )
            .then((signedTx) => {
                // raw transaction string may be available in .raw or
                // .rawTransaction depending on which signTransaction
                // function was called
                const sentTx = web3.eth.sendSignedTransaction(
                    signedTx.raw || signedTx.rawTransaction
                );
                sentTx.on("receipt", (receipt) => {
                    console.log(reciept);
                    // do something when receipt comes back
                });
                sentTx.on("error", (err) => {
                    // do something on transaction erro
                    console.log(err);
                });
            })
            .catch((err) => {
                console.log(err);
                // do something when promise fails
            });
        console.log(
            web3.utils.isAddress("0xdD054eA909E8e8cb9ddCdCDd5978E96b8D96326b")
        );

        console.log("here");
        await App.Auth.approveInsurance(id, { from: App.account });

        //window.alert(id);
        App.setLoading(true);
        window.location.reload();
    },
    disapproveInsurance: async (id) => {
        await App.Auth.disapproveInsurance(id, { from: App.account });
        //window.alert(id);
        App.setLoading(true);
        window.location.reload();
    },
    read: async () => {
        App.setLoading(true);
        const content = $("#read-id").val();

        await App.CRUD.read(content, { from: App.account });
        window.location.reload();
    },
    logout: async () => {
        App.setLoading(true);
        await App.Auth.logout(App.account, { from: App.account });
        window.location.reload();
    },
    update: async () => {
        App.setLoading(true);
        const id = $("#edit-id").val();
        const name = $("#edit-name").val();

        await App.CRUD.update(id, name, { from: App.account });
        await App.renderTasks();
        window.location.reload();
    },
    delete: async () => {
        App.setLoading(true);
        const content = $("#delete-id").val();

        await App.CRUD.delete2(content, { from: App.account });
        await App.renderTasks();
        window.location.reload();
    },
    setLoading: (boolean) => {
        App.loading = boolean;
        const loader = $("#loader");
        const content = $("#content");
        if (boolean) {
            loader.show();
            content.hide();
        } else {
            loader.hide();
            content.show();
        }
    },
};

$(() => {
    $(window).load(() => {
        App.load();
    });
});
