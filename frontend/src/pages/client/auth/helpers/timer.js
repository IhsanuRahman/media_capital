// Filename - App.js

import React, { useState, useRef, useEffect } from "react";

const App = () => {
	const Ref = useRef(null);
	const [timer, setTimer] = useState("00:00");

	const getTimeRemaining = (e) => {
		const total =
			Date.parse(e) - Date.parse(new Date());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor(
			(total / 1000 / 60) % 60
		);
		
		return {
			total,
			minutes,
			seconds,
		};
	};

	const startTimer = (e) => {
		let { total, minutes, seconds } =
			getTimeRemaining(e);
		if (total >= 0) {
			setTimer(
				(minutes > 9
					? minutes
					: "0" + minutes) +
				":" +
				(seconds > 9 ? seconds : "0" + seconds)
			);
		}
	};

	const clearTimer = (e) => {
		setTimer("00:00:10");
		if (Ref.current) clearInterval(Ref.current);
		const id = setInterval(() => {
			startTimer(e);
		}, 1000);
		Ref.current = id;
	};

	const getDeadTime = () => {
		let deadline = new Date();
		deadline.setSeconds(deadline.getSeconds() + 10);
		return deadline;
	};

	
	useEffect(() => {
		clearTimer(getDeadTime());
	}, []);

	// Another way to call the clearTimer() to start
	// the countdown is via action event from the
	// button first we create function to be called
	// by the button
	const onClickReset = () => {
		clearTimer(getDeadTime());
	};

	return (
		<div
			style={{ textAlign: "center", margin: "auto" }}>
			<h1 style={{ color: "green" }}>
				GeeksforGeeks
			</h1>
			<h3>Countdown Timer Using React JS</h3>
			<h2>{timer}</h2>
			<button onClick={onClickReset}>Reset</button>
		</div>
	);
};

export default App;
