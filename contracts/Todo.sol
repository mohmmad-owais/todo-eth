//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Todo {
    string private task;

    constructor(string memory _task) {
        console.log("Deployed a new Todo with task:", _task);
        task = _task;
    }

    function showTodo() public view returns (string memory) {
        return task;
    }

    function setTodo(string memory _task) public {
        console.log("New task added", _task);
        task = _task;
    }
}
