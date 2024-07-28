import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await run(input);
    }

    // Example content integration for "What is ReactJS?" query
//     if (prompt && prompt.toLowerCase().includes("what is reactjs")) {
//       response = `## What is ReactJS?

// ReactJS, often simply called "React," is a JavaScript library used for building user interfaces (UIs). It's a popular choice for front-end development, particularly for building complex, interactive applications. Here's a breakdown of React's key features and benefits:

// 1. **Component-based Architecture**:
//    - React encourages breaking down your UI into reusable components, each responsible for a specific part of the interface. This makes code more modular, easier to understand, and maintain.
//    - Components can be nested and combined to build more complex UIs.

// 2. **Virtual DOM**:
//    - React uses a virtual DOM (Document Object Model) which is a lightweight representation of the actual DOM.
//    - When data changes, React updates the virtual DOM first and then efficiently updates the actual DOM only where necessary. This makes for smoother, faster updates and improved performance.

// 3. **JSX (JavaScript XML)**:
//    - JSX allows you to write HTML-like syntax within your JavaScript code, making it easier to write UI components and making your code more readable.
//    - It's not required, but highly recommended as it integrates well with React's principles.

// 4. **Unidirectional Data Flow**:
//    - Data flows in one direction in React, from parent components to child components. This helps prevent state management issues and makes your code easier to reason about.

// 5. **React Hooks**:
//    - Hooks are functions that let you "hook into" React's features, such as state management and lifecycle methods, without writing class components.
//    - This simplifies code and improves readability.

// 6. **Large and Active Community**:
//    - React has a huge and active community of developers, providing ample resources, support, and third-party libraries.

// ### Benefits of Using React:

// - **Increased Development Speed**: Component-based architecture and a robust ecosystem of libraries and tools speed up development.
// - **Improved Performance**: Virtual DOM and efficient updates result in a smooth and fast user experience.
// - **Maintainability**: Modular code structure and clear separation of concerns make it easy to maintain and update your applications.
// - **Testability**: React's component-based structure makes it easy to write unit tests, ensuring the quality of your code.
// - **Flexibility**: React can be used to build a wide range of applications, from simple websites to complex web apps.

// ### Examples of React's Use:

// - Facebook
// - Instagram
// - Netflix
// - Airbnb
// - Dropbox
// - And many more!

// ### In Summary:

// ReactJS is a powerful and versatile JavaScript library that provides a robust framework for building efficient and engaging user interfaces. It's a popular choice for developers due to its ease of use, scalability, and thriving community support.`;
 //   }

    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }

    newResponse = newResponse.split("*").join("<br>");
    let newResponseArray = newResponse.split(" ");

    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts,
    showResult,
    loading,
    resultData,
    onSent,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
