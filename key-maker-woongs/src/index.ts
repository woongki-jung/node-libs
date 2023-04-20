interface RandomKeyOption {
	len: number;
	offset?: number;
	useUpperCase?: boolean;
	useLowerCase?: boolean;
	useNumber?: boolean;
	usableChars?: string;
}
const defaultRandomKeyOption: RandomKeyOption = {
	len: 8,
	offset: 0,
	useUpperCase: true,
	useLowerCase: true,
	useNumber: true,
};

const upperCaseChars = 'ABCDEFGHIJKMLNOPQRSTUVWXYZ';
const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '1234567890';

function makeOption(option: RandomKeyOption) {
	return {
		...defaultRandomKeyOption,
		...option,
	};
}
function getKeyChars(option: RandomKeyOption) {
	return !option.usableChars
		? (option.useUpperCase ? upperCaseChars : '') +
				(option.useNumber ? numberChars : '') +
				(option.useLowerCase ? lowerCaseChars : '')
		: option.usableChars;
}

export function getRandomId(opt?: RandomKeyOption) {
	return getRandomKey({
		...{len: 12, useNumber: false},
		...(opt ?? {})
	});
}

export function getRandomKey(opt?: RandomKeyOption) {
	const option = makeOption(opt);
	const keyChars = getKeyChars(option);

	let returnKey = '';

	for (let i = 0; i < option.len; i++) {
		returnKey += keyChars[Math.floor(Math.random() * keyChars.length)];
	}

	return returnKey;
}

export function IndexToKey(idx: number, opt?: RandomKeyOption) {
	const option = makeOption(opt);
	const keyChars = getKeyChars(option);

	if (idx < 1) throw `변환할 키값은 항상 0보다 커야 합니다.`;

	const minIdx = Math.pow(keyChars.length, option.len - 1);
	const maxIdx = minIdx * keyChars.length - 1;

	if (minIdx + idx + option.offset > maxIdx)
		throw `${option.len}자리 키에서는 최대 ${
			maxIdx - minIdx - option.offset
		}까지의 키값만 적용 가능합니다. 입력값: ${idx}`;

	const keyIdxStr = (minIdx + idx).toString();
	let keyIdx = parseInt(
		keyIdxStr[0] + keyIdxStr.substring(1).split('').reverse().join(''),
	);

	let returnKey = '';
	while (keyIdx > 0) {
		returnKey += keyChars[keyIdx % keyChars.length];
		keyIdx = Math.floor(keyIdx / keyChars.length);
	}

	return returnKey;
}

export function getUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
		/[xy]/g,
		function (c) {
			const r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		},
	);
}
