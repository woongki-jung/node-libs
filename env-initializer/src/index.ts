import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { DotenvParseOutput, parse } from 'dotenv';
import * as crypto from 'crypto-js';

export interface IEnvInitOption {
	devSuffix?: string;
	prodSuffix?: string;
	isDev?: boolean;
	appRootPath: string;
	encKey: string;
}

let option: IEnvInitOption = {
	devSuffix: 'dev',
	prodSuffix: 'prod',
	isDev: process.env.NODE_ENV !== 'production',
	appRootPath: '',
	encKey: 'env-initializer',
};

export function envInit(opt?: IEnvInitOption) {
	setOption(opt);

	if (option.isDev) {
		//암호화 파일 생성
		if (existsSync(getEnvPath())) {
			const origin = readFileSync(getEnvPath(), { encoding: 'utf8' });

			const enc = origin
				.split('\n')
				.map((line) => {
					const key = line.substring(0, line.indexOf('='));
					const val = line.substring(line.indexOf('=') + 1);
					const encVal = crypto.AES.encrypt(
						val,
						option.encKey,
					).toString();

					return `${key}=${encVal}`;
				})
				.join('\n');

			writeFileSync(getEncEnvPath(), enc, { encoding: 'utf8' });
		} else {
			console.log(`env-initializer: 원본 .env.prod 파일 없음!!`);
		}
	}

	const env = getEnv();
	process.env = {
		...process.env,
		...env,
	};
}

export function getEnv(opt?: IEnvInitOption) {
	setOption(opt);

	let env: DotenvParseOutput;

	if (option.isDev) {
		const envStr = readFileSync(getDevEnvPath(), { encoding: 'utf8' });
		env = parse(Buffer.from(envStr));
	} else if (existsSync(getEncEnvPath())) {
		const envStr = readFileSync(getEncEnvPath(), { encoding: 'utf8' });
		env = parse(Buffer.from(envStr));

		for (const key in env) {
			try {
				const decVal = crypto.AES.decrypt(
					env[key],
					option.encKey,
				).toString(crypto.enc.Utf8);

				if (decVal) {
					env[key] = decVal;
				}
			} catch {
				console.log(
					`env-initializer - 값 복호화 실패!! - ${key} / ${process.env[key]}`,
				);
			}
		}
	} else {
		console.log(`env-initializer: 암호화 env파일 없음!!`);
	}

	env['APP_ROOT_PATH'] = option.appRootPath;
	return env;
}

function setOption(opt?: IEnvInitOption) {
	if (!opt) return;

	option = {
		...option,
		...opt,
	};
}

function getDevEnvPath() {
	return path.resolve(option.appRootPath, `.env.${option.devSuffix}`);
}
function getEnvPath() {
	return path.resolve(option.appRootPath, `.env.${option.prodSuffix}`);
}
function getEncEnvPath() {
	return path.resolve(option.appRootPath, `.env.${option.prodSuffix}.enc`);
}
