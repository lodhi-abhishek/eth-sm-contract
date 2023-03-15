// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auth {
    uint public insuranceId=0;
    uint public nextId=0;

    struct Insurance{
       uint id;
       address insuredBy;
       address doctor;
       string reason;
       bool isApproved;
       uint amount; 
    }
    event InsuranceCreated(
        uint id,
       address insuredBy,
       address doctor,
       string reason,
       bool isApproved,
       uint amount
    );
    
    struct UserDetail {
        address addr;
        address draddr;
        string name;
        string password;
        bool isUserLoggedIn;
        bool isDoctor;
        uint Amount;
    }
    mapping(address => UserDetail) user;
    address[] public doctorAccounts;

    Insurance[] public insurance;
    Insurance[] public userinsurance;
    uint[]  public userinsurances2;
    modifier checkIsUserLogged2 {
        require(user[msg.sender].isUserLoggedIn == true, "Action not permitted user need to login first");
        _;
    }
    function totaldoctorInsurance(address _addr )external view returns(uint) {
        uint count=0;  
        for (uint i = 0; i < insurance.length; i++) {
            if(insurance[i].doctor==_addr){ 
                count++;
            }
        }
        return count;
    }
    function totaluserInsurance(address _addr )external view returns(uint) {
        uint count=0;  
        for (uint i = 0; i < insurance.length; i++) {
            if(insurance[i].insuredBy==_addr){ 
                count++;
            }
        }
        return count;
    }
    function getUserInsurance(address _addr )view external returns(uint,string memory,string memory,string memory,uint,address ) {
        string memory reason1="hello";
        string memory isApproved1;
        string memory drname1;
        address temp;
        uint amount1;
        uint id1;
        
        for (uint i = 0; i < insurance.length; i++) {
            if(insurance[i].insuredBy==_addr){ 
                reason1 = insurance[i].reason;
                                id1 = insurance[i].id;

                amount1 = insurance[i].amount;
                temp = insurance[i].doctor;
                drname1 = getDoctor(temp);
                if(insurance[i].isApproved){
                    isApproved1="true";
                }else{
                    isApproved1="false";
                }
            }
        }
        return (id1,drname1,reason1,isApproved1,amount1,temp);
    }
    function getUserInsuranceById(uint id)view external returns(uint,string memory,string memory,string memory,uint,address,address ) {
        string memory reason1="hello";
        string memory isApproved1;
        string memory drname1;
        address temp;
        address temp2;
        uint amount1;
        uint id1;
        
       
          
                reason1 = insurance[id].reason;
                                id1 = insurance[id].id;

                amount1 = insurance[id].amount;
                temp = insurance[id].doctor;
                temp2 = insurance[id].insuredBy;
                drname1 = getDoctor(temp);
                if(insurance[id].isApproved){
                    isApproved1="true";
                }else{
                    isApproved1="false";
                }
            
        
        return (id1,drname1,reason1,isApproved1,amount1,temp,temp2);
    }
    function getDoctorInsuranceForApproval(address _addr )view external returns(string memory,string memory,string memory,uint,address ) {
        string memory reason1="hello";
        string memory isApproved1;
        string memory drname1;
        address temp;
        uint amount1;
        for (uint i = 0; i < insurance.length; i++) {
            if(insurance[i].doctor==_addr){ 
                reason1 = insurance[i].reason;
                amount1 = insurance[i].amount;
                temp = insurance[i].doctor;
                drname1 = getDoctor(temp);
                if(insurance[i].isApproved){
                    isApproved1="true";
                }else{
                    isApproved1="false";
                }
            }
        }
        return (drname1,reason1,isApproved1,amount1,temp);
    }
    function isDr(address _address) public view returns(bool){
        return (user[_address].isDoctor);
    }
    function getDoctors() view public returns (address[] memory) {
        return doctorAccounts;
    }
    function getDoctor(address _address) view public returns (string memory) {
        return (user[_address].name);
    }
    function countDoctors() view public returns (uint) {
        return doctorAccounts.length;
    }
    function createInsurance(address _insuredBy,string memory _reason,uint _amount) public checkIsUserLogged2{
        address drtemp= user[_insuredBy].draddr;
        uint id2=insuranceId;
        insurance.push(Insurance(id2, _insuredBy, drtemp, _reason,false, _amount));
        emit InsuranceCreated(id2,_insuredBy, drtemp, _reason, false, _amount);
        insuranceId++;
    }
    function approveInsurance(uint id) public {
        uint id2=find(id);
        insurance[id2].isApproved=true;
     
    }
    function disapproveInsurance(uint id) public checkIsUserLogged2{
        uint id3=find(id);
        insurance[id3].isApproved=false;
    }
    function find(uint id) view internal returns(uint){
        for (uint i = 0; i < insurance.length; i++) {
            if(insurance[i].id==id){
                return i;
            }
        }
        revert('claim does not exists');
    }

    // user registration function
    function register(
        address _address,
        address _draddress,

        string memory _name,
        string memory _password,
        
        bool _isDoctor
    ) public returns (bool) {
        require(user[_address].addr != msg.sender);
        user[_address].addr = _address;
        user[_address].draddr = _draddress;
        user[_address].name = _name;
        user[_address].password = _password;
        user[_address].isUserLoggedIn = false;
        user[_address].Amount = 1000;
        user[_address].isDoctor = _isDoctor;
        nextId++;
        if(_isDoctor==true){
        doctorAccounts.push(_address);
        }

        return true;
    }

    // user login function
    function login(address _address, string memory _password) public returns (uint){
        bytes memory b1 = bytes(_password);
        bytes memory b2 = bytes(user[_address].password);
        uint256 l1 = b1.length;
        if (l1 != b2.length){
            return 0;
        } 
        for (uint256 i=0; i<l1; i++) {
            if (b1[i] != b2[i]) {
                return 0;
            }
            
        }
            user[_address].isUserLoggedIn = true;
            return 1;            
    }

    // check the user logged In or not
    function checkIsUserLogged(address _address) public view returns (bool) {
        return (user[_address].isUserLoggedIn);
    }
    
    // logout the user
    function logout(address _address) public {
        user[_address].isUserLoggedIn = false;
    }
}