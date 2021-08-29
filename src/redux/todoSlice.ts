import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Todo } from "../models/Todo";
import { v4 as uuidv4 } from "uuid";

//Ether imports
import { ethers } from "ethers";

import TodoAbi from "./../artifacts/contracts/Todo.sol/Todo.json";

// request access to the user's MetaMask account
async function requestAccount() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
}

// Giving type for window
declare let window: any;

const initialState = [] as Todo[];

// Enter your deployed contract address
const todoAddress = "you will recieve a address after deploying your contract";

// call the smart contract, send an update
async function setTodo(todoDescription: any) {
  if (!todoDescription) return;
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(todoAddress, TodoAbi.abi, signer);
    const transaction = await contract.setTodo(todoDescription);
    await transaction.wait();
  }
}

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer: (state: any, action: PayloadAction<Todo>) => {
        state.push(action.payload);
        //setTodo(action.payload);
      },

      prepare: (content: string) => ({
        payload: {
          id: uuidv4(),
          content,
          completed: false,
        } as Todo,
      }),
    },
    removeTodo(state, action: PayloadAction<string>) {
      const index = state.findIndex((todo: any) => todo.id === action.payload);
      state.splice(index, 1);
    },
    setTodoStatus(
      state,
      action: PayloadAction<{ completed: boolean; id: string }>
    ) {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
  },
});

export const { addTodo, removeTodo, setTodoStatus } = todoSlice.actions;
export default todoSlice.reducer;
