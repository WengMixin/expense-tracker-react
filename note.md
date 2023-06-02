<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-06-02 13:31:59
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-06-02 17:13:12
 * @FilePath: /expense-tracker-react/note.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# context file

## GlobalState.js

```js
import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

//Initial state
const initialState = {
  transactions: [
    { id: 1, text: "Flower", amount: -20 },
    { id: 2, text: "Salary", amount: 300 },
    { id: 3, text: "Book", amount: -10 },
    { id: 4, text: "Camera", amount: 150 },
  ],
};

//create context
export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  return (
    <GlobalContext.Provider
      value={{
        transaction: state.transaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
```

`createContext`是 React 的一个 API，用于创建一个 Context 对象。Context 在 React 中被用于共享一些可以被任何组件访问的数据，这些组件无需通过 props 链就可以访问这些数据。这对于在组件树中的许多不同级别共享数据非常有用。

在你给出的代码中，`createContext`函数被用来创建一个新的 Context 对象，这个对象将被用来在你的 React 应用程序中的不同组件之间共享状态。

`createContext`函数接受一个参数，这个参数是 Context 的默认值。在你的代码中，`initialState`被传递给`createContext`，所以`initialState`就是这个 Context 的默认值。

然后，`createContext`函数返回一个 Context 对象。这个对象包含两个重要的 React 组件：`Provider`和`Consumer`。

- `Provider`组件允许其他的 React 组件订阅 Context 的变化。在你的代码中，`GlobalContext.Provider`就是这个 Provider 组件。

- `Consumer`组件允许 React 组件订阅 Context 的变化。

最后，`export const GlobalContext`使得这个 Context 对象可以在其他的 JavaScript 模块中被导入和使用。

---

```jsx
<GlobalContext.Provider value={{ transactions: state.transactions }}>
  {children}
</GlobalContext.Provider>
```

在这个例子中，任何在`GlobalContext.Provider`内部的组件（children，也就是下面的`<GlobalProvider>..</GlobalProvider`之间的

```jsx
<GlobalProvider>
  <Header />
  <div className="container">
    <Balance />
    <IncomeExpenses />
    <TransactionList />
    <AddTransaction />
  </div>
</GlobalProvider>
```

全部组件）都可以访问到`transactions`的状态。如果`transactions`的状态发生变化，所有的子组件都会重新渲染。

## AddTransaction.js

tips:

- 从普通 js 文件转为 react js， 需要将 class 变成 classname， 还需要将 for 变成 htmlFor。

### 遇到的报错警告：

```js
Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components
```

- 这个是因为在 balance.js 中使用了为定义的{useContext}, 把它删除即可。

## GlobalState.js 进阶

```jsx
...
// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  function deleteTransaction(id) {
    dispatch({
      type: "DELETE_TRANSACTION",
      payload: id,
    });
  }

  function addTransaction(transaction) {
    dispatch({
      type: "ADD_TRANSACTION",
      payload: transaction,
    });
  }

  return (
    ...
        deleteTransaction,
        addTransaction,
    ...
  );
};

```

- 关于 dispatch，以及 AppReducer 和 两个函数 addTransaction 和 deleteTransaction 的用法和意义：

  - 首先，整个 app 都需要大量用到的全局变量是 Transaction，他主要包含了 id，text， 以及 amount（这个在 AddTransaction.js 中被定义）
  - 然后，为了能够使全局都可以使用这个复杂的变量，我们使用 react 的 useContext hook，他的作用上面已经讲了一部分，但是 AppReducer 和 dispatch 的作用还没解释。
  - 首先 dispatch 是 useReducer 返回的一个函数，而 useReducer 还返回一个状态，他比 useState 更加强大的地方在于，状态的更新依赖 AppReducer 的具体调度，而 AppReducer 调度的依据，正是 dispatch，简单来说，我们的 dispatch 函数可以有多种“type” 和 “action”， 就像 addTrans 和 deleteTrans 函数里面的描述一样，不同的 action 会赋予 palyload 不同的值，例如我们会在 AddTrans.js 模块里面调用 addTrans 函数，而在 Transactions.js 模块里面调用 deleteTrans 函数，他们分别传递给 playload 的是 transaction Json 文件，和 id 值。这是两种完全不同的类型。
  - 然后，AppReducer 模块，将根据不同的 action 类型，也就是每个 dispatch 函数的不同的“type”和“playload” 来最终更新 state 的值（也就是我们真正的全局变量 transaction 的值）。在下面的代码中，需要注意的一个点是，为什么 return 的时候，要加上`...state,`？这是因为 state 不支持直接进行修改更新，而是必须要重新创建一个新的 state 来进行更新，所以它的作用是对原来的 state 进行浅复制，然后再更新特定的属性，例如 transaction。假设在大型项目中，我们的 state 不止一个 transaction 属性，还有其他的十几个，我们也是使用同样的代码来更新当 type 等于“ADD_TRANSACTION"的情况。所以`...state,`是很方便的一个操作。

  ## AppReducer.js 进阶

  ```jsx
  ...
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };
  ...

  ```

  - 最后，我们只需要在适当的任何一个有需要的 component 中，例如 AddTransaction 模块里面，先 `import { GlobalContext } from "../context/GlobalState";` 再把 GlobalState 的 addTransaction 函数应用为自己的函数：`const { addTransaction } = useContext(GlobalContext);` 最后再进行调用，就可以在调用结束时，影响到所有有关联的 component，并对整个 app 进行全部重新渲染，

## Balance.js

```jsx
...
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0);

  return(
    ...
     <h1>{moneyFormatter(total)}</h1>
     ...
  )
...
```

- 加入了 useContext 以后， 我们可以利用 transaction 全局状态变量来进行操作，例如上面的计算 balance，然后只需要把计算好的值，加入到 return。moneyFormatter 只是一个格式化函数。
- 同样的，IncomeExpenses 模块也是一样，计算总输出和总输入。

## AddTransaction.js

```jsx

```
