import Root, { Type } from "./toast.svelte";
import { writable, derived } from "svelte/store";

export interface IToast {
	id: string,
	type: number,
	message: string,
	timeout: number
}

function create_toast_store(default_timeout = 3000) {
	const _toasts = writable<Array<IToast>>([]);

	const send = (message: string, type = Type.INFO, timeout: number = default_timeout) => {

		_toasts.update(state => {
			if (state.length >= 10) return state;
			return [...state, { id: id(), type, message, timeout }]
		})
	};

	let timers = [];

	const toasts = derived(_toasts, ($_toasts: Array<IToast>, set) => {
		set($_toasts)
		if ($_toasts.length > 0) {
			const timer = setTimeout(() => {
				_toasts.update(state => {
					state.shift()
					return state
				})
			}, $_toasts[0].timeout)
			return () => {
				clearTimeout(timer);
			}
		}
	});

	const { subscribe } = toasts;

	return {
		subscribe,
		send,
		info: (msg: string, timeout: number = default_timeout) => send(msg, Type.INFO, timeout),
		success: (msg: string, timeout: number = default_timeout) => send(msg, Type.SUCCESS, timeout),
		danger: (msg: string, timeout: number = default_timeout) => send(msg, Type.DANGER, timeout),
		error: (msg: string, timeout: number = default_timeout) => send(msg, Type.ERROR, timeout),

	}
}

function id() {
	return '_' + Math.random().toString(36).substr(2, 9);
};

export const toastsStore = create_toast_store();

export {
	Root,
	//
	Root as Toast,
};
