import React, { useState, useEffect } from "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm";
import ReactDOM from "https://cdn.jsdelivr.net/npm/react-dom@18.2.0/+esm";
import { motion } from "https://cdn.jsdelivr.net/npm/framer-motion@11.1.7/+esm";
const isSorted = (list) => {
    const limit = list.length - 1;
    return list.every((_, i) => (i < limit ? list[i] <= list[i + 1] : true));
};
const getRandomUniqueNumbers = (n, min, max) => {
    if (n > max - min + 1) {
        throw new Error("Cannot generate more unique numbers than available in range");
    }
    let numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    // Shuffle the array
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, n);
};
function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return [...list];
}
const App = () => {
    const [items, setItems] = useState(getRandomUniqueNumbers(10, 1, 99));
    const [sorting, setSorting] = useState(false);
    const [sortIndex, setSortIndex] = useState(0);
    const onShuffle = () => {
        setSorting(false);
        setSortIndex(0);
        setItems([...shuffle(items)]);
    };
    const onSort = () => setSorting(true);
    useEffect(() => {
        if (!sorting) {
            return;
        }
        // Check if the list is already sorted
        if (isSorted(items)) {
            setSorting(false);
            return;
        }
        const sorted = [...items];
        const toCompare = sorted.slice(sortIndex, sortIndex + 2);
        // Reset sort index when the itteration is depleted
        if (toCompare.length !== 2) {
            setSortIndex(0);
        }
        if (toCompare[0] > toCompare[1]) {
            sorted[sortIndex] = toCompare[1];
            sorted[sortIndex + 1] = toCompare[0];
            setItems(sorted);
        }
        const timeout = setTimeout(() => setSortIndex(sortIndex + 1), 100);
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [sorting, sortIndex]);
    return (React.createElement("div", { className: "container" },
        React.createElement("div", { className: "numbers" }, items.map((n) => (React.createElement(motion.div, { key: n, className: "number", layout: true },
            React.createElement("div", { className: "number" },
                React.createElement("div", { className: "text" }, n),
                React.createElement("div", { className: "shadow" })))))),
        React.createElement("div", { className: "button-group" },
            React.createElement("button", { onClick: onShuffle, className: "button shuffle-button" }, "Shuffle"),
            React.createElement("button", { onClick: onSort, className: `button sort-button ${sorting ? "sorting" : ""}` }, "Sort"))));
};
ReactDOM.render(React.createElement(App, null), document.getElementById("root"));